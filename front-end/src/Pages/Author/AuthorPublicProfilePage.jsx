import { useState } from "react";
import { FaLinkedin, FaInstagram, FaFacebook, FaPinterest } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AuthorPublicProfilePage = () => {
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

  const [authorInfo] = useState(initialProfile);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 lg:px-16">
      <Card className="w-full max-w-5xl p-10 bg-white shadow-none">
        <div className="text-center">
          <div className="relative mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-gray-300 shadow-md">
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
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600">Email:</label>
            <a
              href={`mailto:${authorInfo.email}`}
              className="w-full bg-gray-100 text-blue-600 hover:underline"
            >
              {authorInfo.email}
            </a>
          </div>

          <div>
            <label className="block text-gray-600">Mobile Number:</label>
            <a
              href={`tel:${authorInfo.mobile}`}
              className="w-full bg-gray-100 text-blue-600 hover:underline"
            >
              {authorInfo.mobile}
            </a>
          </div>

          <div>
            <label className="block text-gray-600">Bio:</label>
            <Textarea
              value={authorInfo.bio}
              disabled
              rows="3"
              className="w-full mt-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-600">Social Media:</label>
            <div className="space-y-4 mt-2">
              {authorInfo.socialMedia.map((social) => (
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
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-100 text-blue-600 hover:underline"
                  >
                    {social.url}
                  </a>
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
