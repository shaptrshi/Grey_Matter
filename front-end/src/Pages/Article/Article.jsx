import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaLink,
  FaWhatsapp,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Article = () => {
  const navigate = useNavigate();
  const [isUrlCopied, setIsUrlCopied] = useState(false);

  const shareArticle = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing article!");

    switch (platform) {
      case "facebook":
        window.open(
          `https://facebook.com/sharer/sharer.php?u=${url}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(`https://linkedin.com/shareArticle?url=${url}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${text} ${url}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=${text}&body=${url}`, "_self");
        break;
      default:
        break;
    }
  };

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsUrlCopied(true);
        setTimeout(() => setIsUrlCopied(false), 2000);
      })
      .catch(() => {
        alert("Failed to copy URL!");
      });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-8 py-10 max-w-screen-xl">
        <div className="relative w-70 h-60 md:h-[25rem] lg:h-[30rem] overflow-hidden mb-8 flex items-center justify-center text-center">
          {/* Banner Text */}
          <div className="absolute z-20 text-white px-5 md:px-10 lg:px-20">
            <h1 className="text-5xl md:text-6xl font-semibold mb-4">
              Protecting Our Forests
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              By <a className="text-white hover:underline">John Doe</a> | October 5, 2024
            </p>
          </div>

          {/* Banner Image */}
          <img
            src="./pic.jpg"
            alt="Protecting Our Forests"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10"></div>
        </div>
      
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none text-lg leading-relaxed">
              <p>
                Forests are one of the most vital ecosystems on our planet. They
                provide oxygen, store carbon, and house a diverse range of
                species. However, deforestation and habitat destruction have
                placed immense pressure on these natural wonders.
              </p>

              <h2 className="text-2xl font-semibold text-foreground my-4">
                The Importance of Forests
              </h2>
              <p>
                Forests are crucial for the environment and the well-being of
                all living organisms. The trees in forests absorb carbon dioxide
                (CO2) and release oxygen, which is essential for the survival of
                all oxygen-dependent organisms, including humans. They play a
                vital role in mitigating climate change by acting as carbon
                sinks, storing more carbon than they release.
              </p>
              <p>
                In addition to carbon sequestration, forests help maintain the
                water cycle by absorbing rainwater and releasing moisture into
                the atmosphere through transpiration. They also prevent soil
                erosion by stabilizing the soil with their roots and reducing
                the risk of flooding. Forests are also home to over 80% of the
                world's terrestrial biodiversity, offering a habitat for
                countless species.
              </p>

              <div className="my-8">
                <img
                  src="pic.jpg"
                  alt="Forest Conservation"
                  className="w-1/2 h-auto mx-auto rounded-md shadow-lg transition-transform transform hover:scale-105"
                />
                <p className="mt-4 text-center text-gray-600">
                  Forest Conservation Efforts
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-foreground my-4">
                Deforestation and Its Impact
              </h2>
              <p>
                Unfortunately, deforestation is occurring at an alarming rate.
                It is driven primarily by human activities such as agriculture,
                urbanization, and logging. Every year, millions of hectares of
                forest are cleared, with devastating consequences for wildlife,
                the environment, and the climate. Deforestation leads to habitat
                loss, threatening the survival of species and disrupting entire
                ecosystems.
              </p>
              <p>
                The loss of forests also contributes to global warming, as trees
                that once absorbed CO2 are removed, and the carbon stored in
                their biomass is released back into the atmosphere. This process
                exacerbates climate change and leads to more extreme weather
                events, such as heatwaves, storms, and floods.
              </p>

              <h2 className="text-2xl font-semibold text-foreground my-4">
                Efforts to Protect Forests
              </h2>
              <p>
                The good news is that there are many initiatives in place to
                protect and restore forests. Governments, non-governmental
                organizations (NGOs), and local communities are working together
                to combat deforestation through legislation, conservation
                programs, and reforestation projects.
              </p>
              <p>
                One such initiative is the REDD+ program, which incentivizes
                developing countries to reduce emissions from deforestation and
                forest degradation. This program has been successful in reducing
                deforestation rates in countries like Brazil, where the Amazon
                rainforest has seen a reduction in clearing.
              </p>
              <p>
                In addition to these programs, there are numerous grassroots
                efforts around the world that aim to raise awareness about the
                importance of forests and encourage sustainable practices. Local
                communities are engaging in reforestation and agroforestry,
                which involves integrating trees into agricultural systems, to
                restore degraded lands and improve biodiversity.
              </p>

              <h2 className="text-2xl font-semibold text-foreground my-4">
                How You Can Help
              </h2>
              <p>
                As individuals, there are several ways we can contribute to the
                protection of forests. First and foremost, we can support
                sustainable products, such as those certified by organizations
                like the Forest Stewardship Council (FSC), which ensures that
                products come from responsibly managed forests.
              </p>
              <p>
                Another way to help is by reducing our carbon footprint. By
                adopting sustainable practices such as using energy-efficient
                appliances, driving less, and reducing waste, we can help reduce
                the pressure on forests. Lastly, supporting policies that
                protect forests and advocating for stronger environmental
                regulations can also make a significant impact.
              </p>

              <p>
                Protecting our forests is not only about saving trees; it's
                about ensuring a healthier future for all life on Earth. By
                taking action today, we can help preserve these critical
                ecosystems for generations to come.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Share this article
          </h2>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => shareArticle("facebook")}
              className="bg-white text-black hover:bg-blue-300 p-5 text-xl rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-none hover:shadow-gray-400"
            >
              <FaFacebookF />
            </Button>
            <Button
              variant="outline"
              onClick={() => shareArticle("linkedin")}
              className="bg-white text-black hover:bg-blue-500 p-5 text-2xl rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-none hover:shadow-gray-400"
            >
              <FaLinkedinIn />
            </Button>
            <Button
              variant="outline"
              onClick={() => shareArticle("whatsapp")}
              className="bg-white text-black hover:bg-green-400 p-5 text-7xl rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-none hover:shadow-gray-400"
            >
              <FaWhatsapp />
            </Button>
            <Button
              variant="outline"
              onClick={() => shareArticle("email")}
              className="bg-white text-black hover:bg-red-300 p-5 text-7xl rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-none hover:shadow-gray-400"
            >
              <MdEmail />
            </Button>
            <Button
              variant="outline"
              onClick={copyUrlToClipboard}
              className="bg-white text-black hover:bg-gray-400 p-5 text-5xl rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-none hover:shadow-gray-400"
            >
              <FaLink />
            </Button>
          </div>
          {isUrlCopied && (
            <div className="mt-2 text-red-600">URL copied to clipboard!</div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            About the Author
          </h2>
          <Card className="hover:shadow-sm border-2">
            <CardContent className="p-6 flex items-center space-x-6">
              <img
                src="./pic.jpg"
                alt="John Doe"
                className="w-20 h-20 rounded-full object-cover shadow-lg"
              />
              <div>
                <h3 className="text-xl font-semibold text-foreground">John Doe</h3>
                <p className="text-gray-600 mt-2">
                  John Doe is an environmental journalist with over a decade of
                  experience covering topics related to conservation, climate change,
                  and sustainable living. His passion for protecting the planet drives
                  his storytelling and advocacy work. When not writing, John enjoys
                  hiking and exploring natural landscapes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="mt-10">
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href =
                "mailto:shaptrshik@gmail.com?subject=Feedback on Article&body=Your message here.")
            }
            className="bg-gray-100 text-gray-700 hover:bg-custom-accent-green p-5 text-xl rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-2 border-gray-300 hover:shadow-gray-300"
          >
            Send Feedback
          </Button>
        </div>

        <div className="mt-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
        You May Enjoy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "The Future of Renewable Energy",
            img: "./pic.jpg",
            link: "",
          },
          {
            title: "Conservation Strategies for Wildlife",
            img: "wildlife.jpg",
            link: "",
          },
          {
            title: "Sustainable Living Practices",
            img: "sustainable.jpg",
            link: "",
          },
          {
            title: "Sustainable Living Practices",
            img: "sustainable.jpg",
            link: "",
          },
          ].map((article, index) => (
          <Card key={index} className="hover:shadow-sm transition-transform transform hover:scale-105 hover:shadow-custom-green">
            <img
              src={article.img}
              alt={article.title}
              className="w-full h-30 object-cover rounded-t-md"
            />
          <CardContent className="p-3">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {article.title}
          </h3>
          </CardContent>
          </Card>
         ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
