"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import mountains from "../../../public/assets/user.png";

function Page() {
  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Image
        alt="Mountains"
        // Importing an image will
        // automatically set the width and height
        src={mountains}
        sizes="100vw"
        // Make the image display full width
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
}

export default Page;
