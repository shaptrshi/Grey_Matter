import React, { useEffect } from "react";

function PrivacyPolicy() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-custom-dark rounded-lg">
      {/* Page Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-500 dark:text-green-400">
        Privacy Policy
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
        Effective Date: <span className="font-semibold">[Insert Date]</span> | Last Updated: <span className="font-semibold">[Insert Date]</span>
      </p>

      {/* Introduction */}
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
        At <span className="font-semibold">[Your Blog Name]</span>, we are committed to protecting your privacy. This Privacy Policy explains how we 
        collect, use, disclose, and safeguard your information when you visit our blog.
      </p>

      {/* 1. Information We Collect */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          1. Information We Collect
        </h2>

        {/* A. Automatically Collected Data */}
        <h3 className="mt-4 font-semibold text-gray-800 dark:text-gray-200">A. Automatically Collected Data</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <span className="font-semibold">Log Data:</span> Our servers automatically collect your IP address, browser type, device information, and pages visited.
          </li>
          <li>
            <span className="font-semibold">Cookies & Tracking Technologies:</span> We use cookies and analytics tools (like Google Analytics) to improve user experience. You can disable cookies in your browser settings.
          </li>
        </ul>

        {/* B. Voluntarily Provided Data */}
        <h3 className="mt-4 font-semibold text-gray-800 dark:text-gray-200">B. Voluntarily Provided Data</h3>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <span className="font-semibold">Newsletter Subscription:</span> If you subscribe, we may collect your name and email.
          </li>
          <li>
            <span className="font-semibold">Comments & Contact Forms:</span> If you leave a comment or contact us, we may collect your name and email.
          </li>
        </ul>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          We do not collect sensitive personal data such as financial information, government-issued IDs, or biometric data.
        </p>
      </section>

      {/* 2. How We Use Your Information */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          2. How We Use Your Information
        </h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Website improvement and performance tracking.</li>
          <li>Personalizing your experience based on preferences.</li>
          <li>Responding to inquiries, comments, or support requests.</li>
          <li>Sending newsletters or updates (only if subscribed, with opt-out options).</li>
        </ul>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          We do not sell, rent, or trade personal data to third parties.
        </p>
      </section>

      {/* 3. Third-Party Services & Data Sharing */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          3. Third-Party Services & Data Sharing
        </h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <span className="font-semibold">Analytics & Tracking:</span> We use services like Google Analytics to track traffic, but your IP may be anonymized.
          </li>
          <li>
            <span className="font-semibold">Embedded Content & External Links:</span> Articles may contain embedded content (e.g., videos, social media links), which behave like external sites. Their privacy policies apply.
          </li>
          <li>
            <span className="font-semibold">Legal Compliance:</span> We may share data if required by law enforcement or to protect our legal rights.
          </li>
        </ul>
      </section>

      {/* 4. Your Rights & Choices */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          4. Your Rights & Choices
        </h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Opt-out of cookies via browser settings.</li>
          <li>Unsubscribe from newsletters anytime.</li>
          <li>Request data deletion by contacting us.</li>
          <li>Disable tracking via browser extensions.</li>
        </ul>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          For any requests, email <span className="font-semibold">[Your Contact Email]</span>.
        </p>
      </section>

      {/* 5. Data Protection & Security */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          5. Data Protection & Security
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
          We implement industry-standard security measures to protect your data, but no system is 100% secure.
        </p>
      </section>
    </div>
  );
}

export default PrivacyPolicy;