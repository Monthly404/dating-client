import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { Container } from "./common/Container";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <Container className="footer-content">
        <Link to="/" className="logo" style={{ fontSize: "1.2rem" }}>
          소개팅 각
        </Link>
        <div className="footer-links">
          <Link to="/about">서비스 소개</Link>
          <Link to="/terms">이용약관</Link>
          <Link to="/privacy">개인정보처리방침</Link>
        </div>
        <div className="copyright">© 2025 Monthly404. All rights reserved.</div>
      </Container>
    </footer>
  );
};

export default Footer;
