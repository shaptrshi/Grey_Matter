import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import QuillToolbar, { modules, formats } from "./EditorToolbar";
import { FaArrowLeft } from "react-icons/fa"; // Import the back arrow icon

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState([]); // State to store selected tags

  const availableTags = [
    "Trending",
    "Environment",
    "Weather",
    "Agriculture",
    "Forest",
    "Sustainable Living",
    "Technology and Advancements",
    "Science and Research",
    "Startups and Entrepreneurship", 
    "Evolving Horizons",
    "Interviews",
    "Spotlight",
    "Policy and Governance",
  ];

  const handleBannerImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleSelectAll = () => {
    setTags(availableTags);
  };

  const handleClearAll = () => {
    setTags([]);
  };

  const handlePublish = () => {
    if (!title || !author || !content || !bannerImage) {
      alert("Please fill out all fields and upload a banner image.");
      return;
    }

    const newArticle = {
      title,
      author,
      bannerImage,
      content,
      tags,
      date: new Date().toLocaleDateString(), // Save the current date when the article is published
      isFeatured,
    };

    navigate("/article", { state: newArticle }); // Pass article data along with the navigation
  };

  return (
    <div className="bg-background min-h-screen py-10 px-6">
      <div className="container mx-auto max-w-6xl">
        <Card>
          <CardContent className="p-7 space-y-7">
             <div className="flex items-center space-x-4 mb-6">
                {/* Back button with icon */}
                <button
                  onClick={() => navigate(-1)} // Navigate to the previous page
                  className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-400 transition"
                >
                <FaArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-semibold">Create Article</h1>
              </div>
            <Separator />
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium">
                  Article Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter the title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 border-2 border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="author" className="text-sm font-medium">
                  Author Name
                </Label>
                <Input
                  id="author"
                  type="text"
                  placeholder="Enter the author's name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="mt-2 border-2 border-gray-300"
                />
              </div>
              <div>
                <Label htmlFor="banner" className="text-sm font-medium">
                  Banner Image
                </Label>
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageUpload}
                  className="mt-2 w-50 cursor-pointer bg-gray-100 text-gray-500 hover:bg-custom-green-1 shadow-sm transition-transform transform hover:scale-105 border-2 border-gray-300"
                />
                {bannerImage && (
                  <div className="mt-4">
                    <img
                      src={bannerImage}
                      alt="Banner Preview"
                      className="w-50 h-50 rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="content" className="text-sm font-medium">
                  Article Content
                </Label>

                <QuillToolbar />
                <ReactQuill
                  theme="snow"
                  id="content"
                  value={content}
                  onChange={setContent}
                  placeholder="Write something awesome..."
                  modules={modules}
                  formats={formats}
                  className="mt-2"
                  style={{ minHeight: "200px", maxHeight: "600px", overflowY: "auto" }}
                />
                <style>
               {`
                  .ql-container {
                    min-height: 200px;
                    max-height: 600px;
                    overflow-y: auto;
                  }
                  @media (max-width: 768px) {
                    .ql-container {
                      min-height: 200px;
                    }
                  }
                  `}
               </style>
              </div>
              <div>
                <Label htmlFor="tags" className="text-sm font-medium pr-2">
                  Tags
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-50 p-2 bg-gray-100 text-gray-700 border-2 rounded-md hover:bg-custom-green-1 border-gray-300 transition-transform transform hover:scale-105">
                      {tags.length > 0
                        ? `Selected Tags (${tags.length})`
                        : "Select Tags"}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4 grid grid-cols-3 gap-2 w-full bg-white border rounded-md shadow-lg">
                    {availableTags.map((tag) => (
                      <DropdownMenuItem
                        key={tag}
                        className={`p-2 rounded-md cursor-pointer transition-colors ${
                          tags.includes(tag) ? "bg-blue-200" : ""
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </DropdownMenuItem>
                    ))}
                    <div className="col-span-3 flex flex-col sm:flex-row justify-between mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSelectAll}
                        className="w-full sm:w-24 mb-2 sm:mb-0 border-2 shadow-sm border-gray-300 hover:bg-blue-300"
                      >
                        Select All
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleClearAll}
                        className="w-fulls sm:w-24 bg-gray-500 shadow-sm"
                      >
                        Clear All
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="mt-2">
                  Selected Tags:{" "}
                  {tags.length > 0 ? tags.join(", ") : "No tags selected"}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="featured" className="text-sm font-medium">
                  Mark as Featured
                </Label>
                <button
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${
                    isFeatured ? "bg-custom-green" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full transition-transform ${
                      isFeatured ? "transform translate-x-6" : ""
                    }`}
                  ></div>
                </button>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
            <Button
              onClick={handlePublish}
              className="w-50 bg-gray-900 text-gray-200 hover:bg-gray-500 transition-transform transform hover:scale-105"
            >
              Publish Article
            </Button>
             <Button
              onClick={() => navigate(-1)} // Navigate to the previous page
              className="w-50 bg-gray-100 text-black hover:bg-custom-accent-green transition-transform transform hover:scale-105 border-2 border-gray-300"
              >
              Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateArticle;
