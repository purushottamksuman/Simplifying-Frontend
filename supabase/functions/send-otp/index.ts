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
    console.log(`🔐 OTP for ${email}: ${otpCode}`);
    console.log(`📧 Email would be sent to: ${email}`);
    console.log(`🔢 OTP Code: ${otpCode}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

Deno.serve(async (req: Request) => {
  console.log(`📨 Received ${req.method} request to send-otp function`);
  
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

    console.log("🔧 Supabase client created");
    console.log("🌐 Supabase URL:", Deno.env.get('SUPABASE_URL') ? "✅ Set" : "❌ Missing");
    console.log("🔑 Service Role Key:", Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ? "✅ Set" : "❌ Missing");

    if (req.method === 'POST') {
      console.log("📝 Processing POST request");
      
      const requestBody = await req.text();
      console.log("📦 Raw request body:", requestBody);
      
      const { email, phone, otp_type }: OTPRequest = JSON.parse(requestBody);
      console.log("📋 Parsed request data:", { email, phone, otp_type });

      if (!email || !otp_type) {
        console.error("❌ Missing required fields:", { email: !!email, otp_type: !!otp_type });
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
      console.log("🎲 Generated OTP:", otpCode);

      // Store OTP in database
      console.log("💾 Storing OTP in database...");
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
        console.error('❌ Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to create OTP verification', details: error.message }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log("✅ OTP stored in database:", data);

      // Send OTP via email
      console.log("📧 Sending OTP email...");
      const emailSent = await sendOTPEmail(email, otpCode);

      if (!emailSent) {
        console.error("❌ Failed to send email");
        return new Response(
          JSON.stringify({ error: 'Failed to send OTP email' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log("✅ OTP sent successfully!");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent successfully',
          otp_id: data.id,
          debug_otp: otpCode // Remove this in production
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