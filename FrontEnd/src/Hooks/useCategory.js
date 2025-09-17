// hooks/useCategory.js
import { useState } from "react";

export function useCategory(initial = "Trang chủ") {
  const [selectedCategory, setSelectedCategory] = useState(initial);

  const showCategory = (category) => {
    setSelectedCategory(category);
  };

  return [selectedCategory, showCategory];
}
