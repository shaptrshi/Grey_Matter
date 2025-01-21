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
    mobile: "123-456-7890",
    bio: "A passionate writer and tech enthusiast.",
    socialMedia: [
      { id: 1, url: "https://twitter.com/johndoe" },
      { id: 2, url: "https://linkedin.com/in/johndoe" },
      { id: 3, url: "https://instagram.com/johndoe" },
      { id: 4, url: "https://facebook.com/johndoe" },
      { id: 5, url: "https://pinterest.com/johndoe" },
    ],
    profilePhoto: null,
  };

  const [authorInfo, setAuthorInfo] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(initialProfile);

  const socialIcons = {
    twitter: <BsTwitter className="text-blue-400" />,
    linkedin: <FaLinkedin className="text-blue-700" />,
    instagram: <AiFillInstagram className="text-pink-500" />,
    facebook: <FaFacebook className="text-blue-600" />,
    pinterest: <FaPinterest className="text-red-600" />,
  };

  const detectPlatform = (url) => {
    if (url.includes("twitter.com")) return "twitter";
    if (url.includes("linkedin.com")) return "linkedin";
    if (url.includes("instagram.com")) return "instagram";
    if (url.includes("facebook.com")) return "facebook";
    if (url.includes("pinterest.com")) return "pinterest";
    return "web"; // Default to generic web platform if no match
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnsavedChanges((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialMediaChange = (id, value) => {
    setUnsavedChanges((prevState) => ({
      ...prevState,
      socialMedia: prevState.socialMedia.map((social) =>
        social.id === id ? { ...social, url: value } : social
      ),
    }));
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

  const addSocialMedia = () => {
    setUnsavedChanges((prevState) => ({
      ...prevState,
      socialMedia: [...prevState.socialMedia, { id: Date.now(), url: "" }],
    }));
  };

  const removeSocialMedia = (id) => {
    setUnsavedChanges((prevState) => ({
      ...prevState,
      socialMedia: prevState.socialMedia.filter((social) => social.id !== id),
    }));
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
      <Card className="w-full max-w-5xl p-10 bg-white shadow-md">
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
            <label className="block text-gray-600">Mobile Number:</label>
            <Input
              name="mobile"
              value={unsavedChanges.mobile}
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

          <div>
            <label className="block text-gray-600">Social Media:</label>
            <div className="space-y-4 mt-2">
              {unsavedChanges.socialMedia.map((social) => (
                <div key={social.id} className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {social.url && detectPlatform(social.url) === "twitter" && socialIcons.twitter}
                    {social.url && detectPlatform(social.url) === "linkedin" && socialIcons.linkedin}
                    {social.url && detectPlatform(social.url) === "instagram" && socialIcons.instagram}
                    {social.url && detectPlatform(social.url) === "facebook" && socialIcons.facebook}
                    {social.url && detectPlatform(social.url) === "pinterest" && socialIcons.pinterest}
                    {social.url && detectPlatform(social.url) === "web" && (
                      <span className="text-gray-500">🌐</span>
                    )}
                  </div>
                  <Input
                    type="text"
                    value={social.url}
                    onChange={(e) => handleSocialMediaChange(social.id, e.target.value)}
                    disabled={!isEditing}
                    placeholder="Profile URL"
                    className={`w-full ${isEditing ? "bg-white border-gray-300" : "bg-gray-100"}`}
                  />
                  {isEditing && (
                    <Button
                      onClick={() => removeSocialMedia(social.id)}
                      variant="link"
                      className="text-red-500"
                    >
                      <FaTrash />
                    </Button>
                  )}
                </div>
              ))}
              {isEditing && (
                <Button onClick={addSocialMedia} className="text-green-500 mt-4">
                  <FaPlus /> Add Social Media
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline" className="text-gray-700">
                Cancel
              </Button>
              <Button onClick={handleSave} className="text-white bg-green-500">
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="text-gray-700"
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
