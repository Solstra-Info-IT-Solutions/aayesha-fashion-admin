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
          ? "bg-white/10 text-white before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-[#a5b4fc]"
          : "text-[#c3c9d6] hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      <Icon
        size={17}
        strokeWidth={1.6}
        className={active ? "text-white" : "text-[#9aa2b2] group-hover:text-white"}
      />

      <span className="truncate">{label}</span>
    </Link>
  );
}
