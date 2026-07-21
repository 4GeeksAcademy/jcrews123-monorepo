interface FormFeedbackProps {
  success?: string | null;
  error?: string | null;
}

export function FormFeedback({ success, error }: FormFeedbackProps) {
  if (!success && !error) return null;

  if (error) {
    return (
      <div
        className="rounded-lg border border-danger/20 bg-danger-bg px-3 py-2 text-sm text-danger"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-success/20 bg-success-bg px-3 py-2 text-sm text-success animate-fade-up"
      role="status"
    >
      {success}
    </div>
  );
}
