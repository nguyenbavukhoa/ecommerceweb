import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import AddressEditView from "./AddressEditView";
import AddressForm from "./AddressForm";
import styles from "./DeliveryAddress.module.css";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { useToast } from "../../context/ToastContext";

const DeliveryAddress = ({ onAddressChange }) => {
  const { auth: currentUser } = useAuth();
  const { showToast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  // Khởi tạo từ LocalStorage
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const savedId = localStorage.getItem("selected_address_id");
    return savedId ? Number(savedId) : null;
  });

  const [loading, setLoading] = useState(true);

  // Helper map Gender <-> Type (UI)
  const mapTypeToGender = (type) => (type === "HOME" ? "MALE" : "FEMALE");
  // Hàm map ngược để hiển thị trên UI khi load từ API về
  const mapGenderToType = (gender) => (gender === "MALE" ? "HOME" : "WORK");

  // --- Load Address ---
  const fetchAddresses = async () => {
    if (currentUser && currentUser.id) {
      setLoading(true);
      try {
        const data = await authService.getUserInfos(currentUser.id);

        const mappedAddresses = data.map((item) => ({
          id: item.id,
          name: item.fullName, // UI dùng 'name' để hiển thị
          phone: item.phoneNumber, // UI dùng 'phone' để hiển thị
          address: item.address,
          type: mapGenderToType(item.gender), // Map lại type cho UI
          isDefault: false,
        }));

        setAddresses(mappedAddresses);

        // Logic chọn địa chỉ mặc định
        let idToSelect = selectedAddressId;
        const isSavedIdValid = mappedAddresses.find((a) => a.id === idToSelect);

        if (!isSavedIdValid) {
          if (mappedAddresses.length > 0) {
            idToSelect = mappedAddresses[0].id;
          } else {
            idToSelect = null;
          }
        }

        setSelectedAddressId(idToSelect);
        if (idToSelect) {
          localStorage.setItem("selected_address_id", idToSelect);
        }
      } catch (error) {
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    } else {
      setAddresses([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [currentUser]);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  useEffect(() => {
    if (onAddressChange) {
      onAddressChange(selectedAddress || null);
    }
  }, [selectedAddress, onAddressChange]);

  // --- Handlers ---

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    localStorage.setItem("selected_address_id", id);
    setIsModalOpen(false);
  };

  // [FIX API] Sửa logic map dữ liệu khi TẠO MỚI
  const handleSaveNewAddress = async (newAddressData) => {
    try {
      // newAddressData từ AddressForm trả về đã có sẵn: fullName, phoneNumber
      const payload = {
        fullName: newAddressData.fullName, // [SỬA] Lấy đúng trường fullName
        phoneNumber: newAddressData.phoneNumber, // [SỬA] Lấy đúng trường phoneNumber
        address: newAddressData.address,
        gender: newAddressData.gender || "OTHER", // [SỬA] Lấy gender đã map sẵn
      };

      console.log("📤 Sending Create Address:", payload); // Debug log

      await authService.createUserInfo(payload);
      await fetchAddresses();
      if (showToast)
        showToast({
          title: "Thành công",
          message: "Đã thêm địa chỉ mới",
          type: "success",
        });
      return true;
    } catch (error) {
      console.error("Create Address Error:", error);
      if (showToast)
        showToast({ title: "Lỗi", message: "Thêm thất bại", type: "error" });
      return false;
    }
  };

  // [FIX API] Sửa logic map dữ liệu khi CẬP NHẬT
  const handleUpdateAddress = async (updatedAddressData) => {
    try {
      const payload = {
        fullName: updatedAddressData.fullName, // [SỬA]
        phoneNumber: updatedAddressData.phoneNumber, // [SỬA]
        address: updatedAddressData.address,
        gender: updatedAddressData.gender || "OTHER",
      };

      console.log("📤 Sending Update Address:", payload); // Debug log

      await authService.updateUserInfo(updatedAddressData.id, payload);
      await fetchAddresses();
      if (showToast)
        showToast({
          title: "Thành công",
          message: "Cập nhật thành công",
          type: "success",
        });
    } catch (error) {
      if (showToast)
        showToast({
          title: "Lỗi",
          message: "Cập nhật thất bại",
          type: "error",
        });
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        await authService.deleteUserInfo(id);
        await fetchAddresses();
        if (showToast)
          showToast({
            title: "Thành công",
            message: "Đã xóa địa chỉ",
            type: "success",
          });
      } catch (error) {
        if (showToast)
          showToast({ title: "Lỗi", message: "Xóa thất bại", type: "error" });
      }
    }
  };

  // --- Render ---
  if (loading) return <div className={styles.loading}>Đang tải địa chỉ...</div>;

  if (!selectedAddress) {
    return (
      <div className={styles.addressContainer}>
        <div
          className={styles.selectedAddressDisplay}
          style={{ justifyContent: "center", borderStyle: "dashed" }}
        >
          <button
            className={styles.editBtn}
            onClick={() => setIsModalOpen(true)}
            style={{ margin: 0 }}
          >
            + Thêm địa chỉ nhận hàng mới
          </button>
        </div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <AddressModalContent
            addresses={addresses}
            selectedAddress={null}
            onSelectAddress={handleSelectAddress}
            onSaveNewAddress={handleSaveNewAddress}
            onUpdateAddress={handleUpdateAddress}
            onDeleteAddress={handleDeleteAddress}
            onClose={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.addressContainer}>
      <div className={styles.selectedAddressDisplay}>
        <div className={styles.selectedIcon}>
          <i className="fa-light fa-location-dot"></i>
        </div>
        <div className={styles.selectedDetails}>
          <p className={styles.addressText}>{selectedAddress.address}</p>
          <p className={styles.namePhone}>
            <span>{selectedAddress.name}</span>
            <span>{selectedAddress.phone}</span>
          </p>
        </div>
        <button className={styles.editBtn} onClick={() => setIsModalOpen(true)}>
          Thay đổi
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddressModalContent
          addresses={addresses}
          selectedAddress={selectedAddress}
          onSelectAddress={handleSelectAddress}
          onSaveNewAddress={handleSaveNewAddress}
          onUpdateAddress={handleUpdateAddress}
          onDeleteAddress={handleDeleteAddress}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// Component con giữ nguyên logic chuyển view (Đã fix UX quay về list)
const AddressModalContent = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onSaveNewAddress,
  onUpdateAddress,
  onDeleteAddress,
  onClose,
}) => {
  const [view, setView] = useState("list");
  const [addressToEdit, setAddressToEdit] = useState(null);

  const handleGoToEdit = (address) => {
    setAddressToEdit(address);
    setView("editing");
  };

  const handleGoToAdd = () => {
    setAddressToEdit(null);
    setView("adding");
  };

  const handleSaveNew = async (newData) => {
    const success = await onSaveNewAddress(newData);
    if (success) {
      setView("list");
    }
  };

  const handleSaveUpdate = async (updatedData) => {
    await onUpdateAddress(updatedData);
    setView("list");
  };

  if (view === "adding") {
    return (
      <AddressForm onSave={handleSaveNew} onCancel={() => setView("list")} />
    );
  }

  if (view === "editing") {
    return (
      <AddressForm
        initialData={addressToEdit}
        onSave={handleSaveUpdate}
        onCancel={() => setView("list")}
      />
    );
  }

  return (
    <AddressEditView
      addresses={addresses}
      selectedAddress={selectedAddress}
      onSelectAddress={onSelectAddress}
      onAddNew={handleGoToAdd}
      onEditAddress={handleGoToEdit}
      onDeleteAddress={onDeleteAddress}
      onCancel={onClose}
    />
  );
};

export default DeliveryAddress;
