import React, { useState } from "react";
import unknownImg from "@/assets/Unknown_person.png";
import { Button } from "@/components/ui/button";
import CountUp from "react-countup";
import MyDoughnutChart from "@/components/profile/progress-chart";
import { editIcon } from "@/assets/edit";


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

const ProfileReusableLayout = ({ pageTitle, children, user, profile }: ProfileReusableLayoutProps) => {
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

    <div className="flex flex-col lg:flex-row gap-6 p-4 bg-gray-50">
      {/* Left Section */}
      <div className="lg:w-2/3 bg-white rounded-lg shadow-md p-6">
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
              {profileImg ? (
                <img
                  alt="profile-img"
                  src={URL.createObjectURL(profileImg)}
                  width={96}
                  height={96}
                />
              ) : (
                <img
                  alt="profile-img"
                  src={profile.personalInformation.profilePicture || unknownImg}
                  width={96}
                  height={96}
                />
              )}
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
            <span>Upload Picture</span> <figure>{editIcon}</figure>
          </label>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Only standard format 800x800 px are allowed (JPG, PNG). Max file size: 1MB.
        </p>
        <div className="mt-8">{children}</div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/3 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl font-bold text-primary-600">
            <CountUp end={profile.profileCompletion.completionPercentage || 0} />%
          </div>
          <MyDoughnutChart totalVal={profile.profileCompletion.completionPercentage || 0} />
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
