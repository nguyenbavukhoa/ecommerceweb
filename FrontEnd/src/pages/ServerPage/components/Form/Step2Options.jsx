// Step2Options.jsx (Cập nhật)
import React, { useState } from "react"; // Thêm useState
import styles from "./ProductForm.module.scss";
import { vnd } from "../../utils";

const createLocalId = () =>
  `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Props mới: initialOptions, onBack, onNext
const Step2Options = ({ initialOptions, onBack, onNext }) => {
  // Dùng state nội bộ, chỉ gọi onNext khi nhấn "Tiếp"
  const [options, setOptions] = useState(initialOptions || []);

  // ... (Tất cả các hàm: addOptionGroup, removeOptionGroup, updateOptionGroup) ...
  // ... (addOptionValue, removeOptionValue, updateOptionValue) ...
  // --- HÀM XỬ LÝ NHÓM (Group) ---
  const addOptionGroup = () => {
    const newGroup = {
      id: createLocalId(),
      name: "Size", // Tên mặc định
      isMultiSelect: false, // Yêu cầu của bạn
      values: [
        // Thêm 1 giá trị mặc định
        { id: createLocalId(), name: "Nhỏ", price: 0 },
      ],
    };
    setOptions([...options, newGroup]);
  };

  const removeOptionGroup = (groupId) => {
    if (window.confirm("Bạn có chắc muốn xóa nhóm tùy chọn này?")) {
      setOptions(options.filter((g) => g.id !== groupId));
    }
  };

  const updateOptionGroup = (groupId, field, value) => {
    setOptions(
      options.map((group) =>
        group.id === groupId ? { ...group, [field]: value } : group
      )
    );
  };

  // --- HÀM XỬ LÝ GIÁ TRỊ (Value) ---
  const addOptionValue = (groupId) => {
    const newValue = {
      id: createLocalId(),
      name: "Tùy chọn mới",
      price: 0, // Giá cộng thêm (0, 5000, 10000...)
    };
    setOptions(
      options.map((group) =>
        group.id === groupId
          ? { ...group, values: [...group.values, newValue] }
          : group
      )
    );
  };

  const removeOptionValue = (groupId, valueId) => {
    setOptions(
      options.map((group) =>
        group.id === groupId
          ? { ...group, values: group.values.filter((v) => v.id !== valueId) }
          : group
      )
    );
  };

  const updateOptionValue = (groupId, valueId, field, value) => {
    setOptions(
      options.map((group) =>
        group.id === groupId
          ? {
              ...group,
              values: group.values.map((val) =>
                val.id === valueId ? { ...val, [field]: value } : val
              ),
            }
          : group
      )
    );
  };

  // Hàm xử lý khi nhấn "Tiếp theo"
  const handleNext = () => {
    // Gửi state options hiện tại về cho cha
    onNext(options);
  };

  return (
    <div className={styles.step2Container}>
      {/* ... (Phần UI của Step 2 giữ nguyên) ... */}
      <p className={styles.step2Desc}>
        Thêm các tùy chọn cho sản phẩm (ví dụ: Size, Topping, Độ cay...). Giá
        của tùy chọn là <strong>giá cộng thêm</strong> vào giá cơ bản của sản
        phẩm.
      </p>

      {/* Render các nhóm tùy chọn */}
      <div className={styles.optionGroupsList}>
        {options.map((group) => (
          <div key={group.id} className={styles.optionGroup}>
            {/* ... (optionGroupHeader) ... */}
            <div className={styles.optionGroupHeader}>
              <input
                type="text"
                value={group.name}
                placeholder="Tên nhóm (VD: Size)"
                className={styles.optionGroupName}
                onChange={(e) =>
                  updateOptionGroup(group.id, "name", e.target.value)
                }
              />
              <label className={styles.optionGroupMulti}>
                <input
                  type="checkbox"
                  checked={group.isMultiSelect}
                  onChange={(e) =>
                    updateOptionGroup(
                      group.id,
                      "isMultiSelect",
                      e.target.checked
                    )
                  }
                />
                Cho phép chọn nhiều
              </label>
              <button
                className={styles.optionGroupRemove}
                onClick={() => removeOptionGroup(group.id)}
              >
                <i className="fa-regular fa-trash"></i> Xóa nhóm
              </button>
            </div>
            {/* ... (optionValuesList) ... */}
            <div className={styles.optionValuesList}>
              {group.values.map((val) => (
                <div key={val.id} className={styles.optionValue}>
                  <input
                    type="text"
                    value={val.name}
                    placeholder="Tên tùy chọn (VD: Nhỏ)"
                    className={styles.formControl}
                    onChange={(e) =>
                      updateOptionValue(
                        group.id,
                        val.id,
                        "name",
                        e.target.value
                      )
                    }
                  />
                  <div className={styles.priceInputContainer}>
                    <input
                      type="number"
                      value={val.price}
                      placeholder="Giá cộng thêm"
                      className={styles.formControl}
                      onChange={(e) =>
                        updateOptionValue(
                          group.id,
                          val.id,
                          "price",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                    <span>({vnd(val.price)})</span>
                  </div>
                  <button
                    className={styles.optionValueRemove}
                    onClick={() => removeOptionValue(group.id, val.id)}
                  >
                    <i className="fa-regular fa-xmark"></i>
                  </button>
                </div>
              ))}
              <button
                className={styles.addOptionValueBtn}
                onClick={() => addOptionValue(group.id)}
              >
                <i className="fa-light fa-plus"></i>
                Thêm tùy chọn (VD: Vừa, Lớn...)
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addGroupBtn} onClick={addOptionGroup}>
        <i className="fa-light fa-layer-plus"></i>
        THÊM NHÓM TÙY CHỌN (VD: Topping)
      </button>

      {/* Nút điều hướng cho Bước 2 */}
      <div className={styles.stepNavigation}>
        <button
          type="button"
          className={styles.formPageCancelBtn} // Tận dụng style
          onClick={onBack} // Gọi hàm onBack từ props
        >
          <i className="fa-light fa-arrow-left"></i>
          QUAY LẠI (Bước 1)
        </button>
        <button
          type="button"
          className={styles.formSubmit} // Tận dụng style
          onClick={handleNext} // Gọi hàm onNext (đã đổi tên)
        >
          TIẾP TỤC
          <i className="fa-light fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step2Options;
