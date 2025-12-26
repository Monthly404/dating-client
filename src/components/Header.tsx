import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="logo">소개팅 각</h1>
      </div>
    </header>
  );
};

export default Header;
