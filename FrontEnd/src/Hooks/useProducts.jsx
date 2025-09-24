// import { useQuery } from "@tanstack/react-query";

// export function useProducts(category = "all") {
//   return useQuery({
//     queryKey: ["products", category], // cache riêng theo category
//     queryFn: async () => {
//       const res = await fetch(
//         category === "all"
//           ? "/products.json"
//           : `/products.json?category=${category}`
//       );
//       if (!res.ok) throw new Error("Network response was not ok");
//       const data = await res.json();

//       // nếu JSON dạng { products: [...] }
//       return data.products || data;
//     },
//     staleTime: 1000 * 60, // cache trong 1 phút
//   });
// }

import { useQuery } from "@tanstack/react-query";

export function useProducts(category = "all") {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await fetch("/products.json");
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      // Lọc sản phẩm theo category
      const products = data.products || data;
      if (category === "all") {
        return products;
      }
      return products.filter((product) => product.category === category);
    },
    staleTime: 1000 * 60,
  });
}

// Thêm helper function để lấy unique categories
export function useCategories() {
  const { data: products } = useProducts();

  if (!products) return [];

  // Lấy danh sách category unique từ products
  const categories = [...new Set(products.map((product) => product.category))];
  return categories;
}
