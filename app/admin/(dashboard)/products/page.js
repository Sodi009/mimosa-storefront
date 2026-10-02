import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return <p>Could not load products: {error.message}</p>;
  }

  return (
    <div>
      <div className="admin-page-head">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
      </div>

      {products.length === 0 && <p className="admin-empty">No products yet. Add your first one.</p>}

      {products.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const variants = p.product_variants || [];
              const inStock = variants.some((v) => v.stock > 0);
              const thumb = p.images?.[0]?.url;
              return (
                <tr key={p.id}>
                  <td className="admin-table-thumb">
                    {thumb && <img src={thumb} alt="" />}
                  </td>
                  <td>{p.title}</td>
                  <td className="admin-table-muted">{p.category}</td>
                  <td className={inStock ? "" : "admin-stock-zero"}>{inStock ? "In stock" : "Sold out"}</td>
                  <td className="admin-table-actions">
                    <Link href={`/admin/products/${p.id}/edit`}>Edit</Link>
                    <DeleteProductButton id={p.id} title={p.title} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
