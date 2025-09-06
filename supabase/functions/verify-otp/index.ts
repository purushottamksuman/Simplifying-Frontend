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
  if (req.method === "OPTIONS") {
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

    if (req.method === 'POST') {
      const { email, otp_code }: VerifyOTPRequest = await req.json();

      if (!email || !otp_code) {
        return new Response(
          JSON.stringify({ error: 'Email and OTP code are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Find valid OTP
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

      // Mark OTP as verified
      const { error: updateError } = await supabase
        .from('otp_verifications')
        .update({ 
          is_verified: true, 
          verified_at: new Date().toISOString(),
          attempts: supabase.raw('attempts + 1')
        })
        .eq('id', otpRecord.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to verify OTP' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

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

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});