import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';
import { SiX } from 'react-icons/si'; 
import { AiOutlineMail, AiOutlineLink } from 'react-icons/ai'; 

const Article = () => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isUrlCopied, setIsUrlCopied] = useState(false); // State to track URL copy status

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments((prevComments) => [
        ...prevComments,
        { id: Date.now(), text: commentText },
      ]);
      setCommentText(""); // Clear the input field after adding the comment
    }
  };

  const shareArticle = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent("Check out this amazing article!");

    switch (platform) {
      case "x":
        // Commented for now
        // window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
        break;
      case "facebook":
        // Commented for now
        // window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
        break;
      case "linkedin":
        // Commented for now
        // window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`, "_blank");
        break;
      case "whatsapp":
        // Commented for now
        // window.open(`https://wa.me/?text=${text} ${url}`, "_blank");
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
    navigator.clipboard.writeText(url)
      .then(() => {
        setIsUrlCopied(true); // Set the state to show the copied message
        setTimeout(() => setIsUrlCopied(false), 2000); // Hide the message after 2 seconds
      })
      .catch(() => {
        alert("Failed to copy URL!"); // In case copying fails
      });
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Banner Image with Gradient and Content */}
      <div className="relative w-full h-80 md:h-[25rem] lg:h-[30rem] overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10"></div>
        {/* Banner Image */}
        <img
          src="./pic.jpg"
          alt="Protecting Our Forests"
          className="w-full h-full object-cover"
        />
        {/* Banner Text */}
        <div className="absolute inset-0 z-20 flex items-end px-5 md:px-10 lg:px-20 py-6">
          <div className="text-left text-white pl-10 md:pl-20 lg:pl-32 py-5">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Protecting Our Forests
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              By <a href="https://www.linkedin.com/in/johndoe" className="text-white hover:underline">John Doe</a> | October 5, 2024
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-10">
        {/* Article Content */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="prose prose-invert max-w-none text-lg leading-relaxed">
              <p>
                Forests are one of the most vital ecosystems on our planet. They
                provide oxygen, store carbon, and house a diverse range of
                species. However, deforestation and habitat destruction have
                placed immense pressure on these natural wonders.
              </p>
            
              <div className="my-6">
                <img
                  src="./pic.jpg"
                  alt="A lush green forest"
                  className="w-1/2 rounded-md shadow-md"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  A scenic view of a lush green forest, a reminder of nature's
                  beauty.
                </p>
              </div>
              <p>
                Efforts to preserve forests worldwide are gaining momentum. From
                local conservation programs to international treaties, every
                step counts in combating deforestation. Protecting our forests
                is not just an environmental issue—it's a necessity for the
                future of humanity and countless other species.
              </p>
              <h2 className="text-2xl font-semibold mt-6">Key Initiatives</h2>
              <ul>
                <li>Reforestation programs in Amazon rainforests.</li>
                <li>Promoting sustainable logging practices.</li>
                <li>Raising awareness about the importance of biodiversity.</li>
              </ul>
              <p>
                We must all play our part in ensuring that forests are preserved
                for generations to come. Every action, no matter how small, can
                make a difference in protecting our planet's green lungs.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Share Section */}
        <div className="mt-8">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Share this article
          </h2>
          <div className="flex space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-black text-white hover:bg-gray-800 rounded-full p-3"
                    onClick={() => shareArticle("x")}
                  >
                    <SiX size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on X</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 rounded-full p-3"
                    onClick={() => shareArticle("facebook")}
                  >
                    <FaFacebookF size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on Facebook</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600 rounded-full p-3"
                    onClick={() => shareArticle("linkedin")}
                  >
                    <FaLinkedinIn size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on LinkedIn</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-green-500 text-white hover:bg-green-600 rounded-full p-3"
                    onClick={() => shareArticle("whatsapp")}
                  >
                    <FaWhatsapp size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share on WhatsApp</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700 rounded-full p-3"
                    onClick={() => shareArticle("email")}
                  >
                    <AiOutlineMail size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share via Email</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* Copy URL Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-gray-600 text-white hover:bg-gray-700 rounded-full p-3"
                    onClick={copyUrlToClipboard}
                  >
                    <AiOutlineLink size={24} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy URL</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isUrlCopied && (
            <div className="mt-2 text-green-500">
              URL copied to clipboard!
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="mt-10">
          <h2 className="text-3xl font-semibold text-foreground mb-4">
            Comments
          </h2>
          <div className="mb-6">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border border-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
            ></textarea>
            <Button
              onClick={handleAddComment}
              className="mt-3 bg-black text-white hover:bg-gray-900 transition-all"
            >
              Post Comment
            </Button>
          </div>
          {comments.length > 0 && (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="p-4 bg-muted-background rounded-md shadow-sm"
                >
                  {comment.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Article;
