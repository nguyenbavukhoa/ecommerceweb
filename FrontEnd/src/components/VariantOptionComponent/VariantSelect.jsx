// src/components/VariantOptionComponent/VariantSelect.jsx
import styles from "./VariantSelect.module.css";

export default function VariantSelect({
  option,
  values = [],
  selected,
  onChange,
}) {
  // Mặc định cho phép chọn nhiều nếu tên chứa 'topping' hoặc 'thêm'
  const isMulti =
    option.name.toLowerCase().includes("topping") ||
    option.name.toLowerCase().includes("thêm");

  if (isMulti) {
    // Render danh sách checkbox
    return (
      <div className={styles.optionBlock}>
        <div className={styles.optionTitle}>{option.name}</div>
        <div className={styles.multiOptions}>
          {values.map((val) => (
            <label key={val.id} className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={selected?.includes(val.value) || false}
                onChange={() => onChange(option.id, val.value, true)}
              />
              <span>
                {val.value} (+{val.price.toLocaleString()}₫)
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Render dropdown
  return (
    <div className={styles.optionBlock}>
      <div className={styles.optionTitle}>{option.name}</div>
      <select
        className={styles.select}
        value={selected || ""}
        onChange={(e) => onChange(option.id, e.target.value, false)}
      >
        <option value="">-- Chọn {option.name.toLowerCase()} --</option>
        {values.map((val) => (
          <option key={val.id} value={val.value}>
            {val.value}{" "}
            {val.price > 0 ? `(+${val.price.toLocaleString()}₫)` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
