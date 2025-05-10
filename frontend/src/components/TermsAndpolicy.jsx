import React from "react";
import { useNavigate } from "react-router-dom";

function TermsAndPolicy() {
  const navigate = useNavigate();
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">Terms and Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Agreement to Terms</h2>
        <p>
          By using the Find My Shelter room rental platform, you agree to these Terms and
          Conditions. If you do not agree, please refrain from using our service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Accuracy of Information</h2>
        <p>
          All users must ensure the accuracy of the information provided during registration,
          rental requests, and property listings. Misleading or false information may result in
          the suspension or removal of your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Rental Agreements</h2>
        <p>
          By submitting a rental request, you acknowledge that the system may generate a
          digital agreement using your provided details. You are responsible for reviewing and
          accepting the agreement before moving in.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Collection and Use</h2>
        <p>
          We collect basic personal information (name, contact details, address) to facilitate
          the rental process. This data is stored securely and used solely for service-related
          operations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Privacy Protection</h2>
        <p>
          We do not sell or share your personal data with third parties without your
          permission. Only authorized team members can access your data, and only for relevant
          service purposes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Updates to Terms</h2>
        <p>
          Terms and policies are subject to change. Users will be notified of major updates,
          but it is your responsibility to review this page periodically.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-6 text-center">
        Last updated: {lastUpdated}
      </p>
    </div>
  );
}

export default TermsAndPolicy;
