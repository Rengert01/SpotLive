import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressChart } from "@/components/profile/progress-chart";
import { Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";


interface ProfileReusableLayoutProps {
  pageTitle?: string;
  children?: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
  profile: {
    profileCompletion: {
      completionPercentage: number;
      checklist: {
        setupAccount: boolean;
        personalInformation: boolean;
        uploadPhoto: boolean;
        contactInformation: boolean;
        workInformation: boolean;
      };
    };
    personalInformation: {
      firstName: string;
      lastName: string;
      profilePicture?: string;
    };
  };
}

const ProfileReusableLayout = ({ children, user, profile }: ProfileReusableLayoutProps) => {
  const [profileImg, setProfileImg] = useState<File | null>(null);

  const listToComplete = [
    { name: "Setup Account", complete: profile.profileCompletion.checklist.setupAccount },
    { name: "Personal Information", complete: profile.profileCompletion.checklist.personalInformation },
    { name: "Upload Photo", complete: profile.profileCompletion.checklist.uploadPhoto },
    { name: "Contact Information", complete: profile.profileCompletion.checklist.contactInformation },
    { name: "Work Information", complete: profile.profileCompletion.checklist.workInformation },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImg(file);
  };

  return (

    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Section */}
      <div className="lg:w-2/3 bg-white rounded-lg shadow-md border-[1px] border-gray p-6">
        <h2 className="text-xl font-semibold mb-4">Your Profile Picture</h2>
        <div className="flex items-center gap-4 mb-6">
          <input
            accept="image/*"
            type="file"
            id="profile-user-image"
            className="hidden"
            onChange={handleImageChange}
          />
          <label htmlFor="profile-user-image" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300">
              <Avatar className="flex text-center m-auto items-center justify-center w-full h-full">
                <AvatarImage src={profile?.personalInformation?.profilePicture} />
                <AvatarFallback className="text-center ">NO</AvatarFallback>
              </Avatar>
            </div>
          </label>
          <div>
            <p className="text-lg font-bold">{user.name || "User Name"}</p>
            <p className="text-sm text-gray-500">{user.email || "user@example.com"}</p>
          </div>
        </div>
        {profileImg ? (
          <div className="flex gap-4">
            <Button onClick={() => setProfileImg(null)} variant="outline">
              Clear
            </Button>
            <Button variant="default">Save Picture</Button>
          </div>
        ) : (
          <label htmlFor="profile-user-image" className="btn-primary cursor-pointer flex gap-3 items-center">
            <span>Upload Picture</span> <figure><Pencil className='w-[1rem]' /></figure>
          </label>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Only standard format 800x800 px are allowed (JPG, PNG). Max file size: 1MB.
        </p>
        <div className="mt-8">{children}</div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6 shadow-md border-[1px] border-gray">
        <div className="flex flex-col items-center mb-6">
          <ProgressChart totalVal={profile.profileCompletion.completionPercentage || 0} />
        </div>
        <ul className="space-y-2">
          {listToComplete.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              {item.complete ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span className="text-gray-500">✕</span>
              )}
              <span className={`${item.complete ? "text-gray-900" : "text-gray-500"}`}>
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
};

export default ProfileReusableLayout;
