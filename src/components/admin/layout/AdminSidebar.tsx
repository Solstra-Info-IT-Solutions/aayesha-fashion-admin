import { SidebarContent } from "./SidebarContent";

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] sidebar-surface lg:block">
      <SidebarContent />
    </aside>
  );
}
