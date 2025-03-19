import React, { useState, useEffect, useContext } from "react";
import { ColorContext } from "./ColorContext";
import SampleImage from "./PageFixeImg.jpg"; 

const ImageColorExtractor = () => {
  const { setBackgroundColor } = useContext(ColorContext); // Access context to update background color
  const [hexColor, setHexColor] = useState("");

  useEffect(() => {
    extractColor(SampleImage);
  }, []);

  const extractColor = (imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const x = Math.floor(img.width / 2);
      const y = Math.floor(img.height / 2);
      const pixelData = ctx.getImageData(x, y, 1, 1).data;

      const hex = `#${((1 << 24) + (pixelData[0] << 16) + (pixelData[1] << 8) + pixelData[2])
        .toString(16)
        .slice(1)
        .toUpperCase()}`;
      setHexColor(hex);
      setBackgroundColor(hex); // Update the shared background color
    };
  };

  return (
   
    <div></div>
  );
};

export default ImageColorExtractor;
