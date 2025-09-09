import { supabase } from './supabase'

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency?: string;
  description: string;
  notes?: Record<string, any>;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export class RazorpayService {
  private static instance: RazorpayService;
  private razorpayLoaded = false;

  private constructor() {}

  public static getInstance(): RazorpayService {
    if (!RazorpayService.instance) {
      RazorpayService.instance = new RazorpayService();
    }
    return RazorpayService.instance;
  }

  // Load Razorpay script
  private async loadRazorpayScript(): Promise<void> {
    if (this.razorpayLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.head.appendChild(script);
    });
  }

  // Create Razorpay order
  private async createOrder(options: PaymentOptions) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-razorpay-order`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      }
    );

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to create order');
    }

    return result;
  }

  // Verify payment
  private async verifyPayment(
    razorpayResponse: RazorpayResponse,
    paymentId: string
  ) {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-razorpay-payment`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...razorpayResponse,
          payment_id: paymentId,
        }),
      }
    );

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Payment verification failed');
    }

    return result;
  }

  // Main payment method
  public async initiatePayment(options: PaymentOptions): Promise<any> {
    try {
      // Load Razorpay script
      await this.loadRazorpayScript();

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user profile for contact info
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email, phone, full_name')
        .eq('id', user.id)
        .single();

      // Create order
      const orderResult = await this.createOrder(options);
      const { order, payment_id } = orderResult;

      // Configure Razorpay options
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Skillsphere',
        description: options.description,
        order_id: order.id,
        prefill: {
          name: profile?.full_name || user.email?.split('@')[0] || '',
          email: profile?.email || user.email || '',
          contact: profile?.phone || '',
        },
        theme: {
          color: '#3479ff',
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
          },
        },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verificationResult = await this.verifyPayment(response, payment_id);
            console.log('Payment verified successfully:', verificationResult);
            
            // Return success
            return {
              success: true,
              payment: verificationResult.payment,
              razorpay_response: response
            };
          } catch (error) {
            console.error('Payment verification failed:', error);
            throw error;
          }
        },
      };

      // Open Razorpay checkout
      return new Promise((resolve, reject) => {
        const razorpay = new window.Razorpay({
          ...razorpayOptions,
          handler: async (response: RazorpayResponse) => {
            try {
              const verificationResult = await this.verifyPayment(response, payment_id);
              resolve({
                success: true,
                payment: verificationResult.payment,
                razorpay_response: response
              });
            } catch (error) {
              reject(error);
            }
          },
        });

        razorpay.open();
      });

    } catch (error) {
      console.error('Payment initiation failed:', error);
      throw error;
    }
  }
}

export const razorpayService = RazorpayService.getInstance();