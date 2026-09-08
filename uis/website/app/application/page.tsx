import { BrasaPointsForm } from "@/components/forms/BrasaPointsForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Brasa Points | Brasaland Loyalty Program",
  description:
    "Register for Brasa Points digital loyalty. Earn points at any of our 14 Brasaland locations.",
};

export default function ApplicationPage() {
  return (
    <main id="main" className="py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <BrasaPointsForm />
      </div>
    </main>
  );
}
