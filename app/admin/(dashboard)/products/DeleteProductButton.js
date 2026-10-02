"use client";

import { deleteProductAction } from "../../actions";

export default function DeleteProductButton({ id, title }) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="admin-delete-btn">Delete</button>
    </form>
  );
}
