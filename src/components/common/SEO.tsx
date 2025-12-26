import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "소개팅 각",
  description = "내가 원하는 소개팅을, 늦지 않게 발견하세요. 프리미엄 오프라인 소개팅 큐레이션 플랫폼",
  image = "/og-image.png",
  url = window.location.href,
}) => {
  const fullTitle = title === "소개팅 각" ? title : `${title} | 소개팅 각`;

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
