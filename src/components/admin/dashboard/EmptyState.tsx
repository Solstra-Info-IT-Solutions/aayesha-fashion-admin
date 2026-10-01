export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="border border-[#e5e7ec] bg-[#ffffff] px-6 py-14 text-center">
      <h3 className="font-serif text-2xl text-[#0f172a]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5b6270]">
        {message}
      </p>
    </div>
  );
}