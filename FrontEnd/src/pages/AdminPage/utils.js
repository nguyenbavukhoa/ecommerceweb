// Các hàm helper từ admin.js

/**
 * Định dạng số thành tiền tệ VND.
 * @param {number} price - Số tiền
 * @returns {string} - Chuỗi tiền tệ (VD: 50.000 ₫)
 */
export const vnd = (price) => {
  if (typeof price !== "number") {
    try {
      price = parseInt(price);
      if (isNaN(price)) return "0 ₫";
    } catch (e) {
      return "0 ₫";
    }
  }
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

/**
 * Tạo ID mới không trùng lặp cho một mảng.
 * @param {Array<Object>} arr - Mảng các đối tượng (phải có key 'id')
 * @returns {number} - ID mới
 */
export const createId = (arr) => {
  if (!arr || arr.length === 0) return 1;
  let id = Math.max(...arr.map((item) => item.id)) + 1;
  return id;
};

/**
 * Tạo ID đơn hàng (chuỗi) không trùng lặp.
 * @param {Array<Object>} arr - Mảng các đơn hàng (phải có key 'id')
 * @returns {string} - ID mới (VD: "VYF12")
 */
export const createOrderId = (arr) => {
  if (!arr || arr.length === 0) return "VYF1";
  let maxId = 0;
  arr.forEach((item) => {
    const num = parseInt(item.id.replace("VYF", ""));
    if (num > maxId) maxId = num;
  });
  return `VYF${maxId + 1}`;
};

/**
 * Định dạng ngày (Date object hoặc string) sang 'dd/mm/yyyy'.
 * @param {string | Date} date - Ngày cần định dạng
 * @returns {string} - Chuỗi 'dd/mm/yyyy'
 */
export const formatDate = (date) => {
  let fm = new Date(date);
  let yyyy = fm.getFullYear();
  let mm = fm.getMonth() + 1;
  let dd = fm.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return dd + "/" + mm + "/" + yyyy;
};

/**
 * Lấy đường dẫn ảnh chuẩn hóa cho thư mục 'products'.
 * @param {string} path - Đường dẫn ảnh (có thể là full path, blob, hoặc chỉ tên file)
 * @returns {string} - Đường dẫn chuẩn (VD: ./assets/img/products/ten-file.png)
 */
export const getProductImagePath = (path) => {
  if (!path) return "./assets/img/blank-image.png";
  // Nếu là ảnh mới upload (preview)
  if (path.startsWith("blob:")) return path;

  let patharr = path.split("/");
  let lastSegment = patharr[patharr.length - 1];

  if (lastSegment === "blank-image.png" || lastSegment === "") {
    return "./assets/img/blank-image.png";
  }
  // Giả sử ảnh đã nằm đúng thư mục
  if (path.startsWith("./assets/img/products/")) return path;

  return "./assets/img/products/" + lastSegment;
};
