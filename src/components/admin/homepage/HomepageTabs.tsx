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
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition",
                active
                  ? "border-[#26221d] bg-[#26221d] text-[#fffdf8]"
                  : "border-[#d6ccb6] bg-[#fffdf8] text-[#5f584d] hover:bg-[#f1ead9]",
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