import { useState, useEffect } from "react";
import { useFilters, useCategories } from "../../../context/FilterProvider";
/**
 * Component Lọc Nâng Cao.
 * * Props:
 * - isOpen (boolean): Trạng thái mở/đóng, nhận từ HeaderComponent
 * - onClose (function): Hàm để đóng modal, nhận từ HeaderComponent
 */

// --- Tạo hàm cuộn (giống hệt HeaderComponent) ---
const scrollToProducts = () => {
  document
    .getElementById("home-service")
    ?.scrollIntoView({ behavior: "smooth" });
};

export default function AdvancedSearch({ isOpen, onClose }) {
  // Lấy state filter chung và hàm setFilter từ useFilters
  const { filters, setFilters } = useFilters();

  // LẤY DANH SÁCH CATEGORY TỪ API
  // Tự gọi hook useCategories để lấy danh sách
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  // TẠO STATE CỤC BỘ (LOCAL STATE)
  // Dùng để gõ input (min/max price) mượt mà.
  const [min, setMin] = useState(filters.minPrice);
  const [max, setMax] = useState(filters.maxPrice);

  // Đồng bộ state cục bộ (ô input) khi state context thay đổi
  useEffect(() => {
    setMin(filters.minPrice);
    setMax(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  // CÁC HÀM XỬ LÝ (HANDLERS)

  // Khi thay đổi Category
  const handleCategoryChange = (e) => {
    setFilters({ category: e.target.value });
    setTimeout(scrollToProducts, 0);
  };

  // Khi nhấn nút tìm kiếm giá
  const handlePriceSearch = () => {
    if (min && max && parseInt(min) > parseInt(max)) {
      alert("Khoảng giá không hợp lệ!");
      return;
    }
    // Ghi state cục bộ (min, max) lên URL
    setFilters({ minPrice: min, maxPrice: max });
    setTimeout(scrollToProducts, 0);
  };

  // Khi nhấn nút Sắp xếp
  const handleSort = (order) => {
    setFilters({ sortBy: "priceBase", sortOrder: order });
    setTimeout(scrollToProducts, 0);
  };

  // Khi nhấn nút Reset
  const handleReset = () => {
    setFilters({ category: "Tất cả" });
    // Xóa state cục bộ
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

  // 6. RENDER
  const openClass = isOpen ? "open" : "";

  return (
    <div className={`advanced-search ${openClass}`}>
      <div className="container">
        {/* === PHẦN LỌC CATEGORY === */}
        <div className="advanced-search-category">
          <span>Phân loại </span>
          <select
            id="advanced-search-category-select"
            value={filters.category} // Đọc từ context
            onChange={handleCategoryChange} // Ghi vào context
            disabled={isLoadingCategories} // Vô hiệu hóa khi đang tải
          >
            <option value="all">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* === PHẦN LỌC GIÁ === */}
        <div className="advanced-search-price">
          <span>Giá từ</span>
          <input
            type="number"
            placeholder="tối thiểu"
            id="min-price"
            value={min} // Đọc từ state cục bộ
            onChange={(e) => setMin(e.target.value)} // Ghi vào state cục bộ
          />
          <span>đến</span>
          <input
            type="number"
            placeholder="tối đa"
            id="max-price"
            value={max} // Đọc từ state cục bộ
            onChange={(e) => setMax(e.target.value)} // Ghi vào state cục bộ
          />
          <button id="advanced-search-price-btn" onClick={handlePriceSearch}>
            <i className="fa-light fa-magnifying-glass-dollar"></i>
          </button>
        </div>

        {/* === PHẦN ĐIỀU KHIỂN (SẮP XẾP, RESET, ĐÓNG) === */}
        <div className="advanced-search-control">
          <button
            id="sort-ascending"
            className={filters.sortOrder === "asc" ? "active" : ""} // Đọc từ context
            onClick={() => handleSort("asc")}
          >
            <i className="fa-regular fa-arrow-up-short-wide"></i>
          </button>
          <button
            id="sort-descending"
            className={filters.sortOrder === "desc" ? "active" : ""} // Đọc từ context
            onClick={() => handleSort("desc")}
          >
            <i className="fa-regular fa-arrow-down-wide-short"></i>
          </button>
          <button id="reset-search" onClick={handleReset}>
            <i className="fa-light fa-arrow-rotate-right"></i>
          </button>
          <button onClick={onClose}>
            {" "}
            {/* Gọi hàm từ props */}
            <i className="fa-light fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
