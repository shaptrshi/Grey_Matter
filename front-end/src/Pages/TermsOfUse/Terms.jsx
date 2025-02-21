import React from "react";

function Terms() {
  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-custom-dark rounded-lg">
      {/* Page Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-500 dark:text-green-400">
        Copyright Policy &amp; Infringement Notice
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300 text-center">
        Effective Date: <span className="font-semibold">[Insert Date]</span> | Last Updated: <span className="font-semibold">[Insert Date]</span>
      </p>

      {/* Introductory Paragraph */}
      <p className="mt-4 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
        All content on <span className="font-semibold">[Your Blog Name]</span>, including text, images, and graphics, is protected under copyright law. Unauthorized reproduction, redistribution, or modification of any content without prior written permission is strictly prohibited.
      </p>

      {/* 1. What is Protected? */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          1. What is Protected?
        </h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Original Articles &amp; Blogs</li>
          <li>Graphics, Illustrations, and Media (excluding credited third-party content)</li>
          <li>Research, Reports, and Analytical Work</li>
        </ul>
      </section>

      {/* 2. Permissible Use */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          2. Permissible Use
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          You may:
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Share short excerpts (up to 100 words) with proper attribution and a link to the original post.</li>
          <li>Use for non-commercial educational purposes with full credit.</li>
        </ul>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          You may not:
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Copy, republish, or modify content for commercial use.</li>
          <li>Remove or alter copyright notices.</li>
          <li>Claim content as your own.</li>
        </ul>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          For permission requests, contact <span className="font-semibold">[Your Contact Email]</span>.
        </p>
      </section>

      {/* 3. Reporting Copyright Infringement */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          3. Reporting Copyright Infringement
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          If you believe your copyrighted material has been used without authorization, send an email to <span className="font-semibold">[Your Contact Email]</span> with:
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>A description of the copyrighted work.</li>
          <li>The URL of the infringing content.</li>
          <li>Proof of ownership or authorization.</li>
        </ul>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          We will investigate and take necessary action, including content removal.
        </p>
      </section>
    </div>
  );
}

export default Terms;
