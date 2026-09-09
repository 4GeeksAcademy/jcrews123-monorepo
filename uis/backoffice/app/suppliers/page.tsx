import { SuppliersHeader } from "@/components/layout/AppShell";
import { SupplierDirectoryPanel } from "@/components/suppliers/SupplierDirectoryPanel";

export default function SuppliersPage() {
  return (
    <>
      <SuppliersHeader />
      <main className="flex-1 px-8 py-8">
        <SupplierDirectoryPanel />
      </main>
    </>
  );
}
