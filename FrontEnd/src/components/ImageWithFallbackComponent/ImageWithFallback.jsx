import React, { useState } from "react";

// 1. Import ảnh trực tiếp từ file
import noImage from "./no_image.png";

function ImageWithFallback({ classname, src, alt, ...props }) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    // 2. Sử dụng biến đã import
    setImgSrc(noImage);
  };

  return (
    <img
      className={classname}
      src={imgSrc || noImage}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}

export default ImageWithFallback;
