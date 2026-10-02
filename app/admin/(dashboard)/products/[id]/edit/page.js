import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import ProductForm from "../../ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const { data: product, error } = await supabaseAdmin
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) notFound();

  return (
    <div>
      <div className="admin-page-head">
        <h1>Edit product</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
