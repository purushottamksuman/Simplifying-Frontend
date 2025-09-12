// src/components/onboarding/OnboardingFlow.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { PropertyStudent1Subsection } from "../../screens/Frame/sections/PropertyStudent1Subsection/PropertyStudent1Subsection";
import { PropertyStudent2Subsection } from "../../screens/Frame/sections/PropertyStudent2Subsection/PropertyStudent2Subsection";
import { PropertyStudent3Subsection } from "../../screens/Frame/sections/PropertyStudent3Subsection/PropertyStudent3Subsection";
import { PropertyStudent4Subsection } from "../../screens/Frame/sections/PropertyStudent4Subsection/PropertyStudent4Subsection";
import { PropertyStudent5Subsection } from "../../screens/Frame/sections/PropertyStudent5Subsection/PropertyStudent5Subsection";
import { PropertyStudent6Subsection } from "../../screens/Frame/sections/PropertyStudent6Subsection/PropertyStudent6Subsection";
import { DivSubsection } from "../../screens/Frame/sections/DivSubsection/DivSubsection";
import { SectionComponentNodeSubsection } from "../../screens/Frame/sections/SectionComponentNodeSubsection/SectionComponentNodeSubsection";

type FormData = {
    
    full_name?: string,
  dob?: string;
  edu_level?: string;
  career_domain?: string;
  hobbies?: string[] | string;
  goals?: string;
  lang_pref?: string;
  ref_source?: string;
};

export const OnboardingFlow: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string>("student");
  const totalSteps = 8;

  // Fetch user info from Supabase Auth
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      const user = data.user;
      if (!user) {
        console.error("No user found!");
        return;
      }
      setUserId(user.id);
      setEmail(user.email);
      // user_metadata might contain user_type
      setUserType(user.user_metadata?.user_type || "student");
    };
    fetchUser();
  }, []);

  const saveStepToDB = async (partial: Partial<FormData>) => {
    if (!userId || !email) {
      console.error("Missing required fields (userId or email). Cannot save step.");
      return false;
    }

    const payload = {
      id: userId,
      email,
      user_type: userType,
      ...formData,
      ...partial,
    };

    const { error } = await supabase
      .from("user_profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Onboarding save error:", error);
      return false;
    }

    setFormData((p) => ({ ...p, ...partial }));
    return true;
  };

  const handleNext = async (fieldKey: keyof FormData, value: any) => {
    const partial = { [fieldKey]: value } as Partial<FormData>;
    const ok = await saveStepToDB(partial);
    if (!ok) return;

    if (step >= totalSteps) {
      await supabase.from("user_profiles").upsert(
        {
          id: userId!,
          email: email!,
          user_type: userType,
          onboarded: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );
      onFinish?.();
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-[980px] max-w-full mx-4">
            {step === 1 && (
          <DivSubsection
            initialValue={formData.full_name}
            onNext={(val: string) => handleNext("full_name", val)}
          />
        )}
                {step === 2 && (
          <SectionComponentNodeSubsection
            initialValue={formData.dob}
            onNext={(val: string) => handleNext("dob", val)}
          />
        )}
        
        {step === 3 && (
          <PropertyStudent1Subsection
            initialValue={formData.edu_level}
            onNext={(val: string) => handleNext("edu_level", val)}
          />
        )}
        {step === 4 && (
          <PropertyStudent2Subsection
            initialValue={formData.career_domain}
            onNext={(val: string) => handleNext("career_domain", val)}
            onBack={handleBack}
          />
        )}
        {step === 5 && (
          <PropertyStudent3Subsection
            initialValue={formData.hobbies}
            onNext={(val: string) => handleNext("hobbies", val)}
            onBack={handleBack}
          />
        )}
        {step === 6 && (
          <PropertyStudent4Subsection
            initialValue={formData.goals}
            onNext={(val: string) => handleNext("goals", val)}
            onBack={handleBack}
          />
        )}
        {step === 7 && (
          <PropertyStudent5Subsection
            initialValue={formData.lang_pref}
            onNext={(val: string) => handleNext("lang_pref", val)}
            onBack={handleBack}
          />
        )}
        {step === 8 && (
          <PropertyStudent6Subsection
            initialValue={formData.ref_source}
            onNext={(val: string) => handleNext("ref_source", val)}
            onBack={handleBack}
          />
        )}
        

        {/* Skip button */}
        <div className="absolute top-4 right-4">
          <button className="text-sm text-gray-600" onClick={() => onFinish?.()}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
