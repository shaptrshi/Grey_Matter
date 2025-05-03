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
import axios from "axios";

const EditArticle = () => {
  const { id } = useParams(); // Get article ID from the URL
  const { state } = useLocation(); // Get the article data passed via navigate
  const navigate = useNavigate();

  // Initialize the state based on the existing article data
  const [title, setTitle] = useState(state?.title || "");
  const [bannerImage, setBannerImage] = useState(state?.bannerImage || null);
  const [content, setContent] = useState(state?.content || "");
  const [isFeatured, setIsFeatured] = useState(state?.isFeatured || false);
  const [tags, setTags] = useState(state?.tags || []);
  const [loading, setLoading] = useState(!state);

  const availableTags = [
    "Trending",
    "Environment",
    "Weather",
    "Agriculture",
    "Forest",
    "Sustainable_Living",
    "Technology_and_Advancements",
    "Science_and_Research",
    "Startups_and_Entrepreneurship", 
    "Evolving_Horizons",
    "Interviews",
    "Spotlight",
    "Policy_and_Governance",
  ];

  
  useEffect(() => {
    if (!state) {
      setLoading(true);
      const fetchArticleData = async () => {
        try {
          const response  = await axios.get(`http://localhost:5000/api/articles/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          });

          const data = await response.data;
          setTitle(data.title);
          setBannerImage(data.bannerImage);
          setContent(data.content);
          setIsFeatured(data.isFeatured);
          setTags(data.tags);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch article data:", error);
          setLoading(false);
        }
      };

      fetchArticleData();
    } else {
      setTitle(state.title);
      setBannerImage(state.bannerImage);
      setContent(state.content);
      setIsFeatured(state.isFeatured);
      setTags(state.tags);
    }


    document.title = state?.title ? `${state.title} - Edit Article` : "Edit Article";

  }, [id, state]);

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

  const handleSaveChanges = async () => {
    if (!title || !content || !bannerImage) {
      alert("Please fill out all fields and upload a banner image.");
      return;
    }

    const updatedArticle = {
      title,
      bannerImage,
      content,
      tags,
      isFeatured,
    };

    try {
      const  res = await axios.put(`http://localhost:5000/api/articles/${id}`, updatedArticle, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200 || res.data.success) {
        alert("Article updated successfully!");
        navigate("/article");
      } else {
        alert(`Failed to update article: ${res.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("An error occurred while updating the article. Please try again.");
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSaveChanges(); // Save changes and navigate
  };

  if (loading) {
    return (
    <div className="flex justify-center items-center min-h-screen">
      <h1 className="text-2xl font-semibold">Loading Article....</h1>
    </div>
    );
  }

  return (
    <div className="bg-background dark:bg-custom-dark min-h-screen py-10 px-6">
      <div className="container mx-auto max-w-6xl dark:bg-custom-dark">
        <Card className="dark:bg-custom-dark dark:border">
          <CardContent className="p-7 space-y-7">
            <form onSubmit={handleFormSubmit}>
              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => navigate(-1)} // Navigate to the previous page
                  className="p-2 bg-gray-100 dark:bg-custom-dark text-gray-700 dark:text-white dark:hover:bg-red-700 rounded-full hover:bg-red-400 transition"
                >
                  <FaArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-semibold">Edit Article</h1>
              </div>
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
                  <Label htmlFor="banner" className="text-sm font-medium">
                    Banner Image
                  </Label>
                  <Input
                    id="banner"
                    type="file"
                    accept="image/*"
                    onChange={handleBannerImageUpload}
                    className="mt-2 w-50 cursor-pointer bg-gray-100 text-gray-500 hover:bg-custom-green-1 dark:hover:bg-custom-green shadow-sm transition-transform transform hover:scale-105 border-2 border-gray-300 dark:text-black"
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
                        className={`px-4 py-2 rounded-full transiton-transform transform hover:scale-105 dark:text-black ${
                          tags.includes(tag) ? "bg-custom-green-1 dark:bg-custom-green" : "bg-gray-200 dark:bg-gray-300"
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
                  className="w-50 bg-gray-900 text-gray-200 dark:hover:bg-custom-accent-green hover:bg-gray-500 transition-transform transform hover:scale-105"
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate(-1)}  
                  className="w-50 bg-gray-100 text-black hover:bg-custom-green-1 dark:hover:bg-custom-accent-green transition-transform transform hover:scale-105 border-2 border-gray-300"
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
