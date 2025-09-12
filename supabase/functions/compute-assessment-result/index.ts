// Supabase Edge Function: compute-assessment-result
// Expects body: { submissionId, studentId, version, submissions, questions }
// Writes to public.assessment_results

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

type QuestionType = "aptitude" | "psychometric" | "adversity" | "sei" | "interest";

interface QuestionOption { id: string | number; text: string }
interface QuestionBase { id: string | number; type: QuestionType; category: string; correctOptionId?: string | number; options: QuestionOption[] }
interface SubmissionItem { questionId: string | number; selectedOptionId: string | number }

// Light bundling: we reimplement minimal parts needed here to avoid bundling the entire app library
function toKey(s: string) { return s.trim().toLowerCase(); }

const PSY = { "extremely unlikely":1, "unlikely":2, "neutral":3, "likely":4, "extremely likely":5 } as const;
const ADV = { "never":1, "extremely unlikely":1, "almost never":2, "unlikely":2, "sometimes":3, "neutral":3, "almost always":4, "likely":4, "always":5, "extremely likely":5 } as const;
const SEI = { "not at all":1, "never":1, "slightly":2, "almost never":2, "fairly":3, "sometimes":3, "almost always":4, "moderately":4, "extremely":5, "always":5 } as const;
const INTEREST_AGREE = "agree";
const PSY_MAX = 25;
const INTEREST_MAX = 5;
const APT_V2: Record<string, number> = { vr:6, na:7, ar:6, psa:8, mr:6, sr:6, lu:6 };

function normalizeSeiScoreToBand(s: number) {
  if (s>=47&&s<=50) return 10; if (s>=44&&s<=46) return 9; if (s>=41&&s<=43) return 8; if (s>=39&&s<=40) return 7; if (s>=37&&s<=38) return 6; if (s>=34&&s<=36) return 5; if (s>=31&&s<=33) return 4; if (s>=26&&s<=30) return 3; if (s>=21&&s<=25) return 2; if (s>=10&&s<=20) return 1; return 0;
}

serve(async (req) => {
  try {
    const { submissionId, studentId, version, submissions, questions } = await req.json();
    const questionById = new Map<any, QuestionBase>();
    for (const q of questions as QuestionBase[]) questionById.set(q.id, q);

    const psych: Record<string, number> = {}; const apt: Record<string, number> = {}; const advr: Record<string, number> = {}; const sei: Record<string, number> = {}; const ints: Record<string, number> = {};

    for (const it of submissions as SubmissionItem[]) {
      const q = questionById.get(it.questionId) as QuestionBase | undefined; if (!q) continue;
      const cat = toKey(q.category);
      const sel = q.options.find(o=>o.id===it.selectedOptionId); const txt = sel? toKey(sel.text):"";
      if (q.type === "aptitude") { apt[cat] = (apt[cat]??0) + (q.correctOptionId===it.selectedOptionId?1:0); continue; }
      if (q.type === "psychometric") { psych[cat] = (psych[cat]??0) + (PSY as any)[txt]??0; continue; }
      if (q.type === "adversity") { advr[cat] = (advr[cat]??0) + (ADV as any)[txt]??0; continue; }
      if (q.type === "sei") { sei[cat] = (sei[cat]??0) + (SEI as any)[txt]??0; continue; }
      if (q.type === "interest") { ints[cat] = (ints[cat]??0) + (txt===INTEREST_AGREE?1:0); continue; }
    }

    const aptScores: Record<string, any> = {}; const aptMax = APT_V2;
    for (const k of Object.keys(apt)) {
      const raw = apt[k]; const max = aptMax[k] ?? raw; const pct = max>0? (raw/max)*100:0; const lvl = pct>=77?"High": pct>=24?"Moderate":"Low"; aptScores[k] = { categoryScore: raw, categoryPercentage: +pct.toFixed(2), categoryScoreLevel: lvl };
    }

    const psyScores: Record<string, any> = {};
    for (const k of Object.keys(psych)) {
      const raw = psych[k]; const pct = (raw/PSY_MAX)*100; const lvl = raw>=17.5?"High": raw>=12.5?"Moderate":"Low"; psyScores[k] = { categoryScore: raw, categoryPercentage: +pct.toFixed(2), categoryScoreLevel: lvl };
    }

    const advScores: Record<string, any> = {}; let advSum = 0;
    for (const k of Object.keys(advr)) { const raw = advr[k]; advSum += raw; const pct = (raw/25)*100; const lvl = pct>=77?"High": pct>=24?"Moderate":"Low"; advScores[k] = { categoryScore: raw, categoryPercentage: +pct.toFixed(2), categoryScoreLevel: lvl }; }
    const aqTotal = advSum*2; const aqLevel = aqTotal>=178?"High": aqTotal>=161?"Moderately High": aqTotal>=135?"Moderate": aqTotal>=118?"Moderately Low":"Low";

    const seiScores: Record<string, any> = {};
    for (const k of Object.keys(sei)) { const raw = sei[k]; const band = normalizeSeiScoreToBand(raw*2); const pct = (band/10)*100; const lvl = band>=8?"High": band>=5?"Moderate":"Low"; seiScores[k] = { categoryScore: band, categoryPercentage: +pct.toFixed(2), categoryScoreLevel: lvl }; }

    const intScores: Record<string, any> = {}; for (const k of Object.keys(ints)) { const raw = ints[k]; const pct = (raw/INTEREST_MAX)*100; const lvl = pct>=77?"High": pct>=24?"Moderate":"Low"; intScores[k] = { categoryScore: raw, categoryPercentage: +pct.toFixed(2), categoryScoreLevel: lvl }; }
    const top3 = Object.entries(ints).map(([k,v])=>({k,v})).sort((a,b)=> (b.v-a.v)||a.k.localeCompare(b.k)).slice(0,3).map(e=> (e.k[0]||"").toUpperCase());

    const breakdown = { psychometric: { categoryWiseScore: psyScores }, aptitude: { categoryWiseScore: aptScores }, adversity: { categoryWiseScore: advScores, aqTotal, aqLevel }, sei: { categoryWiseScore: seiScores }, interest: { categoryWiseScore: intScores, top3 } };

    // Import rule scoring on server: keep it minimal for now; client can compute recommendation details
    const result = { breakdown };

    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_ANON_KEY");
    const resp = await fetch(`${url}/rest/v1/assessment_results`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key!,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ submission_id: submissionId, student_id: studentId, version, result_json: result }),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return new Response(JSON.stringify({ error: txt }), { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
});


