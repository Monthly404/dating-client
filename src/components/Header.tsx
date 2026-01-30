import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { Container } from "./common/Container";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <Container className="header-inner">
        <Link to="/" className="text-logo-link">
          <img
            src="/text-logo.png"
            alt="소개팅.zip"
            className="text-logo-img"
          />
        </Link>
      </Container>
    </header>
  );
};

export default Header;
