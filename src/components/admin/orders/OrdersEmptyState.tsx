export function OrdersEmptyState({
  filtered,
}: {
  filtered: boolean;
}) {
  return (
    <div className="border border-[#e7e2dd] bg-white px-6 py-16 text-center">
      <h2 className="font-serif text-2xl text-[#171717]">
        {filtered
          ? "No matching orders"
          : "No orders yet"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6f706f]">
        {filtered
          ? "Try changing the search or filters to find another order."
          : "Orders will appear here when customers place them."}
      </p>
    </div>
  );
}