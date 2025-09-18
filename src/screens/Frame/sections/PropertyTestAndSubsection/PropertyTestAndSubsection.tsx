import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { supabase } from "../../../../lib/supabase";
import { razorpayService } from "../../../../lib/razorpay";
import { authHelpers } from "../../../../lib/supabase";
import { useNavigate } from "react-router-dom";

interface Exam {
  exam_id: string;
  exam_name: string;
  description: string;
  original_price: number;
  discounted_price: number;
  tax: number;
  total_time: number;
  maximum_marks: number;
  is_active: boolean;
}

const PropertyTestAndSubsection = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const [userPurchases, setUserPurchases] = useState<string[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Fetch user & exams
  useEffect(() => {
    const init = async () => {
      try {
        const { user, error } = await authHelpers.getCurrentUser();
        if (error || !user) {
          console.log("❌ No authenticated user, redirecting to login");
          navigate("/login");
          return;
        }

        setUser(user);
        await fetchExams();
        await fetchUserPurchases(user.id);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const fetchExams = async () => {
    try {
      const { data, error } = await supabase
        .from("exams")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExams(data || []);
    } catch (error) {
      console.error("Error fetching exams:", error);
    }
  };

  const fetchUserPurchases = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("exam_purchases")
        .select("exam_id")
        .eq("user_id", userId);

      if (error) throw error;
      setUserPurchases(data?.map((p) => p.exam_id) || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const handleExamPayment = async (exam: Exam) => {
    setPaymentLoading(true);
    setPaymentError("");
    setPaymentSuccess(false);

    try {
      const totalAmount = exam.discounted_price + exam.tax;

      const paymentResult = await razorpayService.initiatePayment({
        amount: totalAmount,
        currency: "INR",
        description: `${exam.exam_name} - Exam Payment`,
        notes: {
          product: "exam_purchase",
          exam_id: exam.exam_id,
          exam_name: exam.exam_name,
          user_id: user?.id,
          original_price: exam.original_price,
          discounted_price: exam.discounted_price,
          tax: exam.tax,
        },
      });

      if (paymentResult.success) {
        const { error: purchaseError } = await supabase
          .from("exam_purchases")
          .upsert(
            {
              user_id: user.id,
              exam_id: exam.exam_id,
              payment_id: paymentResult.payment.payment_id,
              purchase_type: "paid",
              amount_paid: totalAmount,
            },
            { onConflict: "user_id,exam_id" }
          );

        if (purchaseError && !purchaseError.message.includes("duplicate key")) {
          throw new Error("Failed to record purchase");
        }

        setPaymentSuccess(true);
        alert(`🎉 Payment successful! You now have access to ${exam.exam_name}.`);
        await fetchUserPurchases(user.id);
      }
    } catch (error: any) {
      console.error("❌ Payment failed:", error);
      setPaymentError(error.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFreeExamAccess = async (exam: Exam) => {
    try {
      const { error: purchaseError } = await supabase
        .from("exam_purchases")
        .upsert(
          {
            user_id: user.id,
            exam_id: exam.exam_id,
            payment_id: null,
            purchase_type: "free",
            amount_paid: 0,
          },
          { onConflict: "user_id,exam_id" }
        );

      if (purchaseError && !purchaseError.message.includes("duplicate key")) {
        throw new Error("Failed to record free access");
      }

      alert(`✅ You now have access to ${exam.exam_name}!`);
      await fetchUserPurchases(user.id);
    } catch (error) {
      console.error("Error recording free access:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <div className="text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h2 className="font-bold text-[#13377c] text-3xl mb-4">Test & Assessment</h2>
        <p className="text-gray-600 text-lg">
          Choose from our available exams and assessments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const totalPrice = exam.discounted_price + exam.tax;
          const isFree = totalPrice === 0;
          const isPurchased = userPurchases.includes(exam.exam_id);

          return (
            <Card
              key={exam.exam_id}
              className="rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <h3 className="font-bold text-[#13377c] text-xl mb-3">
                    {exam.exam_name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {exam.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{exam.total_time} minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Marks:</span>
                      <span className="font-medium">{exam.maximum_marks}</span>
                    </div>

                    {/* Pricing Section */}
                    {!isFree && (
                      <div className="border-t pt-3 space-y-2">
                        {exam.original_price > exam.discounted_price && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Original Price:</span>
                            <span className="text-gray-500 line-through">
                              ₹{exam.original_price}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">Price:</span>
                          <span className="text-[#3479ff] font-semibold">
                            ₹{exam.discounted_price}
                          </span>
                        </div>

                        {exam.tax > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">Tax:</span>
                            <span className="text-gray-700">₹{exam.tax}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between font-semibold border-t pt-2">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-[#3479ff] text-lg">₹{totalPrice}</span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => {
                        if (isPurchased) {
                          navigate(`/exam-details/${exam.exam_id}`);
                        } else if (isFree) {
                          handleFreeExamAccess(exam);
                        } else {
                          handleExamPayment(exam);
                        }
                      }}
                      // disabled
                      // disabled={paymentLoading}
                      className={`w-full mt-4 ${
                        isPurchased
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-[#3479ff] hover:bg-[#2968e6]"
                      } text-white rounded-xl`}
                    >
                      {paymentLoading
                        ? "Processing..."
                        : isPurchased
                        ? "View Exam"
                        : isFree
                        ? "Attempt Free"
                        : `Pay ₹${totalPrice}`}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {paymentError && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{paymentError}</p>
        </div>
      )}

      {paymentSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">
            ✅ Payment completed successfully!
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyTestAndSubsection;
