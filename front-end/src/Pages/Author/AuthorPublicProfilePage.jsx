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
    bio: "A passionate writer and tech enthusiast.",
    profilePhoto: null,
  };

  const [authorInfo] = useState(initialProfile);

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
            <label className="block text-gray-600">Bio:</label>
            <Textarea
              value={authorInfo.bio}
              disabled
              rows="3"
              className="w-full mt-2 bg-gray-100"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AuthorPublicProfilePage;
