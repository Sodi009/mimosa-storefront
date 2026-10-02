import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="admin-page-head">
        <h1>Add product</h1>
      </div>
      <ProductForm product={null} />
    </div>
  );
}
