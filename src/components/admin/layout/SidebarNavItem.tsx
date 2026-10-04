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
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium tracking-[0.01em] transition-colors",
        active
          ? "bg-[#b79a6a] text-[#1a1816] shadow-[0_6px_14px_-8px_rgba(0,0,0,0.7)]"
          : "text-[#9a9185] hover:bg-[#2a241b] hover:text-[#f8f3f1]",
      ].join(" ")}
    >
      <Icon
        size={17}
        strokeWidth={1.6}
        className={active ? "text-[#5a4a2a]" : "text-[#9a9185] group-hover:text-[#f8f3f1]"}
      />

      <span className="truncate">{label}</span>

      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5a4a2a]" /> : null}
    </Link>
  );
}
