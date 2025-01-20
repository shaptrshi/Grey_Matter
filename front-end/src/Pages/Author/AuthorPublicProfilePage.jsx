import { useState } from "react";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { Card } from "@/components/ui/card";

const AuthorPublicProfilePage = () => {
  const [authorInfo] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    bio: "A passionate writer and tech enthusiast.",
    socialMedia: [
      { id: 1, platform: "X", url: "https://twitter.com/johndoe", icon: <BsTwitter className="text-blue-400" /> },
      { id: 2, platform: "LinkedIn", url: "https://linkedin.com/in/johndoe", icon: <FaLinkedin className="text-blue-700" /> },
      { id: 3, platform: "Instagram", url: "https://instagram.com/johndoe", icon: <FaInstagram className="text-pink-500" /> },
    ],
    profilePhoto: null,
  });

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
    <div className="min-h-screen flex items-center justify-center bg-white px-4 lg:px-16">
      <Card className="w-full max-w-4xl p-8 shadow-lg rounded-lg bg-gray-100">
        <div className="text-center">
          <div
            className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md"
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
          </div>

          <h1 className="text-2xl font-semibold mt-4">{authorInfo.name}</h1>
          <p className="text-gray-600">{authorInfo.email}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <strong className="block text-gray-600">Bio:</strong>
            <p className="mt-2">{authorInfo.bio}</p>
          </div>
          <div>
            <strong className="block text-gray-600">Social Media:</strong>
            <div className="space-y-4 mt-2">
              {authorInfo.socialMedia.map((social) => (
                <div key={social.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(social.platform)}
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      {social.url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthorPublicProfilePage;
