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
          ? "bg-[#26221d] text-[#fffdf8] shadow-[0_6px_14px_-8px_rgba(38,34,29,0.7)]"
          : "text-[#4a443a] hover:bg-[#ebe3d0] hover:text-[#26221d]",
      ].join(" ")}
    >
      <Icon
        size={17}
        strokeWidth={1.6}
        className={active ? "text-[#d9c7a0]" : "text-[#8a8275] group-hover:text-[#26221d]"}
      />

      <span className="truncate">{label}</span>

      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#d9c7a0]" /> : null}
    </Link>
  );
}
