import React from "react";

export const SomethingWentWrong: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center p-6">
      {/* Error illustration */}
      <img
        src="/Container (1).png"
        alt="Error Illustration"
        width={400}
        height={300}
        className="mb-6"
      />

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-semibold text-[#2563EB] mb-2">
        Opps! Something Went Wrong
      </h1>

      {/* Sub text */}
      <p className="text-gray-500 mb-6">
        You didn’t break the internet, but we can’t find what you are looking for.
      </p>

      {/* Button */}
      <button
        onClick={() => window.location.reload()}
        className="px-10 py-3 bg-[#2563EB] text-white font-medium rounded-md hover:bg-[#1E40AF] transition"
      >
        Try again
      </button>
    </div>
  );
};
