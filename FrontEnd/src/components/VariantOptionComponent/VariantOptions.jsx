import { useState, useEffect } from "react";
import VariantSelect from "./VariantSelect";
import styles from "./VariantOptions.module.css";

export default function VariantOptions({
  optionGroups = [],
  onSelectionChange,
}) {
  const [selected, setSelected] = useState({});

  // ... hàm handleChange không đổi ...
  const handleChange = (optId, value, isMulti) => {
    setSelected((prev) => {
      const updated = { ...prev };
      if (isMulti) {
        const current = prev[optId] || [];
        if (current.includes(value)) {
          const newArr = current.filter((v) => v !== value);
          if (newArr.length > 0) {
            updated[optId] = newArr;
          } else {
            delete updated[optId];
          }
        } else {
          updated[optId] = [...current, value];
        }
      } else {
        if (value === "" || value === null) {
          delete updated[optId];
        } else {
          updated[optId] = value;
        }
      }
      return updated;
    });
  };

  useEffect(() => {
    let priceOfOptions = 0;
    const selectedValueIds = []; // 👈 Mảng mới để chứa các ID

    for (const optId in selected) {
      const selectedValue = selected[optId];
      const group = optionGroups.find((g) => g.id.toString() === optId);

      if (group) {
        if (Array.isArray(selectedValue)) {
          for (const val of selectedValue) {
            const optionValue = group.values.find((v) => v.value === val);
            if (optionValue) {
              priceOfOptions += optionValue.price;
              selectedValueIds.push(optionValue.id); // 👈 Thêm ID vào mảng
            }
          }
        } else {
          const optionValue = group.values.find(
            (v) => v.value === selectedValue
          );
          if (optionValue) {
            priceOfOptions += optionValue.price;
            selectedValueIds.push(optionValue.id); // 👈 Thêm ID vào mảng
          }
        }
      }
    }

    if (onSelectionChange) {
      // 👇 Gửi thêm mảng ID về cho component cha
      onSelectionChange(selected, priceOfOptions, selectedValueIds);
    }
  }, [selected, optionGroups, onSelectionChange]);

  if (!optionGroups || optionGroups.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {optionGroups.map((group) => (
        <VariantSelect
          key={group.id}
          option={group}
          values={group.values || []}
          selected={selected[group.id]}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}
