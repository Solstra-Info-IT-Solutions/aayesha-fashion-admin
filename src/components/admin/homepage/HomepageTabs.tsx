"use client";

import {
  Camera,
  Heart,
  Image,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";

type HomepageTab =
  | "hero"
  | "brand-story"
  | "why-choose-us"
  | "testimonials"
  | "instagram"
  | "newsletter";

interface HomepageTabsProps {
  activeTab: HomepageTab;
  onChange: (tab: HomepageTab) => void;
}

const tabs: Array<{
  id: HomepageTab;
  label: string;
  icon: typeof Image;
}> = [
  {
    id: "hero",
    label: "Hero",
    icon: Image,
  },
  {
    id: "brand-story",
    label: "Brand Story",
    icon: Heart,
  },
  {
    id: "why-choose-us",
    label: "Why Ayesha",
    icon: Sparkles,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: MessageCircle,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Camera,
  },
  {
    id: "newsletter",
    label: "Newsletter",
    icon: Mail,
  },
];

export function HomepageTabs({
  activeTab,
  onChange,
}: HomepageTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-[#d3d7df]">
      <div className="flex min-w-max gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "relative flex items-center gap-2 px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] transition",
                active
                  ? "bg-[#4338ca] text-white"
                  : "text-[#5b6270] hover:bg-[#ffffff] hover:text-[#0f172a]",
              ].join(" ")}
            >
              <Icon size={15} strokeWidth={1.7} />

              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}