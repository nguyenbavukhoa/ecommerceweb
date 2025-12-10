import { useState, useEffect } from "react";
import { useFilters, useCategories } from "../../../context/FilterProvider";
import "../styles/AdvancedSearch.css";

const scrollToProducts = () => {
  document
    .getElementById("home-service")
    ?.scrollIntoView({ behavior: "smooth" });
};

export default function AdvancedSearch({
  isOpen,
  onClose,
  isMobileSearchOpen,
}) {
  const { filters, setFilters } = useFilters();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  // Local state cho input giá
  const [min, setMin] = useState(filters.minPrice);
  const [max, setMax] = useState(filters.maxPrice);

  // Đồng bộ local state khi filters global thay đổi (ví dụ khi reset)
  useEffect(() => {
    setMin(filters.minPrice);
    setMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (e) => {
    setFilters({ category: e.target.value, page: 1 });
    setTimeout(scrollToProducts, 0);
  };

  const handlePriceSearch = () => {
    if (min && max && parseInt(min) > parseInt(max)) {
      alert("Giá tối thiểu không được lớn hơn giá tối đa!");
      return;
    }
    // Cập nhật vào context để trigger API
    setFilters({ minPrice: min, maxPrice: max, page: 1 });
    setTimeout(scrollToProducts, 0);
  };

  // [SỬA] Cập nhật hàm sort để gửi cả sortBy và sortOrder
  const handleSort = (order) => {
    // Mặc định sort theo giá (priceBase) khi bấm nút mũi tên trong UI này
    // Bạn có thể mở rộng để sort theo 'name' hoặc 'id' nếu cần
    setFilters({
      sortBy: "priceBase",
      sortOrder: order, // 'asc' hoặc 'desc'
      page: 1,
    });
    setTimeout(scrollToProducts, 0);
  };

  const handleReset = () => {
    setMin("");
    setMax("");
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      sortOrder: "",
      page: 1,
    });
    setTimeout(scrollToProducts, 0);
  };

  const openClass = isOpen ? "open" : "";
  const shiftClass = isMobileSearchOpen ? "shifted" : "";

  return (
    <div className={`advanced-search ${openClass} ${shiftClass}`}>
      <div className="container">
        <div className="advanced-search-category">
          <span>Phân loại </span>
          <select
            id="advanced-search-category-select"
            value={filters.category}
            onChange={handleCategoryChange}
            disabled={isLoadingCategories}
          >
            <option value="all">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="advanced-search-price">
          <span>Giá từ</span>
          <input
            type="number"
            placeholder="tối thiểu"
            id="min-price"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <span>đến</span>
          <input
            type="number"
            placeholder="tối đa"
            id="max-price"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
          <button id="advanced-search-price-btn" onClick={handlePriceSearch}>
            <i className="fa-light fa-magnifying-glass-dollar"></i>
          </button>
        </div>

        <div className="advanced-search-control">
          {/* Nút Tăng dần */}
          <button
            className={filters.sortOrder === "asc" ? "active" : ""}
            onClick={() => handleSort("asc")}
            title="Giá tăng dần"
          >
            <i className="fa-regular fa-arrow-up-short-wide"></i>
          </button>

          {/* Nút Giảm dần */}
          <button
            className={filters.sortOrder === "desc" ? "active" : ""}
            onClick={() => handleSort("desc")}
            title="Giá giảm dần"
          >
            <i className="fa-regular fa-arrow-down-wide-short"></i>
          </button>

          <button id="reset-search" onClick={handleReset} title="Đặt lại">
            <i className="fa-light fa-arrow-rotate-right"></i>
          </button>
          <button onClick={onClose}>
            <i className="fa-light fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
