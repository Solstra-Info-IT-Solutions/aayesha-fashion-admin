import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type SidebarNavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  pathname: string;
};

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  pathname,
}: SidebarNavItemProps) {
  const active =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={[
        "group flex items-center gap-3 px-3 py-2.5 text-sm transition",
        active
          ? "bg-[#292c2c] text-white"
          : "text-[#c8c4c0] hover:bg-[#232424] hover:text-white",
      ].join(" ")}
    >
      <Icon
        size={17}
        strokeWidth={1.7}
        className={
          active
            ? "text-[#efa7ae]"
            : "text-[#969696] group-hover:text-[#c8c4c0]"
        }
      />

      <span>{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#efa7ae]" />
      )}
    </Link>
  );
}