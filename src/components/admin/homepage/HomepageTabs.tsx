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
                  ? "border-[#f8f3f1] bg-[#b79a6a] text-[#1a1816]"
                  : "border-[#3a352f] bg-[#1a1816] text-[#cfc7bb] hover:bg-[#2a241b]",
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