import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeft, FaCheck, FaImage } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { modules, formats } from "./EditorToolbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const EditArticle = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const availableTags = useMemo(() => [
    "Trending",
    "Environment",
    "Weather",
    "Agriculture",
    "Artificial_Intelligence",
    "Sustainable_Living",
    "Technology_and_Advancement",
    "Science_and_Research",
    "Startups_and_Entrepreneurship",
    "Evolving_Horizons",
    "Interviews",
    "Spotlight",
    "Policy_and_Governance",
  ], []);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        const source = state || await axios.get(
          `https://api.thatgreymatter.com/api/articles/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = state || source.data;
        setTitle(data.title);
        setBannerImage(data.bannerImage);
        setContent(data.content);
        setIsFeatured(data.isFeatured);
        setTags(data.tags);
        setLoading(false);
        
        document.title = `${data.title} - Edit Article`;
      } catch (error) {
        console.error("Failed to fetch article data:", error);
        toast.error("Failed to fetch article data");
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [id, state]);

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    
    try {
      const previewUrl = URL.createObjectURL(file);
      setBannerImage(previewUrl);
      setFileToUpload(file);
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleTagToggle = (tag) => {
    setTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !bannerImage) {
      toast.error("Please fill out all required fields.");
      return;
    }

    setIsSaving(true);

    try {

      const formData = new FormData();

      if (fileToUpload) {
        formData.append("bannerImage", fileToUpload);
      }  

      formData.append("title", title);
      formData.append("content", content);
      formData.append("isFeatured", isFeatured);
      tags.forEach(tag => formData.append("tags[]", tag));

      const res = await axios.put(
        `https://api.thatgreymatter.com/api/articles/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 200 || res.data.success) {
        toast.success("Article updated successfully!");
        if (fileToUpload) {
          URL.revokeObjectURL(bannerImage); // Clean up the object URL
        }
        navigate(`/articles/${id}`);
      } else {
        toast.error(
          `Failed to update article: ${res.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("An error occurred while updating the article.");

      if (fileToUpload) {
        URL.revokeObjectURL(bannerImage); // Clean up the object URL
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-10 space-y-5">
        <Skeleton className="h-8 w-1/2 rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-background dark:bg-custom-dark min-h-screen py-8 md:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <Card className="dark:bg-custom-dark dark:border shadow-lg">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-200 transition-colors duration-200"
                aria-label="Go back"
              >
                <FaArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Edit Article
              </h1>
            </div>

            <form onSubmit={handleSaveChanges} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                  Article Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter the title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 border-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-custom-green focus:border-transparent"
                  required
                />
              </div>

              {/* Banner Image Field */}
              <div className="space-y-2">
                <Label htmlFor="banner" className="text-gray-700 dark:text-gray-300">
                  Banner Image <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <label
                    htmlFor="banner"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors duration-200 ${
                      bannerImage
                        ? "border-custom-green bg-green-50 dark:bg-gray-800"
                        : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                    }`}
                  >
                    {isUploadingImage ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-green"></div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Uploading...
                        </p>
                      </div>
                    ) : bannerImage ? (
                      <div className="flex flex-col items-center">
                        <FaCheck className="text-green-500 text-2xl mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Image selected
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <FaImage className="text-gray-400 text-2xl mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Recommended size: 1200x630px
                        </p>
                      </div>
                    )}
                    <input
                      id="banner"
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {bannerImage && !isUploadingImage && (
                  <div className="mt-4">
                    <img
                      src={bannerImage}
                      alt="Banner Preview"
                      className="max-h-64 w-auto rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">
                  Article Content <span className="text-red-500">*</span>
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
                  className="mt-1 bg-white dark:bg-gray-800 rounded-b-lg"
                  style={{
                    minHeight: "300px",
                    maxHeight: "600px",
                    overflowY: "auto",
                  }}
                />
              </div>

              {/* Tags Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Tags (Pages)
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                        tags.includes(tag)
                          ? "bg-custom-green-1 dark:bg-custom-accent-green text-white shadow-md"
                          : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-4">
                <Label htmlFor="featured" className="text-gray-700 dark:text-gray-300">
                  Mark as Featured
                </Label>
                <button
                  type="button"
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-green ${
                    isFeatured ? "bg-custom-green" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-pressed={isFeatured}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isFeatured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isFeatured ? "Yes" : "No"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
                <Button
                  type="button"
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-custom-green dark:hover:bg-custom-accent-green text-white transition-colors duration-200 shadow-lg hover:shadow-md"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Custom styles for Quill editor */}
      <style>{`
        .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border: 1px solid #d1d5db !important;
          background-color: #f9fafb;
        }
        .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border: 1px solid #d1d5db !important;
          min-height: 300px;
          max-height: 600px;
          overflow-y: auto;
          background-color: white;
        }
        .dark .ql-toolbar {
          background-color: #121212;
          border-color: #4b5563 !important;
        }
        .dark .ql-container {
          background-color: #121212;
          border-color: #4b5563 !important;
          color: white;
        }
        .ql-editor {
          min-height: 300px;
        }
        @media (max-width: 640px) {
          .ql-editor {
            min-height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default EditArticle;