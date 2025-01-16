import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS for styling
import QuillToolbar, { modules, formats } from "./EditorToolbar";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [content, setContent] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  const handleBannerImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerImage(e.target.result);
      reader.readAsDataURL(file);
    }
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
      date: new Date().toLocaleDateString(),
      isFeatured,
    };

    navigate("/article", { state: newArticle });
  };

  return (
    <div className="bg-background min-h-screen py-10 px-6">
      <div className="container mx-auto max-w-6xl">
        <Card>
          <CardContent className="p-7 space-y-7">
            <h1 className="text-2xl font-semibold">Create New Article</h1>
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
                  className="mt-2"
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
                  className="mt-2"
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
                  className="mt-2 w-50 cursor-pointer bg-gray-200 shadow-md transition-transform transform hover:scale-105 hover:bg-custom-green-1"
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
                />
                <style>
                  {`
                  .ql-container {
                    min-height: 150px;
                    max-height: 500px;
                    overflow-y: auto;
                  }
                  @media (max-width: 768px) {
                    .ql-container {
                      min-height: 120px;
                    }
                  }
                  `}
                </style>
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
            <Button
              onClick={handlePublish}
              className="w-50 bg-gray-900 text-gray-200 hover:bg-custom-green transition-transform transform hover:scale-105"
            >
              Publish Article
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateArticle;
