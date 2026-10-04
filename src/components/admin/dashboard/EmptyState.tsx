export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="border border-[#2e2a26] bg-[#1a1816] px-6 py-14 text-center">
      <h3 className="font-serif text-2xl text-[#f8f3f1]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#cfc7bb]">
        {message}
      </p>
    </div>
  );
}