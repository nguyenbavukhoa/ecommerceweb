import { useState, useEffect, useMemo } from "react";
// Hook and context
import { useFilters, useCategories } from "../../../../context/FilterProvider";
import { useProducts } from "../../../../hooks/useProducts";
import { useToast } from "../../../../context/ToastContext";
// Import modal chi tiết
import ProductDetailModal from "../../components/Modals/ProductDetailModal";
// import Form chỉnh sửa và thay đổi
import ProductForm from "../../components/Form/ProductForm";
// styles
import styles from "./Products.module.scss";
// utils
import { vnd } from "../../utils";
// components
import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";

const Products = () => {
  const { showToast } = useToast();

  // === SỬ DỤNG HOOK TỪ CONTEXT ===
  const { filters, setFilters } = useFilters();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // State local cho thanh tìm kiếm (để debounce)
  const [searchTerm, setSearchTerm] = useState(filters.name || "");

  // === LẤY DATA TỪ API ===
  // Truyền toàn bộ object 'filters' vào useProducts
  const { data, isLoading, error } = useProducts(filters);
  const { products, totalPages } = data || { products: [], totalPages: 0 };

  // === STATE CỤC BỘ (CHO FORM VÀ MODAL) ===
  const [isFormOpen, setIsFormOpen] = useState(false);
  // Sửa: Dùng productToEditId như file gốc của bạn
  const [productToEditId, setProductToEditId] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProductIdForDetail, setSelectedProductIdForDetail] =
    useState(null);

  // --- Chức năng tìm kiếm (có debounce) ---
  useEffect(() => {
    // Khi người dùng dừng gõ 500ms, mới cập nhật filter
    const timer = setTimeout(() => {
      // Chỉ set filter nếu khác giá trị hiện tại
      if (searchTerm !== filters.name) {
        setFilters({ name: searchTerm });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.name, setFilters]);

  // --- Chức năng Nút gạt Status ---
  const handleStatusToggle = (product) => {
    // TODO: VIỆC CẦN LÀM TIẾP THEO
    // Hàm này cần gọi API mutation để cập nhật status

    showToast({
      title: "Chưa hỗ trợ",
      message: "Chức năng này cần gọi API (mutation) để cập nhật status!",
      type: "warning",
    });
    console.warn(
      "TODO: Gọi API để cập nhật status cho sản phẩm ID:",
      product.id
    );
  };

  // --- Mở Form (Edit/Add) ---
  const openAddModal = () => {
    setProductToEditId(null);
    setIsFormOpen(true);
  };

  const openEditModal = (product) => {
    setProductToEditId(product.id); // Chỉ gửi ID
    setIsFormOpen(true);
  };

  // --- Mở Modal Chi Tiết ---
  const openDetailModal = (product) => {
    setSelectedProductIdForDetail(product.id);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProductIdForDetail(null);
  };

  // --- Xử lý Form ---
  const handleSaveSuccess = () => {
    setIsFormOpen(false);
    setProductToEditId(null);
    // React Query sẽ tự động refetch (nếu bạn thiết lập mutation)
    // Tạm thời chỉ đóng form
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setProductToEditId(null);
  };

  // --- Xử lý Lọc và Phân trang (ĐÃ SỬA) ---
  const handleCategoryChange = (e) => {
    setFilters({ category: e.target.value });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters({ page: newPage });
  };

  const handleCancelSearch = () => {
    setSearchTerm(""); // Xóa input
    setFilters({
      // Reset filter
      name: "",
      category: "all",
      page: 1,
    });
  };

  // === RENDER ===
  if (isFormOpen) {
    return (
      <ProductForm
        productToEditId={productToEditId} // Gửi ID
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <>
      <div className={styles.section}>
        <div className={styles.adminControl}>
          <div className={styles.adminControlLeft}>
            <select
              name="categories"
              id="categories"
              onChange={handleCategoryChange}
              value={filters.category} // Lấy giá trị từ context
              disabled={categoriesLoading}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.adminControlCenter}>
            <form
              className={styles.formSearch}
              onSubmit={(e) => e.preventDefault()}
            >
              <span className={styles.searchBtn}>
                <i className="fa-light fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className={styles.formSearchInput}
                placeholder="Tìm kiếm tên món..."
                value={searchTerm} // Dùng state local
                onInput={(e) => setSearchTerm(e.target.value)} // Cập nhật state local
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            <button
              className={styles.btnControlLarge}
              onClick={handleCancelSearch}
            >
              <i className="fa-light fa-rotate-right"></i> Làm mới
            </button>
            <button className={styles.btnControlLarge} onClick={openAddModal}>
              <i className="fa-light fa-plus"></i> Thêm món mới
            </button>
          </div>
        </div>

        {/* --- Danh sách sản phẩm --- */}
        <div id="show-product">
          {isLoading ? (
            <div className={styles.noResult}>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className={styles.noResult}>
              <p>Lỗi: {error.message}</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.noResult}>
              <div className={styles.noResultI}>
                <i className="fa-light fa-face-sad-cry"></i>
              </div>
              <div className={styles.noResultH}>
                Không có sản phẩm để hiển thị
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div className={styles.list} key={product.id}>
                <div className={styles.listLeft}>
                  <ImageWithFallback src={product.imgMain} alt={product.name} />
                  <div className={styles.listInfo}>
                    <h4>{product.name}</h4>
                    <p className={styles.listNote}>{product.description}</p>
                    <span className={styles.listCategory}>
                      {product.productCategoryDTO?.name || "Chưa phân loại"}
                    </span>
                  </div>
                </div>
                <div className={styles.listRight}>
                  <div className={styles.listPrice}>
                    <span className={styles.listCurrentPrice}>
                      {vnd(product.priceBase)}
                    </span>
                  </div>
                  <div className={styles.listControl}>
                    <div className={styles.listTool}>
                      {/* 1. Nút gạt Status */}
                      <label
                        className={styles.statusToggle}
                        title={product.active ? "Hoạt động" : "Đã khóa"}
                      >
                        <input
                          type="checkbox"
                          checked={product.active}
                          onChange={() => handleStatusToggle(product)}
                        />
                        <span className={styles.slider}></span>
                      </label>

                      {/* 2. Nút Sửa */}
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEditModal(product)}
                        title="Chỉnh sửa"
                      >
                        <i className="fa-light fa-pen-to-square"></i>
                      </button>

                      {/* 3. Nút Xem Chi Tiết */}
                      <button
                        className={styles.btnDetail}
                        onClick={() => openDetailModal(product)}
                        title="Xem chi tiết"
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Phân trang --- */}
        <div className={styles.pageNav}>
          <ul className={styles.pageNavList}>
            <li
              className={`${styles.pageNavItem} ${
                filters.page === 1 ? styles.disabled : ""
              }`}
            >
              <a href="#!" onClick={() => handlePageChange(filters.page - 1)}>
                &laquo;
              </a>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`${styles.pageNavItem} ${
                  filters.page === i + 1 ? styles.active : ""
                }`}
              >
                <a href="#!" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </a>
              </li>
            ))}
            <li
              className={`${styles.pageNavItem} ${
                filters.page === totalPages ? styles.disabled : ""
              }`}
            >
              <a href="#!" onClick={() => handlePageChange(filters.page + 1)}>
                &raquo;
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* --- Modal Chi Tiết (từ bước trước) --- */}
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        productId={selectedProductIdForDetail} // Truyền ID
      />
    </>
  );
};

export default Products;
