import React, { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  jsonLd?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({
  title = "소개팅.zip",
  description = "소개팅의 모든 것을 한곳에! 오프라인 모임부터 온라인 매칭, 결혼정보회사까지. 조건별 필터로 나에게 맞는 소개팅을 찾아보세요.",
  image = "/og-image.png",
  url = window.location.href,
  jsonLd,
}) => {
  const fullTitle = title === "소개팅.zip" ? title : `${title} | 소개팅.zip`;

  useEffect(() => {
    document.title = fullTitle;

    const updateMeta = (
      attrName: string,
      attrValue: string,
      content: string,
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

    // Canonical
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Open Graph
    updateMeta("property", "og:type", "website");
    updateMeta("property", "og:url", url);
    updateMeta("property", "og:title", fullTitle);
    updateMeta("property", "og:description", description);
    updateMeta("property", "og:image", image);
    updateMeta("property", "og:locale", "ko_KR");
    updateMeta("property", "og:site_name", "소개팅.zip");

    // Twitter
    updateMeta("name", "twitter:card", "summary_large_image");
    updateMeta("name", "twitter:url", url);
    updateMeta("name", "twitter:title", fullTitle);
    updateMeta("name", "twitter:description", description);
    updateMeta("name", "twitter:image", image);

    // JSON-LD
    const existingLd = document.querySelector('script[data-seo="json-ld"]');
    if (existingLd) existingLd.remove();

    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "json-ld");
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const ldScript = document.querySelector('script[data-seo="json-ld"]');
      if (ldScript) ldScript.remove();
    };
  }, [fullTitle, description, image, url, jsonLd]);

  return null;
};

export default SEO;
