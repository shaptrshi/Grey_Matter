import { useState } from "react";
import { FaLinkedin, FaInstagram, FaFacebook, FaPinterest, FaPlus, FaTrash } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const AuthorProfilePage = () => {
  const initialProfile = {
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "A passionate writer and tech enthusiast.",
    profilePhoto: null,
  };

  const [authorInfo, setAuthorInfo] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(initialProfile);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnsavedChanges((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUnsavedChanges((prevState) => ({ ...prevState, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setAuthorInfo(unsavedChanges);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUnsavedChanges(authorInfo);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 lg:px-16">
      <Card className="w-full max-w-5xl p-10 bg-white shadow-none">
        <div className="text-center">
          <div
            className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-md cursor-pointer"
            onClick={() => isEditing && document.getElementById("profile-photo-input").click()}
          >
            {unsavedChanges.profilePhoto ? (
              <img
                src={unsavedChanges.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                <span className="text-4xl">📷</span>
              </div>
            )}
            {isEditing && (
              <input
                type="file"
                id="profile-photo-input"
                className="hidden"
                onChange={handleProfilePhotoChange}
                accept="image/*"
              />
            )}
          </div>
          <h1 className="text-2xl font-semibold mt-4">{authorInfo.name}</h1>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600">Email:</label>
            <Input
              name="email"
              value={unsavedChanges.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-2 ${isEditing ? "bg-white border-gray-300" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <label className="block text-gray-600">Bio:</label>
            <Textarea
              name="bio"
              value={unsavedChanges.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="3"
              className={`w-full mt-2 ${isEditing ? "bg-white border-gray-300" : "bg-gray-100"}`}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" className="w-50 bg-gray-100 text-black hover:bg-custom-accent-green transition-transform transform hover:scale-105 border-2 border-gray-300">
                Cancel
              </Button>
              <Button onClick={handleSave} className="w-50 bg-gray-900 text-gray-200 hover:bg-gray-500 transition-transform transform hover:scale-105">
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="w-50 bg-gray-900 text-gray-200 hover:bg-gray-500 transition-transform transform hover:scale-105"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthorProfilePage;
