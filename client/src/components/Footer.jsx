import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">Hynk</span>
          <p>A clean space to write, share, and discover stories.</p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/register">Get Started</Link>
        </div>

        <p className="footer-copy">© {new Date().getFullYear()} Hynk. All rights reserved.</p>
      </div>
    </footer>
  );
}
