import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserProfile = () => {
  const { artistId } = useParams();
  // Fetch user data based on artistId
  const user = {
    profilePicture: "path/to/profile-picture.jpg",
    name: `Artist ${artistId}`,
    bio: "This is the artist's bio.",
  };

  return (
    <Card className="flex flex-col w-full border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <img src={user.profilePicture} alt={`${user.name}'s profile`} className="w-24 h-24 rounded-full" />
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <p>{user.bio}</p>
      </CardContent>
    </Card>
  );
};

export default UserProfile;