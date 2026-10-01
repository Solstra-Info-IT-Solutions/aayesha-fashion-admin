import Link from "next/link";

import type { NavItem } from "./nav-config";

type SidebarNavItemProps = NavItem & {
  active: boolean;
  onNavigate?: () => void;
};

export function SidebarNavItem({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex items-center gap-3 px-3 py-2.5 text-[13px] tracking-[0.01em] transition-colors",
        active
          ? "bg-[#7a5650] text-white"
          : "text-[#d8cec5] hover:bg-[#fbf9f5]/10 hover:text-white",
      ].join(" ")}
    >
      <Icon
        size={17}
        strokeWidth={1.6}
        className={active ? "text-white" : "text-[#b9aaa1] group-hover:text-white"}
      />

      <span className="truncate">{label}</span>
    </Link>
  );
}
