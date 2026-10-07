import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If the URL contains a hash such as #studies,
    // allow the browser to scroll to that section.
    if (hash) {
      const element = document.querySelector(hash);

      if (element) {
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });

        return;
      }
    }

    // Normal page navigation starts at the top.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, search, hash]);

  return null;
}
