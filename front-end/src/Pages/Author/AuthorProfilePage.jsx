import { useState } from "react";
import { FaLinkedin, FaInstagram, FaPlus, FaTrash } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const AuthorProfilePage = () => {
  const [authorInfo, setAuthorInfo] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    mobile: "123-456-7890",
    bio: "A passionate writer and tech enthusiast.",
    socialMedia: [
      { id: 1, platform: "X", url: "https://twitter.com/johndoe", icon: <BsTwitter className="text-blue-400" /> },
      { id: 2, platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: <FaLinkedin className="text-blue-700" /> },
      { id: 3, platform: "Instagram", url: "https://instagram.com/johndoe", icon: <FaInstagram className="text-pink-500" /> },
    ],
    profilePhoto: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthorInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (id, field, value) => {
    setAuthorInfo((prevState) => ({
      ...prevState,
      socialMedia: prevState.socialMedia.map((social) =>
        social.id === id ? { ...social, [field]: value } : social
      ),
    }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAuthorInfo((prevState) => ({
          ...prevState,
          profilePhoto: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoClick = () => {
    document.getElementById("profile-photo-input").click();
  };

  const addSocialMedia = () => {
    setAuthorInfo((prevState) => ({
      ...prevState,
      socialMedia: [
        ...prevState.socialMedia,
        { id: Date.now(), platform: "", url: "", icon: null },
      ],
    }));
  };

  const removeSocialMedia = (id) => {
    setAuthorInfo((prevState) => ({
      ...prevState,
      socialMedia: prevState.socialMedia.filter((social) => social.id !== id),
    }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Author Info:", authorInfo);
  };

  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "x":
        return <BsTwitter className="text-blue-400" />;
      case "linkedin":
        return <FaLinkedin className="text-blue-700" />;
      case "instagram":
        return <FaInstagram className="text-pink-500" />;
      default:
        return <span className="text-gray-500">🌐</span>;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-200 px-4 lg:px-16">
      <Card className="w-full max-w-5xl p-10 bg-gray-100">
        <div className="text-center">
          <div
            className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md cursor-pointer"
            onClick={handleProfilePhotoClick}
          >
            {authorInfo.profilePhoto ? (
              <img
                src={authorInfo.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white">
                <span className="text-4xl">📷</span>
              </div>
            )}

            {isEditing && (
              <label>
                <input
                  type="file"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                  id="profile-photo-input"
                />
              </label>
            )}
          </div>

          <h1 className="text-2xl font-semibold mt-4">{authorInfo.name}</h1>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <strong className="block text-gray-600">Email:</strong>
            <Input
              name="email"
              value={authorInfo.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-2 ${isEditing ? "bg-white border-gray-300" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <strong className="block text-gray-600">Mobile Number:</strong>
            <Input
              name="mobile"
              value={authorInfo.mobile}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full mt-2 ${isEditing ? "bg-white border-gray-300" : "bg-gray-100"}`}
            />
          </div>

          <div>
            <strong className="block text-gray-600">Bio:</strong>
            <Textarea
              name="bio"
              value={authorInfo.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="3"
              className={`w-full mt-2 ${isEditing ? "bg-white border-gray-300" : "bg-gray-100"}`}
            />
          </div>
          <div>
            <strong className="block text-gray-600">Social Media:</strong>
            <div className="space-y-4 mt-2">
              {authorInfo.socialMedia.map((social) => (
                <div key={social.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(social.platform)}
                    {isEditing ? (
                      <Input
                        type="text"
                        value={social.url}
                        onChange={(e) =>
                          handleSocialMediaChange(social.id, "url", e.target.value)
                        }
                        placeholder="Profile URL"
                        className="w-80 mt-1"
                      />
                    ) : (
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600"
                      >
                        {social.url}
                      </a>
                    )}
                  </div>
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
                <Button onClick={addSocialMedia} variant="link" className="text-green-500 mt-4">
                  <FaPlus /> Add Social Media
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <Button onClick={toggleEdit} variant="outline" className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-custom-accent-green rounded-md shadow-sm transition-transform transform hover:scale-110 hover:shadow-sm border-2 border-gray-300 hover:shadow-gray-300">
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          {isEditing && (
            <Button onClick={handleSave} className=" px-4 py-2 transition-transform transform hover:scale-110">
              Save Changes
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthorProfilePage;
