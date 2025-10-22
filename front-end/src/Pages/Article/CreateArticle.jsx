import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { modules, formats } from "./EditorToolbar";
import { FaArrowLeft, FaCheck, FaImage, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [bannerImageError, setBannerImageError] = useState("");

  const availableTags = useMemo(
    () => [
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
    ],
    []
  );

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setBannerImageError("Please upload a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setBannerImageError("Image size should be less than 5MB");
      return;
    }

    setIsUploadingImage(true);
    setBannerImageError(""); // Clear any previous errors

    try {
      const previewUrl = URL.createObjectURL(file);
      setBannerImage(file);
      setBannerImagePreview(previewUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      const errorMsg = "Failed to upload image";
      setBannerImageError(errorMsg);
      toast.error(errorMsg);
      console.error("Error uploading image:", error);
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

  const handlePublish = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setBannerImageError("");

    // Validation
    if (!title) {
      toast.error("Please enter a title");
      return;
    }

    if (!bannerImage) {
      setBannerImageError("Banner image is required");
      toast.error("Please upload a banner image");
      return;
    }

    if (!content || content === "<p><br></p>" || content === "<p></p>") {
      toast.error("Please add article content");
      return;
    }

    if (tags.length === 0) {
      toast.error("Please select at least one tag");
      return;
    }

    setIsPublishing(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      tags.forEach(tag => formData.append("tags[]", tag));
      formData.append("isFeatured", isFeatured);
      if (bannerImage instanceof File) {
        formData.append("bannerImage", bannerImage);
      } else {
        const response = await fetch(bannerImage);
        const blob = await response.blob();
        formData.append("bannerImage", blob, "banner.jpg");
      }

      const backendUrl = "https://api.thatgreymatter.com/api/articles";
      const { data } = await axios.post(backendUrl, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data?.article?._id) {
        toast.success("Article published successfully!");
        navigate(`/articles/${data.article._id}`);
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (error) {
      toast.error("Failed to publish article.");
      console.error("Error publishing article:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerImagePreview(null);
    setBannerImageError("");
    // Revoke the object URL to avoid memory leaks
    if (bannerImagePreview) {
      URL.revokeObjectURL(bannerImagePreview);
    }
  };

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
                Create Article
              </h1>
            </div>

            {isPublishing ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-8 w-1/2 rounded-lg" />
                <Skeleton className="h-12 w-40 rounded-lg" />
              </div>
            ) : (
              <form onSubmit={handlePublish} className="space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-gray-700 dark:text-gray-300"
                  >
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
                  <Label
                    htmlFor="banner"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Banner Image <span className="text-red-500">*</span>
                  </Label>
                  
                  {/* Error Message */}
                  {bannerImageError && (
                    <div className="flex items-center space-x-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                      <FaExclamationTriangle />
                      <span>{bannerImageError}</span>
                    </div>
                  )}

                  <div className="relative">
                    <label
                      htmlFor="banner"
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors duration-200 ${
                        bannerImage
                          ? "border-custom-green bg-green-50 dark:bg-gray-800"
                          : bannerImageError 
                            ? "border-red-300 bg-red-50 dark:bg-red-900/10 dark:border-red-700"
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
                            Image selected - Click to change
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FaImage className={`text-2xl mb-2 ${
                            bannerImageError ? "text-red-400" : "text-gray-400"
                          }`} />
                          <p className={`text-sm ${
                            bannerImageError 
                              ? "text-red-600 dark:text-red-400" 
                              : "text-gray-600 dark:text-gray-400"
                          }`}>
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Recommended size: 1200x630px • Max 5MB
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

                  {/* Image Preview with Remove Option */}
                  {bannerImage && !isUploadingImage && (
                    <div className="mt-4 relative inline-block">
                      <img
                        src={bannerImagePreview || URL.createObjectURL(bannerImage)}
                        alt="Banner Preview"
                        className="max-h-64 w-auto rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={removeBannerImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                        aria-label="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Helper text when no image is selected */}
                  {!bannerImage && !bannerImageError && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Banner image is required for publishing
                    </p>
                  )}
                </div>

                {/* Content Editor */}
                <div className="space-y-2">
                  <Label
                    htmlFor="content"
                    className="text-gray-700 dark:text-gray-300"
                  >
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
                    Tags (Pages) <span className="text-red-500">*</span>
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
                  {tags.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Select at least one tag
                    </p>
                  )}
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-4">
                  <Label
                    htmlFor="featured"
                    className="text-gray-700 dark:text-gray-300"
                  >
                    Mark as Featured
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-green ${
                      isFeatured
                        ? "bg-custom-green"
                        : "bg-gray-300 dark:bg-gray-600"
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
                    disabled={isPublishing}
                  >
                    {isPublishing ? "Publishing..." : "Publish Article"}
                  </Button>
                </div>
              </form>
            )}
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

export default CreateArticle;