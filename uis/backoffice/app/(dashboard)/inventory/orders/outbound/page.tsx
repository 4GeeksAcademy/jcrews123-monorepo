import { Suspense } from "react";

import { OutboundOrderHeader } from "@/components/layout/AppShell";
import { OutboundOrderForm } from "@/components/inventory/OutboundOrderForm";

export default function OutboundOrderPage() {
  return (
    <>
      <OutboundOrderHeader />
      <main className="flex-1 px-8 py-8">
        <Suspense fallback={<p className="text-sm text-slate-600">Loading form…</p>}>
          <OutboundOrderForm />
        </Suspense>
      </main>
    </>
  );
}
