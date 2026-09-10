import { Suspense } from "react";

import { InboundOrderHeader } from "@/components/layout/AppShell";
import { InboundOrderForm } from "@/components/inventory/InboundOrderForm";

export default function InboundOrderPage() {
  return (
    <>
      <InboundOrderHeader />
      <main className="flex-1 px-8 py-8">
        <Suspense fallback={<p className="text-sm text-slate-600">Loading form…</p>}>
          <InboundOrderForm />
        </Suspense>
      </main>
    </>
  );
}
