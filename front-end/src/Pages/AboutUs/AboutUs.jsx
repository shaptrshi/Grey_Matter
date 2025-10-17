import React, { useEffect } from "react";

function AboutUs() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white dark:bg-custom-dark rounded-lg">
      {/* Page Heading */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-green-500 dark:text-green-400">
        Grey Matter Blog
      </h1>
      <h2 className="text-xl sm:text-2xl font-semibold mt-4 text-gray-800 dark:text-gray-200 text-center">
        About Me | मेरे बारे में
      </h2>

      {/* Introduction */}
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-justify leading-relaxed">
        Welcome to my blog! This space is dedicated to exploring the intersection of environment, climate, 
        agriculture, sustainable living, and science in India.
      </p>

      {/* Who Am I? */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          Who Am I?
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
          I am a researcher, writer, and lifelong learner passionate about understanding how science and 
          sustainability shape our world. Through this blog, I explore solutions for a greener future, 
          share insights on environmental challenges, and discuss innovations in agriculture and climate resilience.
        </p>
      </section>

      {/* Why This Blog? */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          Why This Blog?
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
          India is at the heart of many environmental and agricultural transitions. This blog serves as a platform to:
        </p>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Raise awareness about climate change and environmental conservation.</li>
          <li>Share scientific insights and research-based solutions for sustainable living.</li>
          <li>Explore innovative approaches in agriculture and rural development.</li>
          <li>Discuss government policies and grassroots initiatives shaping India's green future.</li>
        </ul>
      </section>

      {/* What You'll Find Here */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          What You'll Find Here?
        </h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Articles on climate change, renewable energy, and ecological balance.</li>
          <li>Scientific discussions on agriculture, sustainability, and biodiversity.</li>
          <li>Practical tips on eco-friendly living and reducing carbon footprints.</li>
          <li>Updates on environmental policies and scientific advancements in India.</li>
        </ul>
      </section>

      {/* Let's Connect */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-semibold text-green-500 dark:text-green-400">
          Let's Connect!
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
          This blog is a space for meaningful conversations. If you're passionate about sustainability, 
          science, or green innovations, I'd love to hear from you! Let's work together toward a more 
          sustainable and scientifically informed future.
        </p>
      </section>

      {/* Hindi Section */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 text-center">
          हिन्दी
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-justify leading-relaxed">
          मेरे ब्लॉग पर आपका स्वागत है! यह मंच पर्यावरण, जलवायु, कृषि, सतत जीवन और भारत में विज्ञान से जुड़े विषयों को 
          समझने और साझा करने के लिए समर्पित है।
        </p>

        <h2 className="text-lg sm:text-xl font-semibold mt-6 text-green-500 dark:text-green-400">
          मैं कौन हूँ?
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
          मैं एक शोधकर्ता, लेखक और सतत सीखने में रुचि रखने वाला व्यक्ति हूँ, जिसे यह समझने का जुनून है कि विज्ञान और स्थिरता 
          हमारी दुनिया को कैसे आकार देते हैं।
        </p>

        <h2 className="text-lg sm:text-xl font-semibold mt-6 text-green-500 dark:text-green-400">
          यह ब्लॉग क्यों?
        </h2>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>जलवायु परिवर्तन और पर्यावरण संरक्षण को लेकर जागरूकता बढ़ाई जाती है।</li>
          <li>वैज्ञानिक तथ्यों और शोध-आधारित समाधानों को साझा किया जाता है।</li>
          <li>कृषि और ग्रामीण विकास में हो रहे नवाचारों को समझा जाता है।</li>
          <li>सरकारी नीतियों और जमीनी पहल पर चर्चा की जाती है।</li>
        </ul>

        <h2 className="text-lg sm:text-xl font-semibold mt-6 text-green-500 dark:text-green-400">
          आइए जुड़े रहें!
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-justify leading-relaxed">
          यह ब्लॉग विचार-विमर्श के लिए खुला मंच है। यदि आप स्थिरता, विज्ञान या हरे नवाचारों के प्रति जुनूनी हैं, 
          तो मैं आपसे संवाद करने के लिए उत्सुक हूँ।
        </p>
      </section>
    </div>
  );
}

export default AboutUs;