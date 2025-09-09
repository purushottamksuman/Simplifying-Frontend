import { createClient } from 'npm:@supabase/supabase-js@2.57.2'
import { createHmac } from 'node:crypto'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface VerifyPaymentRequest {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  payment_id: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      payment_id 
    }: VerifyPaymentRequest = await req.json()

    // Verify signature
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay secret not configured')
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature')
    }

    // Fetch payment details from Razorpay
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
      },
    })

    if (!paymentResponse.ok) {
      throw new Error('Failed to fetch payment details from Razorpay')
    }

    const paymentDetails = await paymentResponse.json()

    // Update payment record in database
    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        status: paymentDetails.status === 'captured' ? 'completed' : 'failed',
        payment_method: paymentDetails.method,
        notes: {
          ...paymentDetails,
          verified_at: new Date().toISOString()
        }
      })
      .eq('payment_id', payment_id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error('Failed to update payment record')
    }

    // Log activity
    await supabase
      .from('user_activity_logs')
      .insert({
        user_id: user.id,
        activity_type: 'payment_completed',
        activity_details: {
          payment_id,
          razorpay_order_id,
          razorpay_payment_id,
          amount: updatedPayment.amount,
          description: updatedPayment.description
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        payment: updatedPayment,
        message: 'Payment verified successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error verifying payment:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment verification failed'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})