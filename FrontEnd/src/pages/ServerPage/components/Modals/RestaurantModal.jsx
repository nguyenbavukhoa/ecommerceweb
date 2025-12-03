import React, { useState, useEffect } from "react";
import CommonModal from "./CommonModal";
import { useToast } from "../../../../context/ToastContext";
import styles from "./RestaurantModal.module.scss";

// Import Hook
import {
  useCreateStore,
  useUpdateStore,
} from "../../../../context/FilterProvider";

const RestaurantModal = ({ isOpen, onClose, storeToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();

  const isEdit = !!storeToEdit;
  const [isSearching, setIsSearching] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    phone: "",
    address: "", // Field này dùng cho UI tìm kiếm, không gửi lên API nếu API không nhận
    description: "",
    lat: "",
    lng: "",
    openTime: "08:00:00",
    closeTime: "22:00:00",
    active: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setForm({
          name: storeToEdit.name || "",
          code: storeToEdit.code || "",
          phone: storeToEdit.phone || "",
          address: storeToEdit.address || "",
          description: storeToEdit.description || "",
          lat: storeToEdit.lat || "",
          lng: storeToEdit.lng || "",
          // Đảm bảo giờ có giây khi load lên
          openTime: formatTime(storeToEdit.openTime || "08:00:00"),
          closeTime: formatTime(storeToEdit.closeTime || "22:00:00"),
          active: storeToEdit.active ?? true,
        });
      } else {
        setForm({
          name: "",
          code: "",
          phone: "",
          address: "",
          description: "",
          lat: "",
          lng: "",
          openTime: "08:00:00",
          closeTime: "22:00:00",
          active: true,
        });
      }
    }
  }, [isOpen, isEdit, storeToEdit]);

  // Helper: Đảm bảo giờ luôn có :00 ở cuối (HH:mm:ss)
  const formatTime = (timeStr) => {
    if (!timeStr) return "00:00:00";
    // Nếu chỉ có HH:mm (độ dài 5) -> thêm :00
    if (timeStr.length === 5) return timeStr + ":00";
    return timeStr;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSearchLocation = async () => {
    if (!form.address) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng nhập địa chỉ",
        type: "warning",
      });
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        form.address
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        setForm((prev) => ({
          ...prev,
          lat: location.lat, // API trả về string, lát nữa convert sang number nếu cần
          lng: location.lon,
        }));
        showToast({
          title: "Thành công",
          message: "Đã lấy tọa độ!",
          type: "success",
        });
      } else {
        showToast({
          title: "Lỗi",
          message: "Không tìm thấy địa điểm.",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        title: "Lỗi",
        message: "Lỗi kết nối bản đồ.",
        type: "error",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.code) {
      showToast({
        title: "Thiếu thông tin",
        message: "Nhập tên, mã và SĐT.",
        type: "warning",
      });
      return;
    }

    // [QUAN TRỌNG] Chuẩn hóa dữ liệu trước khi gửi (Payload)
    // Loại bỏ các trường thừa (như 'address' nếu API không nhận)
    // Format lại giờ giấc
    const payload = {
      name: form.name,
      code: form.code,
      phone: form.phone,
      description: form.description,
      // Chuyển lat/lng sang số (hoặc giữ string tùy backend, nhưng postman mẫu là string cũng ok)
      lat: form.lat,
      lng: form.lng,
      // Đảm bảo format HH:mm:ss
      openTime: formatTime(form.openTime),
      closeTime: formatTime(form.closeTime),
      active: form.active,
    };

    // Nếu Backend của bạn hỗ trợ nhận field address thì uncomment dòng dưới,
    // còn theo mẫu json bạn gửi thì không thấy address.
    // payload.address = form.address;

    try {
      if (isEdit) {
        await updateStoreMutation.mutateAsync({
          id: storeToEdit.id,
          data: payload, // Gửi payload sạch
        });
      } else {
        await createStoreMutation.mutateAsync(payload); // Gửi payload sạch
      }
      onSaveSuccess();
    } catch (error) {
      // Error handled in hook
      console.error(error);
    }
  };

  const isLoading =
    createStoreMutation.isPending || updateStoreMutation.isPending;

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "CẬP NHẬT CỬA HÀNG" : "THÊM CỬA HÀNG MỚI"}
      customWidth="700px"
    >
      <div className={styles.formContent}>
        <form className={styles.storeForm} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Tên cửa hàng <span>*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="KHK Food Chi nhánh..."
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label>
                Mã cửa hàng <span>*</span>
              </label>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="RES-01"
                className={styles.formControl}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>
                Số điện thoại <span>*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="0909..."
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Trạng thái</label>
              <select
                name="active"
                value={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.value === "true" })
                }
                className={styles.formControl}
              >
                <option value="true">Đang hoạt động</option>
                <option value="false">Tạm ngưng</option>
              </select>
            </div>
          </div>

          {/* ĐỊA CHỈ & SEARCH */}
          <div className={styles.formGroup}>
            <label>Địa chỉ (Nhập để lấy tọa độ)</label>
            <div className={styles.inputGroupWithBtn}>
              <input
                className={styles.formControl}
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Ví dụ: 135 Nam Kỳ Khởi Nghĩa..."
              />
              <button
                type="button"
                className={styles.btnSearch}
                onClick={handleSearchLocation}
                disabled={isSearching || !form.address}
              >
                {isSearching ? (
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                  <i className="fa-solid fa-magnifying-glass-location"></i>
                )}
                {isSearching ? " Đang tìm..." : " Tọa độ"}
              </button>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Kinh độ (Lng)</label>
              <input
                className={styles.formControl}
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="Tự động điền..."
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label>Vĩ độ (Lat)</label>
              <input
                className={styles.formControl}
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="Tự động điền..."
                readOnly
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Giờ mở cửa</label>
              {/* step="1" cho phép nhập giây nếu trình duyệt hỗ trợ */}
              <input
                type="time"
                name="openTime"
                value={form.openTime}
                onChange={handleChange}
                step="1"
                className={styles.formControl}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Giờ đóng cửa</label>
              <input
                type="time"
                name="closeTime"
                value={form.closeTime}
                onChange={handleChange}
                step="1"
                className={styles.formControl}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className={styles.formControl}
              rows="3"
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.btnSave}
              disabled={isLoading}
            >
              {isLoading
                ? "Đang xử lý..."
                : isEdit
                ? "Lưu thay đổi"
                : "Tạo cửa hàng"}
            </button>
          </div>
        </form>
      </div>
    </CommonModal>
  );
};

export default RestaurantModal;
