import NavbarLoggedIn from "./NavBarLoggedIn";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <NavbarLoggedIn />
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
