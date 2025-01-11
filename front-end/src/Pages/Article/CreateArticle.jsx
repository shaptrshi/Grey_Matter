import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Editor } from "@tinymce/tinymce-react";

const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());

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
      alert("Please fill out all fields and add a banner image.");
      return;
    }

    const newArticle = {
      title,
      author,
      bannerImage,
      content,
      date,
    };

    console.log("Article Published:", newArticle);
    navigate("/article", { state: newArticle });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-5 py-10">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h1 className="text-3xl font-semibold mb-6">Create New Article</h1>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleBannerImageUpload}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {bannerImage && (
                <div className="my-4">
                  <img
                    src={bannerImage}
                    alt="Banner Preview"
                    className="w-full max-h-80 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
              <Editor
                apiKey="your-tinymce-api-key"
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount",
                  ],
                  toolbar:
                    "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                }}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
              />
            </div>
            <Button
              onClick={handlePublish}
              className="mt-6 bg-black text-white hover:bg-gray-900 transition-transform transform hover:scale-110"
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
