// src/hooks/useDebounce.jsx
import { useState, useEffect } from "react";

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Đặt hẹn giờ để cập nhật giá trị sau 'delay' ms
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Hủy hẹn giờ nếu value thay đổi (tránh gọi khi đang gõ)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Chỉ chạy lại nếu value hoặc delay thay đổi

  return debouncedValue;
}
