import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

/** Google Analytics 초기화 및 페이지 뷰 추적 컴포넌트 */
const GoogleAnalytics = () => {
  const location = useLocation();
  const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;

  useEffect(() => {
    if (TRACKING_ID) {
      // GA4 초기화
      ReactGA.initialize(TRACKING_ID);
    }
  }, [TRACKING_ID]);

  useEffect(() => {
    if (TRACKING_ID) {
      // 페이지 변경 시 페이지 뷰 전송
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [location, TRACKING_ID]);

  return null;
};

export default GoogleAnalytics;
