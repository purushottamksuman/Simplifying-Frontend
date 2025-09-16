import React from "react";
import { Button } from "../components/ui/button";

type Exam = {
  id: string;
  name: string;
  discounted_price: number;
  tax: number;
};

type PaymentRequiredProps = {
  examName: string;
  exams?: Exam[];
  handleExamPayment?: (exam: Exam) => void;
  paymentLoading?: boolean;
  onViewExam?: () => void; // Callback to navigate to exam
  isPurchased?: boolean; // Indicates if user already has access
};

export const PaymentRequired: React.FC<PaymentRequiredProps> = ({
  examName,
  exams = [],
  handleExamPayment = () => {},
  paymentLoading = false,
  onViewExam = () => {},
  isPurchased = false,
}) => {
  // Find first paid exam
  const paidExam = exams.find((e) => e.discounted_price + e.tax > 0);
  const totalPrice = paidExam ? paidExam.discounted_price + paidExam.tax : 0;

  return (
    <div className="bg-gradient-to-r from-[#e9efff] to-[#f0f4ff] rounded-2xl p-6 relative overflow-hidden w-full max-w-7xl shadow-lg mx-auto mt-20">
      <div className="relative z-10">
        <h4 className="font-bold text-gray-900 text-2xl mb-3">
          Access Your {examName}
        </h4>
        <p className="text-gray-700 text-base mb-6 leading-relaxed">
          Complete your payment to unlock the full {examName} and gain personalized insights, track your progress, and boost your learning journey.
        </p>

        {isPurchased ? (
          <Button
            onClick={onViewExam}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-semibold"
          >
            View Exam
          </Button>
        ) : paidExam ? (
          <Button
            onClick={() => handleExamPayment(paidExam)}
            disabled={paymentLoading}
            className="bg-[#3479ff] hover:bg-[#2968e6] text-white px-8 py-3 rounded-xl font-semibold"
          >
            {paymentLoading ? "Processing..." : `Pay ₹${totalPrice}`}
          </Button>
        ) : (
          <p className="text-gray-500">No paid exams are currently available.</p>
        )}
      </div>

      {/* Decorative Image */}
      <img
        className="absolute top-1/2 right-6 -translate-y-1/2 w-40 h-auto opacity-90"
        alt="Payment illustration"
        src="/CashlessPayment.png"
      />
    </div>
  );
};
