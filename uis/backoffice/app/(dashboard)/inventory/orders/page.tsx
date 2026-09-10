import { OrdersHistoryHeader } from "@/components/layout/AppShell";
import { OrdersHistoryPanel } from "@/components/inventory/OrdersHistoryPanel";

export default function InventoryOrdersPage() {
  return (
    <>
      <OrdersHistoryHeader />
      <main className="flex-1 px-8 py-8">
        <OrdersHistoryPanel />
      </main>
    </>
  );
}
