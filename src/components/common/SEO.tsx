import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "소개팅 각",
  description = "내가 원하는 소개팅을, 늦지 않게 발견하세요. 프리미엄 오프라인 소개팅 큐레이션 플랫폼",
  image = "/og-image.png", // We might need a default OG image
  url = window.location.href,
}) => {
  const fullTitle = title === "소개팅 각" ? title : `${title} | 소개팅 각`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
