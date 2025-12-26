import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
        <p className="copyright">© 2025 Monthly404. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
