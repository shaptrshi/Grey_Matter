import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FaArrowLeft } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import QuillToolbar, { modules, formats } from "./EditorToolbar";

const EditArticle = () => {
  const { id } = useParams(); // Get article ID from the URL
  const { state } = useLocation(); // Get the article data passed via navigate
  const navigate = useNavigate();

  // Initialize the state based on the existing article data
  const [title, setTitle] = useState(state?.title || "");
  const [author, setAuthor] = useState(state?.author || "");
  const [bannerImage, setBannerImage] = useState(state?.bannerImage || null);
  const [content, setContent] = useState(state?.content || "");
  const [isFeatured, setIsFeatured] = useState(state?.isFeatured || false);
  const [tags, setTags] = useState(state?.tags || []);

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

  // Using useEffect to simulate fetching article data or updating the page title
  useEffect(() => {
    // If the state is not passed (i.e., it's an edit view and article ID is available)
    if (!state) {
      // Example API call to fetch article details by ID (you can replace this with your actual API call)
      const fetchArticleData = async () => {
        try {
          // Replace this with the actual API endpoint
          const response = await fetch(`/api/articles/${id}`);
          const data = await response.json();
          setTitle(data.title);
          setAuthor(data.author);
          setBannerImage(data.bannerImage);
          setContent(data.content);
          setIsFeatured(data.isFeatured);
          setTags(data.tags);
        } catch (error) {
          console.error("Failed to fetch article data:", error);
        }
      };

      fetchArticleData();
    }

    // Update the document title
    document.title = title ? `${title} - Edit Article` : "Edit Article";

  }, [id, state, title]); // The dependencies to watch

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

  const handleSaveChanges = () => {
    if (!title || !author || !content || !bannerImage) {
      alert("Please fill out all fields and upload a banner image.");
      return;
    }

    const updatedArticle = {
      id,
      title,
      author,
      bannerImage,
      content,
      tags,
      date: new Date().toLocaleDateString(),
      isFeatured,
    };

    // Save the updated article (e.g., make an API call or update local state)
    navigate("/article", { state: updatedArticle });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSaveChanges(); // Save changes and navigate
  };

  return (
    <div className="bg-background min-h-screen py-10 px-6">
      <div className="container mx-auto max-w-6xl">
        <Card>
          <CardContent className="p-7 space-y-7">
            <form onSubmit={handleFormSubmit}>
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => navigate(-1)} // Navigate to the previous page
                  className="p-2 bg-gray-100 text-gray-700 rounded-full hover:bg-red-400 transition"
                >
                  <FaArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-semibold">Edit Article</h1>
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
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm font-medium">
                    Tags(Pages)
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`px-4 py-2 rounded-full ${
                          tags.includes(tag) ? "bg-blue-200" : "bg-gray-200"
                        }`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div></div>
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
                      className={`w-6 h-6 bg-white rounded-full transform transition-transform ${
                        isFeatured ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <Button
                  type="submit"
                  className="w-50 bg-gray-900 text-gray-200 hover:bg-gray-500 transition-transform transform hover:scale-105"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/article")}
                  className="w-50 bg-gray-100 text-black hover:bg-custom-accent-green transition-transform transform hover:scale-105 border-2 border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditArticle;
