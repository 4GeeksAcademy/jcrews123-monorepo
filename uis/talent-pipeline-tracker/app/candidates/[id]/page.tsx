import { CandidateDetailPage } from "@/components/detail/CandidateDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <CandidateDetailPage candidateId={id} />;
}
