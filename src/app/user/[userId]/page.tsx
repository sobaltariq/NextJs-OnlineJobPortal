import React from "react";

const UserPage = ({ params }: { params: { userId: string } }) => {
  return (
    <div>
      <p>User Id: {params.userId}</p>
    </div>
  );
};

export default UserPage;
