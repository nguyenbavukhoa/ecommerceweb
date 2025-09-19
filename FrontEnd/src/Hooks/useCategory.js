// hooks/useCategory.js
import { useState, createContext, useContext } from "react";

// Create a context for sharing category data
const CategoryContext = createContext();

// Create a provider component
export function CategoryProvider({ children }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const showCategory = (category) => {
    setSelectedCategory(category);
  };

  return (
    <CategoryContext.Provider value={[selectedCategory, showCategory]}>
      {children}
    </CategoryContext.Provider>
  );
}

// Custom hook to use the category context
export function useCategory() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}
