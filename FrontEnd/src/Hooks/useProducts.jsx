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

// import { useQuery } from "@tanstack/react-query";

// export function useProducts(category = "all") {
//   return useQuery({
//     queryKey: ["products", category],
//     queryFn: async () => {
//       const res = await fetch(
//         "http://localhost:8081/api/v1/products?isActive=true"
//       );
//       if (!res.ok) throw new Error("Network response was not ok");
//       const data = await res.json();

//       // Lọc sản phẩm theo category
//       const products = data.data.content || data;
//       if (category === "all") {
//         return products;
//       }
//       return products.filter((product) => product.category === category);
//     },
//     staleTime: 1000 * 60,
//   });
// }

// // Thêm helper function để lấy unique categories
// export function useCategories() {
//   const { data: products } = useProducts();

//   if (!products) return [];

//   // Lấy danh sách category unique từ products
//   const categories = [...new Set(products.map((product) => product.category))];
//   return categories;
// }
// import { useQuery } from "@tanstack/react-query";

// export function useProducts(category = "all") {
//   return useQuery({
//     queryKey: ["products", category],
//     queryFn: async () => {
//       const res = await fetch(
//         "http://localhost:8081/api/v1/products?isActive=true"
//       );
//       if (!res.ok) throw new Error("Network response was not ok");
//       const data = await res.json();

//       // Lấy mảng sản phẩm trong data.data.content
//       const products = data?.data?.content || [];

//       // Nếu category = all thì trả hết
//       if (category === "all") return products;

//       // So sánh theo productCategoryDTO.name
//       return products.filter(
//         (product) => product.productCategoryDTO?.name === category
//       );
//     },
//     staleTime: 1000 * 60,
//   });
// }

// // Lấy unique categories
// export function useCategories() {
//   const { data: products } = useProducts();

//   if (!products) return [];

//   const categories = [
//     ...new Set(products.map((p) => p.productCategoryDTO?.name).filter(Boolean)),
//   ];

//   return categories;
// }

import { useQuery } from "@tanstack/react-query";

// Hook lấy products
export function useProducts(category = "all", page = 1) {
  return useQuery({
    queryKey: ["products", category, page],
    queryFn: async () => {
      let url = "http://localhost:8080/api/v1/products";

      // Nếu là "all" thì dùng ?isActive=true
      if (category === "all") {
        url += "?status=active&page=" + page;
      } else {
        // Nếu khác all thì dùng ?productCategoriesId=<id>
        url += `?productCategoriesId=${category}&page=` + page;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      // console.log(category, data, url);

      // Trả về danh sách products
      return {
        products: data?.data?.content || [],
        totalPages: data?.data?.totalPages || 0,
      };
    },
    staleTime: 1000 * 60, // cache 1 phút
  });
}

// Helper format giá
export function formatPrice(price) {
  if (price == null) return "0₫";
  return Number(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
