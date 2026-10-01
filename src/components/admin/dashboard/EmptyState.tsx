export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="border border-[#e6ddd4] bg-[#fbf9f5] px-6 py-14 text-center">
      <h3 className="font-serif text-2xl text-[#3f2d2a]">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#70635d]">
        {message}
      </p>
    </div>
  );
}