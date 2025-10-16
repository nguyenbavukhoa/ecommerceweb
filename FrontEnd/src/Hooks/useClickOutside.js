import { useEffect } from 'react';

export const useClickOutside = (ref, contentRef, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (
        !ref.current || 
        !contentRef.current ||
        contentRef.current.contains(event.target)
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, contentRef, handler]);
};