import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    document.title = `${title} || EcoSync`;
  }, [title]);
};
export default useTitle;
