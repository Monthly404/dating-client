import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { Container } from "./common/Container";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <Container className="footer-content">
        <div className="footer-brand-section">
          <p className="footer-brand">소개팅.zip</p>
          <p className="footer-text">© 2026 소개팅.zip. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <Link to="/about">서비스 소개</Link>
          <Link to="/terms">이용약관</Link>
          <Link to="/privacy">개인정보처리방침</Link>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
