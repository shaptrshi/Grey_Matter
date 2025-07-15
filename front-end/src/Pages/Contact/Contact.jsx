import React from "react";

function Contact() {
  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white dark:bg-custom-dark rounded-lg">
      {/* Page Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-500 dark:text-green-400">
        Contact Us
      </h1>
      <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-gray-800 dark:text-gray-200 text-center">
        Get in Touch | संपर्क करें
      </h2>

      {/* English Section */}
      <section className="mt-6 text-gray-800 dark:text-gray-200 space-y-4">
        <p className="text-justify leading-relaxed">
          Hello! I'm <strong>Robbie Srivastava</strong>, the author of this blog. If you have suggestions, questions, or just want to connect, feel free to email me.
        </p>
        <p>
          <strong>📍 Location:</strong> Noida, India
        </p>
        <p>
          <strong>📧 Email:</strong>{" "}
          <a
            href="mailto:robbiesrivastava@icloud.com"
            className="text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300"
          >
            robbiesrivastava@icloud.com
          </a>
        </p>
      </section>

      {/* Hindi Section */}
      <section className="mt-10 text-gray-700 dark:text-gray-300">
        <h2 className="text-2xl font-semibold text-center">हिन्दी</h2>
        <p className="mt-4 text-justify leading-relaxed">
          नमस्ते! मैं <strong>Robbie Srivastava</strong> हूँ — इस ब्लॉग का लेखक। यदि आपके पास कोई सुझाव, प्रश्न, या संदेश है, तो कृपया मुझे ईमेल करें।
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-2">
          <li><strong>स्थान:</strong> नोएडा, भारत</li>
          <li>
            <strong>ईमेल:</strong>{" "}
            <a
              href="mailto:robbiesrivastava@icloud.com"
              className="text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300"
            >
              robbiesrivastava@icloud.com
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Contact;
