import { NavLink, useNavigate } from "react-router-dom";
import "./NavbarLoggedIn.css";
import { useAuth } from "../context/AuthContext";

export default function NavbarLoggedIn() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/home", { replace: true });
  };
  return (
    <>
      <h3 className="sidebar-title">CreativAI</h3>
      <nav className="nav flex-column">
        <NavLink to="/dashboard" className="nav-link">
          Dashboard
        </NavLink>
        <NavLink to="/gallery" className="nav-link">
          Galerie
        </NavLink>
        <NavLink to="/generate" className="nav-link">
          Generează
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profil
        </NavLink>
        <button
          onClick={handleLogout}
          className="nav-link btn btn-link text-start"
          style={{ color: "#adb5bd", padding: "0.4rem 0.6rem" }}
        >
          Logout
        </button>
      </nav>
    </>
  );
}
