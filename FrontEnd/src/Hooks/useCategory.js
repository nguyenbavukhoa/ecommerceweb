// hooks/useCategory.js
import { useState, createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
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

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8080/api/v1/categories/all");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      // API trả về { data: [...] }
      return data.data || [];
    },
    staleTime: 1000 * 60, // cache 1 phút
  });
}
