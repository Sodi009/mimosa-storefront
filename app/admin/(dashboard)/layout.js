import Link from "next/link";
import { logoutAction } from "../actions";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <Link href="/admin/products" className="admin-brand">MIMOSA admin</Link>
        <nav className="admin-nav">
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/" target="_blank">View site</Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="admin-logout-btn">Log out</button>
        </form>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
