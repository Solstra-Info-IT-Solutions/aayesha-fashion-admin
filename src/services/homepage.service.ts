import {
  getSetting,
  upsertSetting,
  updateSettingPublic,
} from "@/services/settings.service";

import type { StoreSetting } from "@/types/settings";

import type {
  HomepageBrandStory,
  HomepageHero,
  HomepageInstagram,
  HomepageNewsletter,
  HomepageTestimonials,
  HomepageWhyChooseUs,
} from "@/types/homepage";

/* =========================================================
   HOMEPAGE SETTING KEYS
========================================================= */

export const HOMEPAGE_SETTING_KEYS = {
  hero: "homepage.hero",
  brandStory: "homepage.brand_story",
  whyChooseUs: "homepage.why_choose_us",
  testimonials: "homepage.testimonials",
  newsletter: "homepage.newsletter",
  instagram: "homepage.instagram",
} as const;

/* =========================================================
   HOMEPAGE SETTING KEY TYPE
========================================================= */

export type HomepageSettingKey =
  (typeof HOMEPAGE_SETTING_KEYS)[keyof typeof HOMEPAGE_SETTING_KEYS];

/* =========================================================
   GET HOMEPAGE SETTING
========================================================= */

async function getHomepageSetting<T>(
  accessToken: string,
  key: HomepageSettingKey,
): Promise<StoreSetting<T>> {
  return getSetting(
    accessToken,
    key,
  ) as Promise<StoreSetting<T>>;
}

/* =========================================================
   GET HERO
========================================================= */

export async function getHomepageHero(
  accessToken: string,
): Promise<StoreSetting<HomepageHero>> {
  return getHomepageSetting<HomepageHero>(
    accessToken,
    HOMEPAGE_SETTING_KEYS.hero,
  );
}

/* =========================================================
   GET BRAND STORY
========================================================= */

export async function getHomepageBrandStory(
  accessToken: string,
): Promise<StoreSetting<HomepageBrandStory>> {
  return getHomepageSetting<HomepageBrandStory>(
    accessToken,
    HOMEPAGE_SETTING_KEYS.brandStory,
  );
}

/* =========================================================
   GET WHY CHOOSE US
========================================================= */

export async function getHomepageWhyChooseUs(
  accessToken: string,
): Promise<StoreSetting<HomepageWhyChooseUs>> {
  return getHomepageSetting<HomepageWhyChooseUs>(
    accessToken,
    HOMEPAGE_SETTING_KEYS.whyChooseUs,
  );
}

/* =========================================================
   GET TESTIMONIALS
========================================================= */

export async function getHomepageTestimonials(
  accessToken: string,
): Promise<StoreSetting<HomepageTestimonials>> {
  return getHomepageSetting<HomepageTestimonials>(
    accessToken,
    HOMEPAGE_SETTING_KEYS.testimonials,
  );
}

/* =========================================================
   GET NEWSLETTER
========================================================= */

export async function getHomepageNewsletter(
  accessToken: string,
): Promise<StoreSetting<HomepageNewsletter>> {
  return getHomepageSetting<HomepageNewsletter>(
    accessToken,
    HOMEPAGE_SETTING_KEYS.newsletter,
  );
}

/* =========================================================
   GET INSTAGRAM
========================================================= */

export async function getHomepageInstagram(
  accessToken: string,
): Promise<StoreSetting<HomepageInstagram>> {
  return getHomepageSetting<HomepageInstagram>(
    accessToken,
    HOMEPAGE_SETTING_KEYS.instagram,
  );
}

/* =========================================================
   UPDATE HOMEPAGE SETTING
========================================================= */

export async function updateHomepageSetting<T>(
  accessToken: string,
  key: HomepageSettingKey,
  value: T,
  group = "homepage",
): Promise<StoreSetting<T>> {
  return upsertSetting(
    accessToken,
    {
      key,
      value,
      group,
      isPublic: true,
    },
  ) as Promise<StoreSetting<T>>;
}

/* =========================================================
   UPDATE PUBLIC STATUS
========================================================= */

export async function updateHomepagePublicStatus(
  accessToken: string,
  key: HomepageSettingKey,
  isPublic: boolean,
): Promise<StoreSetting> {
  return updateSettingPublic(
    accessToken,
    key,
    {
      isPublic,
    },
  );
}