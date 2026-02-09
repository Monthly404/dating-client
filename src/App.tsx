import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MainView from "./components/MainView";
import DetailView from "./components/DetailView";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GoogleAnalytics from "./components/common/GoogleAnalytics";

function App() {
  return (
    <BrowserRouter>
      <GoogleAnalytics />
      <div className="app-container">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MainView />} />
            <Route path="/meeting/:id" element={<DetailView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
