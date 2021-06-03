import { useEffect } from "react";

export function useHandleOnClickOutside({
  ref,
  isDisabled = false,
  onClick,
  disabledRefs = [],
}) {
  return useEffect(() => {
    if (isDisabled) return;

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (disabledRefs.length) {
          if (
            disabledRefs.some((disabledRef) => {
              if (
                disabledRef &&
                disabledRef.current &&
                disabledRef.current.contains(event.target)
              ) {
                return false;
              } else {
                return true;
              }
            })
          )
            onClick();

          return;
        } else {
          onClick();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [disabledRefs, isDisabled, onClick, ref]);
}
