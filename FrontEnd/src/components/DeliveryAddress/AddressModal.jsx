// src/components/DeliveryAddress/AddressModal.jsx
import React, { useState, useEffect } from "react";
import Modal from "../common/Modal"; // Import Modal chung bạn đã có
import AddressEditView from "./AddressEditView";
import AddressForm from "./AddressForm";

const AddressModal = ({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  onSelectAddress,
  onSaveNewAddress,
  onUpdateAddress,
}) => {
  // State để quản lý giao diện bên trong modal: 'list' hoặc 'form'
  const [view, setView] = useState("list");

  // State để lưu thông tin địa chỉ cần sửa
  const [addressToEdit, setAddressToEdit] = useState(null);

  // Reset về view danh sách mỗi khi modal được mở lại
  useEffect(() => {
    if (isOpen) {
      setView("list");
      setAddressToEdit(null);
    }
  }, [isOpen]);

  const handleGoToEdit = (address) => {
    setAddressToEdit(address);
    setView("form");
  };

  const handleGoToAdd = () => {
    setAddressToEdit(null);
    setView("form");
  };

  // Xử lý khi lưu form (cả thêm mới và cập nhật)
  const handleSave = (data) => {
    if (addressToEdit) {
      // Nếu có addressToEdit, nghĩa là đang ở chế độ sửa
      onUpdateAddress(data);
    } else {
      // Nếu không, là đang thêm mới
      onSaveNewAddress(data);
    }
    // Sau khi lưu, không cần tự động quay về list vì component cha (DeliveryAddress) sẽ đóng modal
  };

  // Nội dung sẽ được hiển thị bên trong Modal
  const renderContent = () => {
    if (view === "form") {
      return (
        <AddressForm
          // Dùng key để React re-render lại form khi chuyển từ sửa sang thêm mới
          key={addressToEdit ? addressToEdit.id : "new"}
          initialData={addressToEdit || {}}
          onSave={handleSave}
          onCancel={() => setView("list")} // Nút back trên form sẽ quay lại danh sách
        />
      );
    }

    return (
      // Mặc định là view 'list'
      <AddressEditView
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={onSelectAddress}
        onAddNew={handleGoToAdd}
        onEditAddress={handleGoToEdit}
        onCancel={onClose} // Nút back trên header sẽ đóng cả modal
      />
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
};

export default AddressModal;
