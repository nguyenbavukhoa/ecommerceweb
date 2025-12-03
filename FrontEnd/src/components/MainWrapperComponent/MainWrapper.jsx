import React, { useState, useEffect } from "react";
import { useFilters } from "../../context/FilterProvider";
import { useProducts } from "../../hooks/useProducts";
import ProductList from "../ProductComponent/ProductListComponent/ProductListComponent";

// Import Banner
import banner2 from "../../assets/images/banner-2.png";
import banner3 from "../../assets/images/banner-3.png";
import banner4 from "../../assets/images/banner-4.png";
import banner5 from "../../assets/images/banner-5.png";

const banners = [banner2, banner3, banner4, banner5];

export default function MainWrapper({ onProductDetail }) {
  const [current, setCurrent] = useState(0);

  // 1. Gọi API lấy sản phẩm
  const { filters, setFilters } = useFilters();
  const { data, isLoading } = useProducts();

  // 2. Lấy dữ liệu từ response (Service đã chuẩn hóa)
  const products = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = filters.page || 1;

  // 3. Xử lý phân trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters({ page: newPage });
      document
        .getElementById("home-service")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-wrapper">
      <div className="container" id="trangchu">
        {/* Banner */}
        <div className="home-slider">
          <img
            src={banners[current]}
            alt={`banner-${current + 1}`}
            className="w-full rounded-lg transition-all duration-700"
            style={{ width: "100%", borderRadius: "10px" }}
          />
        </div>

        {/* Service Icons (Giữ nguyên của bạn) */}
        <div className="home-service" id="home-service-icons">
          {/* ... Các div icon ... */}
        </div>

        {/* PRODUCT LIST */}
        <div id="home-service">
          {" "}
          {/* ID để scroll tới */}
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              Đang tải sản phẩm...
            </div>
          ) : (
            <ProductList
              products={products}
              onProductDetail={onProductDetail} // Truyền callback lên trên
            />
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="page-nav">
            <ul className="page-nav-list">
              <li
                className={`page-nav-item ${
                  currentPage <= 1 ? "disabled" : ""
                }`}
              >
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                >
                  <i className="fa-regular fa-angle-left"></i>
                </a>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-nav-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <a
                    href="#!"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </a>
                </li>
              ))}

              <li
                className={`page-nav-item ${
                  currentPage >= totalPages ? "disabled" : ""
                }`}
              >
                <a
                  href="#!"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                >
                  <i className="fa-regular fa-angle-right"></i>
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
