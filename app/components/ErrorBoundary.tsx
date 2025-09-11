interface ErrorBoundaryProps {
  error?: Error;
  title?: string;
  message?: string;
}

export function ErrorBoundary({
  error,
  title = "An error occurred.",
  message,
}: ErrorBoundaryProps) {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : "An unexpected error occurred");

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 font-sans">
      <h1 className="text-2xl font-bold text-red-800 mb-4">{title}</h1>
      <p className="text-red-700 mb-6">{errorMessage}</p>
    </div>
  );
}
