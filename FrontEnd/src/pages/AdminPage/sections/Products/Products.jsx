import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

// 1. IMPORT AUTH ĐỂ LẤY USER
import { useAuth } from "../../../../context/AuthContext";

import { useFilters, useCategories } from "../../../../context/FilterProvider";
import { useProducts } from "../../../../hooks/useProducts";
import { useToast } from "../../../../context/ToastContext";
import ProductDetailModal from "../../components/Modals/ProductDetailModal";
import ProductForm from "../../components/Form/ProductForm";
import styles from "./Products.module.scss";
import { vnd } from "../../utils";
import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";
import { db } from "../../../../data/mockData";

const Products = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // 2. LẤY STORE ID TỪ USER ĐANG ĐĂNG NHẬP
  const { user } = useAuth();
  const currentStoreId = user?.storeId;

  const { filters, setFilters } = useFilters();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const [searchTerm, setSearchTerm] = useState(filters.name || "");

  // 3. TRUYỀN STORE ID VÀO HOOK USEPRODUCTS
  // Gộp filters hiện tại với storeId
  const { data, isLoading, error } = useProducts({
    ...filters,
    storeId: currentStoreId,
  });

  const { products, totalPages } = data || { products: [], totalPages: 0 };

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEditId, setProductToEditId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProductIdForDetail, setSelectedProductIdForDetail] =
    useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.name) {
        setFilters({ name: searchTerm });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, filters.name, setFilters]);

  const handleStatusToggle = async (product) => {
    try {
      const newStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      db.products.update(product.id, { status: newStatus });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast({
        title: "Thành công",
        message: `Đã đổi trạng thái sang: ${
          newStatus === "ACTIVE" ? "Đang bán" : "Tạm ngưng"
        }`,
        type: "success",
      });
    } catch (err) {
      console.error(err);
      showToast({
        title: "Lỗi",
        message: "Không thể cập nhật trạng thái",
        type: "error",
      });
    }
  };

  const openAddModal = () => {
    setProductToEditId(null);
    setIsFormOpen(true);
  };
  const openEditModal = (product) => {
    setProductToEditId(product.id);
    setIsFormOpen(true);
  };
  const openDetailModal = (product) => {
    setSelectedProductIdForDetail(product.id);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProductIdForDetail(null);
  };

  const handleSaveSuccess = () => {
    setIsFormOpen(false);
    setProductToEditId(null);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setProductToEditId(null);
  };

  const handleCategoryChange = (e) => setFilters({ category: e.target.value });
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters({ page: newPage });
  };
  const handleCancelSearch = () => {
    setSearchTerm("");
    setFilters({ name: "", category: "all", page: 1 });
  };

  if (isFormOpen) {
    return (
      <ProductForm
        productToEditId={productToEditId}
        onSaveSuccess={handleSaveSuccess}
        onCancel={handleCancelForm}
        // Có thể truyền storeId vào đây nếu muốn chắc chắn,
        // nhưng ProductForm cũng có thể tự lấy từ AuthContext
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
              onChange={handleCategoryChange}
              value={filters.category}
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
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
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
              <div className={styles.noResultH}>Không có sản phẩm nào</div>
              {/* Thêm thông báo nếu store chưa có món */}
              <p>Danh sách món ăn của chi nhánh này đang trống.</p>
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
                      {categories.find((c) => c.id === product.categoryId)
                        ?.name || "Chưa phân loại"}
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
                      <label
                        className={styles.statusToggle}
                        title={
                          product.status === "ACTIVE" ? "Đang bán" : "Tạm ngưng"
                        }
                      >
                        <input
                          type="checkbox"
                          checked={product.status === "ACTIVE"}
                          onChange={() => handleStatusToggle(product)}
                        />
                        <span className={styles.slider}></span>
                      </label>
                      <button
                        className={styles.btnEdit}
                        onClick={() => openEditModal(product)}
                        title="Chỉnh sửa"
                      >
                        <i className="fa-light fa-pen-to-square"></i>
                      </button>
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
      <ProductDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        productId={selectedProductIdForDetail}
      />
    </>
  );
};

export default Products;
