import React from "react";

interface UserProfileProps {
  setEditProfile?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditProfile: React.FC<UserProfileProps> = ({ setEditProfile }) => {
  return (
    <div>
      <p>Edit</p>
    </div>
  );
};

export default EditProfile;
