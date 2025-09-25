// pages/Unauthorized.tsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold text-red-600">Access Denied</h1>
      <p className="mt-2 text-gray-600">
        You are not authorized to view this page.
      </p>
      <Link to="/" className="mt-4 text-blue-500 underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default Unauthorized;
