import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  pathname: string;
}) {
  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 px-3 py-2.5 text-sm transition",
        active
          ? "bg-[#292c2c] text-white"
          : "text-[#c8c4c0] hover:bg-[#232424] hover:text-white",
      ].join(" ")}
    >
      <Icon
        size={17}
        strokeWidth={1.7}
      />

      <span>{label}</span>
    </Link>
  );
}