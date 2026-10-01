import { SidebarContent } from "./SidebarContent";

export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] bg-[#3f2d2a] lg:block">
      <SidebarContent />
    </aside>
  );
}
