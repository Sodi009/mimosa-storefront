import { loginAction } from "../actions";

export default async function AdminLoginPage({ searchParams }) {
  const sp = await searchParams;
  const hasError = sp?.error === "1";

  return (
    <main className="wrap admin-login-wrap">
      <form action={loginAction} className="admin-login-form">
        <h1>Admin login</h1>
        <p className="admin-login-sub">Mimosa BKK Collection</p>
        {hasError && <p className="admin-login-error">Wrong password. Try again.</p>}
        <label className="admin-field">
          <span>Password</span>
          <input type="password" name="password" required autoFocus />
        </label>
        <button type="submit" className="btn-primary">Log in</button>
      </form>
    </main>
  );
}
