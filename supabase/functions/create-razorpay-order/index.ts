import { createClient } from 'npm:@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface CreateOrderRequest {
  amount: number
  currency?: string
  description: string
  notes?: Record<string, any>
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
    const { amount, currency = 'INR', description, notes = {} }: CreateOrderRequest = await req.json()

    // Validate amount
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    console.log('Razorpay Key ID exists:', !!razorpayKeyId)
    console.log('Razorpay Key Secret exists:', !!razorpayKeySecret)

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error(`Razorpay credentials not configured. Key ID: ${!!razorpayKeyId}, Key Secret: ${!!razorpayKeySecret}`)
    }

    // Generate unique receipt
    const receipt = `receipt_${Date.now()}_${user.id.slice(0, 8)}`

    // Create order with Razorpay
    const orderData = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt,
      notes: {
        ...notes,
        user_id: user.id,
        description
      }
    }

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text()
      console.error('Razorpay API error:', errorData)
      throw new Error('Failed to create Razorpay order')
    }

    const razorpayOrder = await razorpayResponse.json()

    // Save payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        razorpay_order_id: razorpayOrder.id,
        amount: amount,
        currency,
        status: 'pending',
        description,
        receipt,
        notes
      })
      .select()
      .single()

    if (paymentError) {
      console.error('Database error:', paymentError)
      throw new Error('Failed to save payment record')
    }

    // Return order details for frontend
    return new Response(
      JSON.stringify({
        success: true,
        order: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt
        },
        payment_id: payment.payment_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error'
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})