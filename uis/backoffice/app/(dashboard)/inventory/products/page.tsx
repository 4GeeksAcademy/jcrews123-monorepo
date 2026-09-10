import { InventoryProductsHeader } from "@/components/layout/AppShell";
import { InventoryProductsPanel } from "@/components/inventory/InventoryProductsPanel";

export default function InventoryProductsPage() {
  return (
    <>
      <InventoryProductsHeader />
      <main className="flex-1 px-8 py-8">
        <InventoryProductsPanel />
      </main>
    </>
  );
}
