import { createClient } from 'npm:@supabase/supabase-js@2.57.2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface OTPRequest {
  email: string;
  phone?: string;
  otp_type: string;
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send email using a simple email service (you can replace with your preferred service)
async function sendOTPEmail(email: string, otpCode: string): Promise<boolean> {
  try {
    // For demo purposes, we'll log the OTP
    // In production, integrate with email service like SendGrid, Resend, etc.
    console.log(`OTP for ${email}: ${otpCode}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
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
      const { email, phone, otp_type }: OTPRequest = await req.json();

      if (!email || !otp_type) {
        return new Response(
          JSON.stringify({ error: 'Email and OTP type are required' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Generate OTP
      const otpCode = generateOTP();

      // Store OTP in database
      const { data, error } = await supabase
        .from('otp_verifications')
        .insert({
          email,
          phone,
          otp_code: otpCode,
          otp_type,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create OTP verification' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Send OTP via email
      const emailSent = await sendOTPEmail(email, otpCode);

      if (!emailSent) {
        return new Response(
          JSON.stringify({ error: 'Failed to send OTP email' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent successfully',
          otp_id: data.id 
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