import { EditCandidatePage } from "@/components/forms/EditCandidatePage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <EditCandidatePage candidateId={id} />;
}
