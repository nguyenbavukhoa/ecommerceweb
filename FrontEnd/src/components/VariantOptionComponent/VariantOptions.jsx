import { useState, useEffect } from "react";
import VariantSelect from "./VariantSelect";
import styles from "./VariantOptions.module.css";

export default function VariantOptions({
  optionGroups = [],
  onSelectionChange,
}) {
  const [selected, setSelected] = useState({});

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
    const selectedValueIds = [];
    const selectedOptionsDTO = []; // 1. Thêm mảng chứa object đầy đủ

    for (const optId in selected) {
      const selectedValue = selected[optId];
      const group = optionGroups.find((g) => g.id.toString() === optId);

      if (group) {
        if (Array.isArray(selectedValue)) {
          for (const val of selectedValue) {
            const optionValue = group.values.find((v) => v.value === val);
            if (optionValue) {
              priceOfOptions += optionValue.price;
              selectedValueIds.push(optionValue.id);
              selectedOptionsDTO.push(optionValue); // Push object
            }
          }
        } else {
          const optionValue = group.values.find(
            (v) => v.value === selectedValue
          );
          if (optionValue) {
            priceOfOptions += optionValue.price;
            selectedValueIds.push(optionValue.id);
            selectedOptionsDTO.push(optionValue); // Push object
          }
        }
      }
    }

    if (onSelectionChange) {
      // 2. Truyền thêm selectedOptionsDTO về cha
      onSelectionChange(
        selected,
        priceOfOptions,
        selectedValueIds,
        selectedOptionsDTO
      );
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
