import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "소개팅.zip",
  description = "서울 지역 오프라인 소개팅 이벤트를 한눈에! 조건별 필터로 맞춤 모임을 찾아보세요. 소개팅.zip",
  image = "/og-image.png",
  url = window.location.href,
}) => {
  const fullTitle = title === "소개팅.zip" ? title : `${title} | 소개팅.zip`;

  useEffect(() => {
    // Update Title
    document.title = fullTitle;

    // Update Meta Tags
    const updateMeta = (
      attrName: string,
      attrValue: string,
      content: string
    ) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard
    updateMeta("name", "description", description);

    // Open Graph
    updateMeta("property", "og:type", "website");
    updateMeta("property", "og:url", url);
    updateMeta("property", "og:title", fullTitle);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:image", image);

    // Twitter
    updateMeta("property", "twitter:card", "summary_large_image");
    updateMeta("property", "twitter:url", url);
    updateMeta("property", "twitter:title", fullTitle);
    updateMeta("property", "twitter:description", description);
    updateMeta("property", "twitter:image", image);
  }, [fullTitle, description, image, url]);

  return null;
};

export default SEO;
