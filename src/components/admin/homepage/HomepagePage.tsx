"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { ReactElement } from "react";

import { useAdminAuth } from "@/hooks/useAdminAuth";

import {
  getHomepageBrandStory,
  getHomepageHero,
  getHomepageInstagram,
  getHomepageNewsletter,
  getHomepageTestimonials,
  getHomepageWhyChooseUs,
  HOMEPAGE_SETTING_KEYS,
  updateHomepageSetting,
  type HomepageSettingKey,
} from "@/services/homepage.service";

import type {
  HomepageBrandStory,
  HomepageHero,
  HomepageInstagram,
  HomepageNewsletter,
  HomepageTestimonials,
  HomepageWhyChooseUs,
} from "@/types/homepage";

import { HomepageHeader } from "./HomepageHeader";
import { HomepageTabs } from "./HomepageTabs";

import { HeroSectionEditor } from "./HeroSectionEditor";
import { BrandStorySectionEditor } from "./BrandStorySectionEditor";
import { WhyChooseUsSectionEditor } from "./WhyChooseUsSectionEditor";
import { TestimonialsSectionEditor } from "./TestimonialsSectionEditor";
import { InstagramSectionEditor } from "./InstagramSectionEditor";
import { NewsletterSectionEditor } from "./NewsletterSectionEditor";

/* =========================================================
   HOMEPAGE TAB
========================================================= */

type HomepageTab =
  | "hero"
  | "brand-story"
  | "why-choose-us"
  | "testimonials"
  | "instagram"
  | "newsletter";

/* =========================================================
   HOMEPAGE STATE
========================================================= */

interface HomepageState {
  hero: HomepageHero | null;
  brandStory: HomepageBrandStory | null;
  whyChooseUs: HomepageWhyChooseUs | null;
  testimonials: HomepageTestimonials | null;
  instagram: HomepageInstagram | null;
  newsletter: HomepageNewsletter | null;
}

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: HomepageState = {
  hero: null,
  brandStory: null,
  whyChooseUs: null,
  testimonials: null,
  instagram: null,
  newsletter: null,
};

/* =========================================================
   PAGE
========================================================= */

export function HomepagePage(): ReactElement {
  const { accessToken } = useAdminAuth();

  const [activeTab, setActiveTab] =
    useState<HomepageTab>("hero");

  const [homepage, setHomepage] =
    useState<HomepageState>(initialState);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     LOAD HOMEPAGE
  ======================================================= */

  const loadHomepage = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [
        hero,
        brandStory,
        whyChooseUs,
        testimonials,
        instagram,
        newsletter,
      ] = await Promise.all([
        getHomepageHero(accessToken),
        getHomepageBrandStory(accessToken),
        getHomepageWhyChooseUs(accessToken),
        getHomepageTestimonials(accessToken),
        getHomepageInstagram(accessToken),
        getHomepageNewsletter(accessToken),
      ]);

      setHomepage({
        hero: hero.value,
        brandStory: brandStory.value,
        whyChooseUs: whyChooseUs.value,
        testimonials: testimonials.value,
        instagram: instagram.value,
        newsletter: newsletter.value,
      });
    } catch (err) {
      console.error(
        "Failed to load homepage settings:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load homepage settings.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    void loadHomepage();
  }, [loadHomepage]);

  /* =======================================================
     UPDATE HOMEPAGE SECTION
  ======================================================= */

  async function handleHomepageUpdate(
    tab: HomepageTab,
    value: unknown,
  ): Promise<void> {
    if (!accessToken) {
      throw new Error(
        "Authentication required.",
      );
    }

    const settingKey =
      tabSettingKey(tab);

    const stateKey =
      tabStateKey(tab);

    const updated =
      await updateHomepageSetting(
        accessToken,
        settingKey,
        value,
      );

    setHomepage((current) => ({
      ...current,
      [stateKey]: updated.value,
    }));
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-full bg-[#111111] rounded-lg">
      {/* ===================================================
          HEADER
      =================================================== */}

      <HomepageHeader
        onRefresh={loadHomepage}
        refreshing={loading}
      />

      {/* ===================================================
          MAIN
      =================================================== */}

      <div className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* =================================================
            TABS
        ================================================= */}

        <HomepageTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* =================================================
            CONTENT
        ================================================= */}

        {error ? (
          <div className="mt-6 border border-[#5a2a27] bg-[#2b1a18] px-5 py-4 rounded-[14px]">
            <p className="text-sm text-[#f0a39d]">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadHomepage()
              }
              className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[#f0a39d] underline underline-offset-4"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <HomepageLoading />
        ) : (
          <HomepageTabContent
            activeTab={activeTab}
            homepage={homepage}
            onHomepageUpdate={
              handleHomepageUpdate
            }
          />
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function HomepageLoading(): ReactElement {
  return (
    <div className="mt-6 flex min-h-[420px] items-center justify-center border border-[#2e2a26] bg-[#1a1816] rounded-lg">
      <div className="flex items-center gap-3 text-[#cfc7bb]">
        <Loader2
          size={18}
          className="animate-spin"
        />

        <span className="text-sm">
          Loading homepage settings...
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   TAB CONTENT PROPS
========================================================= */

interface HomepageTabContentProps {
  activeTab: HomepageTab;
  homepage: HomepageState;
  onHomepageUpdate: (
    tab: HomepageTab,
    value: unknown,
  ) => Promise<void>;
}

/* =========================================================
   TAB CONTENT
========================================================= */

function HomepageTabContent({
  activeTab,
  homepage,
  onHomepageUpdate,
}: HomepageTabContentProps): ReactElement {
  const labels: Record<
    HomepageTab,
    string
  > = {
    hero: "Hero",
    "brand-story": "Brand Story",
    "why-choose-us": "Why Ayesha",
    testimonials: "Testimonials",
    instagram: "Instagram",
    newsletter: "Newsletter",
  };

  const currentData =
    homepage[tabStateKey(activeTab)];

  return (
    <section className="mt-6">
      <div className="border border-[#2e2a26] bg-[#1a1816] rounded-lg">
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="border-b border-[#2e2a26] px-6 py-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#9a9185]">
            Homepage / {labels[activeTab]}
          </p>

          <h2 className="mt-1 font-serif text-2xl text-[#f8f3f1]">
            {labels[activeTab]}
          </h2>
        </div>

        {/* =================================================
            SECTION EDITOR
        ================================================= */}

        <div className="p-6">
          {/* =================================================
              HERO
          ================================================= */}

          {activeTab === "hero" ? (
            homepage.hero ? (
              <HeroSectionEditor
                data={homepage.hero}
                onSave={(data) =>
                  onHomepageUpdate(
                    "hero",
                    data,
                  )
                }
              />
            ) : (
              <HomepageNotConfigured
                title="Hero"
              />
            )

          /* =================================================
             BRAND STORY
          ================================================= */

          ) : activeTab === "brand-story" ? (
            homepage.brandStory ? (
              <BrandStorySectionEditor
                data={
                  homepage.brandStory
                }
                onSave={(data) =>
                  onHomepageUpdate(
                    "brand-story",
                    data,
                  )
                }
              />
            ) : (
              <HomepageNotConfigured
                title="Brand Story"
              />
            )

          /* =================================================
             WHY AYESHA
          ================================================= */

          ) : activeTab ===
            "why-choose-us" ? (
            homepage.whyChooseUs ? (
              <WhyChooseUsSectionEditor
                data={
                  homepage.whyChooseUs
                }
                onSave={(data) =>
                  onHomepageUpdate(
                    "why-choose-us",
                    data,
                  )
                }
              />
            ) : (
              <HomepageNotConfigured
                title="Why Ayesha"
              />
            )

          /* =================================================
             TESTIMONIALS
          ================================================= */

          ) : activeTab ===
            "testimonials" ? (
            homepage.testimonials ? (
              <TestimonialsSectionEditor
                data={
                  homepage.testimonials
                }
                onSave={(data) =>
                  onHomepageUpdate(
                    "testimonials",
                    data,
                  )
                }
              />
            ) : (
              <HomepageNotConfigured
                title="Testimonials"
              />
            )

          /* =================================================
             INSTAGRAM
          ================================================= */

          ) : activeTab ===
            "instagram" ? (
            homepage.instagram ? (
              <InstagramSectionEditor
                data={
                  homepage.instagram
                }
                onSave={(data) =>
                  onHomepageUpdate(
                    "instagram",
                    data,
                  )
                }
              />
            ) : (
              <HomepageNotConfigured
                title="Instagram"
              />
            )

          /* =================================================
             NEWSLETTER
          ================================================= */

          ) : activeTab ===
            "newsletter" ? (
            homepage.newsletter ? (
              <NewsletterSectionEditor
                data={
                  homepage.newsletter
                }
                onSave={(data) =>
                  onHomepageUpdate(
                    "newsletter",
                    data,
                  )
                }
              />
            ) : (
              <HomepageNotConfigured
                title="Newsletter"
              />
            )

          /* =================================================
             FALLBACK
          ================================================= */

          ) : (
            <HomepagePlaceholder
              title={labels[activeTab]}
              data={currentData}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   STATE KEY
========================================================= */

function tabStateKey(
  tab: HomepageTab,
): keyof HomepageState {
  switch (tab) {
    case "hero":
      return "hero";

    case "brand-story":
      return "brandStory";

    case "why-choose-us":
      return "whyChooseUs";

    case "testimonials":
      return "testimonials";

    case "instagram":
      return "instagram";

    case "newsletter":
      return "newsletter";
  }
}

/* =========================================================
   API SETTING KEY
========================================================= */

function tabSettingKey(
  tab: HomepageTab,
): HomepageSettingKey {
  switch (tab) {
    case "hero":
      return HOMEPAGE_SETTING_KEYS.hero;

    case "brand-story":
      return HOMEPAGE_SETTING_KEYS.brandStory;

    case "why-choose-us":
      return HOMEPAGE_SETTING_KEYS.whyChooseUs;

    case "testimonials":
      return HOMEPAGE_SETTING_KEYS.testimonials;

    case "instagram":
      return HOMEPAGE_SETTING_KEYS.instagram;

    case "newsletter":
      return HOMEPAGE_SETTING_KEYS.newsletter;
  }
}

/* =========================================================
   PLACEHOLDER
========================================================= */

interface HomepagePlaceholderProps {
  title: string;
  data: unknown;
}

function HomepagePlaceholder({
  title,
  data,
}: HomepagePlaceholderProps): ReactElement {
  return (
    <div className="border border-dashed border-[#3a352f] bg-[#111111] px-6 py-10 rounded-[14px]">
      <p className="text-sm font-medium text-[#f8f3f1]">
        {title} editor
      </p>

      <p className="mt-1 text-sm text-[#cfc7bb]">
        CMS data loaded successfully.
        Editor controls will be added
        in the next step.
      </p>

      <div className="mt-5 rounded border border-[#2e2a26] bg-[#1a1816] p-4">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#9a9185]">
          Current status
        </p>

        <p className="mt-2 text-sm text-[#f8f3f1]">
          {data
            ? "Configured"
            : "Not configured"}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   NOT CONFIGURED
========================================================= */

function HomepageNotConfigured({
  title,
}: {
  title: string;
}): ReactElement {
  return (
    <div className="border border-dashed border-[#3a352f] bg-[#111111] px-6 py-12 text-center rounded-[14px]">
      <p className="text-sm font-medium text-[#f8f3f1]">
        {title} is not configured
      </p>

      <p className="mt-1 text-xs text-[#cfc7bb]">
        Create the homepage configuration
        before editing this section.
      </p>
    </div>
  );
}