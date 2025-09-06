import { createClient } from 'npm:@supabase/supabase-js@2.57.2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface VerifyOTPRequest {
  email: string;
  otp_code: string;
}

Deno.serve(async (req: Request) => {
  console.log(`📨 Received ${req.method} request to verify-otp function`);
  
  if (req.method === "OPTIONS") {
    console.log("✅ Handling CORS preflight request");
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log("🔧 Supabase client created for verification");

    if (req.method === 'POST') {
      console.log("📝 Processing OTP verification request");
      
      const requestBody = await req.text();
      console.log("📦 Raw request body:", requestBody);
      
      const { email, otp_code }: VerifyOTPRequest = JSON.parse(requestBody);
      console.log("📋 Parsed verification data:", { email, otp_code });

      if (!email || !otp_code) {
        console.error("❌ Missing required fields:", { email: !!email, otp_code: !!otp_code });
        return new Response(
          JSON.stringify({ error: 'Email and OTP code are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Find valid OTP
      console.log("🔍 Looking for valid OTP in database...");
      const { data: otpRecord, error: otpError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('email', email)
        .eq('otp_code', otp_code)
        .eq('is_verified', false)
        .gt('expires_at', new Date().toISOString())
        .lt('attempts', 5)
        .single();

      if (otpError || !otpRecord) {
        console.error("❌ Invalid OTP or not found:", otpError);
        
        // Increment attempts for failed verification
        await supabase
          .from('otp_verifications')
          .update({ attempts: supabase.raw('attempts + 1') })
          .eq('email', email)
          .eq('otp_code', otp_code);

        return new Response(
          JSON.stringify({ error: 'Invalid or expired OTP' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log("✅ Valid OTP found:", otpRecord);

      // Mark OTP as verified
      console.log("✅ Marking OTP as verified...");
      const { error: updateError } = await supabase
        .from('otp_verifications')
        .update({ 
          is_verified: true, 
          verified_at: new Date().toISOString(),
          attempts: supabase.raw('attempts + 1')
        })
        .eq('id', otpRecord.id);

      if (updateError) {
        console.error("❌ Failed to update OTP record:", updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to verify OTP' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log("✅ OTP verified successfully!");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP verified successfully' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("❌ Method not allowed:", req.method);
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});