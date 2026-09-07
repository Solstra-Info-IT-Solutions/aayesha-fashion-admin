export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="border border-[#e7e2dd] bg-white px-6 py-14 text-center">
      <h3 className="font-serif text-2xl text-[#171717]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f706f]">
        {message}
      </p>
    </div>
  );
}