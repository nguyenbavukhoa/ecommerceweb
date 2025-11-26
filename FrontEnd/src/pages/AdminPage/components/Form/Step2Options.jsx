// src/pages/AdminPage/sections/Products/Step2Options.jsx
import React, { useState } from "react";
import styles from "./ProductForm.module.scss";
import { vnd } from "../../utils";

const createLocalId = () =>
  `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const Step2Options = ({ initialOptions, onBack, onNext }) => {
  const [options, setOptions] = useState(initialOptions || []);

  const addOptionGroup = () => {
    setOptions([
      ...options,
      {
        id: createLocalId(),
        name: "Tùy chọn mới",
        isMultiSelect: false,
        values: [{ id: createLocalId(), name: "Nhỏ", price: 0 }],
      },
    ]);
  };

  const removeOptionGroup = (groupId) => {
    if (window.confirm("Xóa nhóm này?")) {
      setOptions(options.filter((g) => g.id !== groupId));
    }
  };

  const updateOptionGroup = (groupId, field, value) => {
    setOptions(
      options.map((g) => (g.id === groupId ? { ...g, [field]: value } : g))
    );
  };

  const addOptionValue = (groupId) => {
    setOptions(
      options.map((g) =>
        g.id === groupId
          ? {
              ...g,
              values: [
                ...g.values,
                { id: createLocalId(), name: "Mới", price: 0 },
              ],
            }
          : g
      )
    );
  };

  const removeOptionValue = (groupId, valueId) => {
    setOptions(
      options.map((g) =>
        g.id === groupId
          ? { ...g, values: g.values.filter((v) => v.id !== valueId) }
          : g
      )
    );
  };

  const updateOptionValue = (groupId, valueId, field, value) => {
    setOptions(
      options.map((g) =>
        g.id === groupId
          ? {
              ...g,
              values: g.values.map((v) =>
                v.id === valueId ? { ...v, [field]: value } : v
              ),
            }
          : g
      )
    );
  };

  return (
    <div className={styles.step2Container}>
      <p className={styles.step2Desc}>
        Thêm các tùy chọn (Size, Topping...). Giá là giá cộng thêm.
      </p>

      <div className={styles.optionGroupsList}>
        {options.map((group) => (
          <div key={group.id} className={styles.optionGroup}>
            <div className={styles.optionGroupHeader}>
              <input
                type="text"
                value={group.name}
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
                Chọn nhiều
              </label>
              <button
                className={styles.optionGroupRemove}
                onClick={() => removeOptionGroup(group.id)}
              >
                <i className="fa-regular fa-trash"></i> Xóa
              </button>
            </div>
            <div className={styles.optionValuesList}>
              {group.values.map((val) => (
                <div key={val.id} className={styles.optionValue}>
                  <input
                    type="text"
                    value={val.name}
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
                <i className="fa-light fa-plus"></i> Thêm giá trị
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className={styles.addGroupBtn} onClick={addOptionGroup}>
        <i className="fa-light fa-layer-plus"></i> THÊM NHÓM TÙY CHỌN
      </button>

      <div className={styles.stepNavigation}>
        <button className={styles.formPageCancelBtn} onClick={onBack}>
          <i className="fa-light fa-arrow-left"></i> QUAY LẠI
        </button>
        <button className={styles.formSubmit} onClick={() => onNext(options)}>
          TIẾP TỤC <i className="fa-light fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step2Options;
