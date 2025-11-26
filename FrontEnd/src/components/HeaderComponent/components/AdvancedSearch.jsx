import { useState, useEffect } from "react";
import { useFilters, useCategories } from "../../../context/FilterProvider";
import "../styles/AdvancedSearch.css";
const scrollToProducts = () => {
  document
    .getElementById("home-service")
    ?.scrollIntoView({ behavior: "smooth" });
};

// 1. Thêm prop isMobileSearchOpen
export default function AdvancedSearch({
  isOpen,
  onClose,
  isMobileSearchOpen,
}) {
  const { filters, setFilters } = useFilters();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const [min, setMin] = useState(filters.minPrice);
  const [max, setMax] = useState(filters.maxPrice);

  useEffect(() => {
    setMin(filters.minPrice);
    setMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (e) => {
    setFilters({ category: e.target.value });
    setTimeout(scrollToProducts, 0);
  };

  const handlePriceSearch = () => {
    if (min && max && parseInt(min) > parseInt(max)) {
      alert("Khoảng giá không hợp lệ!");
      return;
    }
    setFilters({ minPrice: min, maxPrice: max });
    setTimeout(scrollToProducts, 0);
  };

  const handleSort = (order) => {
    setFilters({ sortBy: "priceBase", sortOrder: order });
    setTimeout(scrollToProducts, 0);
  };

  const handleReset = () => {
    setFilters({ category: "Tất cả" });
    setMin("");
    setMax("");
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      sortOrder: "",
    });
    setTimeout(scrollToProducts, 0);
  };

  // 2. Logic tính toán class
  const openClass = isOpen ? "open" : "";
  // Nếu search mobile mở -> thêm class 'shifted'
  const shiftClass = isMobileSearchOpen ? "shifted" : "";

  return (
    // 3. Thêm shiftClass vào div container
    <div className={`advanced-search ${openClass} ${shiftClass}`}>
      <div className="container">
        {/* ... Nội dung bên trong GIỮ NGUYÊN KHÔNG ĐỔI ... */}
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
          <button
            className={filters.sortOrder === "asc" ? "active" : ""}
            onClick={() => handleSort("asc")}
          >
            <i className="fa-regular fa-arrow-up-short-wide"></i>
          </button>
          <button
            className={filters.sortOrder === "desc" ? "active" : ""}
            onClick={() => handleSort("desc")}
          >
            <i className="fa-regular fa-arrow-down-wide-short"></i>
          </button>
          <button id="reset-search" onClick={handleReset}>
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
