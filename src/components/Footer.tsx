import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { Container } from "./common/Container";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <Container>
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              소개팅.zip
            </Link>
            <p className="footer-copyright">
              © 2026 소개팅.zip. All rights reserved.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/about">서비스 소개</Link>
            <Link to="/terms">이용약관</Link>
            <Link to="/privacy">개인정보처리방침</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
