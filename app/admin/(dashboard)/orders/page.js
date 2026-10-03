import { supabaseAdmin } from "@/lib/supabase-admin";
import OrdersTable from "./OrdersTable";

// Orders can be written by checkout (a public Server Action with no
// revalidatePath call back to this page) as well as by the admin actions on
// this page itself, so this page can't rely on on-demand revalidation alone
// to know when to refresh — it needs to read fresh data on every visit.
export const dynamic = "force-dynamic";

function orderNumber(orderNo) {
  const m = (orderNo || "").match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : 0;
}

export default async function AdminOrdersPage() {
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <div className="admin-page-head">
          <h1>Orders</h1>
        </div>
        <p className="admin-empty">Could not load orders: {error.message}</p>
      </div>
    );
  }

  const sorted = [...orders].sort((a, b) => orderNumber(b.order_no) - orderNumber(a.order_no));

  return (
    <div>
      <div className="admin-page-head">
        <h1>Orders</h1>
      </div>
      <OrdersTable orders={sorted} />
    </div>
  );
}
