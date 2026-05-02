import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Get the current URL path
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the path changes, scroll to the absolute top of the page
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't actually render any HTML, so we return null
  return null;
}

export default ScrollToTop;