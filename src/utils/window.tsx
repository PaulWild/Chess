import { useEffect } from "react";

export const useOnWindowResize = (action: Function) => {
  useEffect(() => {
    const handleResize = () => {
      action();
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [action]);
};
