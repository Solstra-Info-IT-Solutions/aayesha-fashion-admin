/* =========================================================
   HOMEPAGE HERO
========================================================= */

export interface HomepageHeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  mobileImage: string;
  href: string;
  buttonLabel: string;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
}

export interface HomepageHero {
  enabled: boolean;
  slides: HomepageHeroSlide[];
}

/* =========================================================
   HOMEPAGE BRAND STORY
========================================================= */

export interface HomepageBrandStory {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  buttonLabel: string;
  href: string;
}

/* =========================================================
   HOMEPAGE WHY CHOOSE US
========================================================= */

export interface HomepageWhyChooseUs {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    sortOrder: number;
    isActive: boolean;
  }>;
}

/* =========================================================
   HOMEPAGE TESTIMONIALS
========================================================= */

export interface HomepageTestimonials {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  items: Array<{
    id: string;
    name: string;
    role?: string;
    quote: string;
    image?: string;
    rating?: number;
    sortOrder: number;
    isActive: boolean;
  }>;
}

/* =========================================================
   HOMEPAGE NEWSLETTER
========================================================= */

export interface HomepageNewsletter {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  placeholder: string;
}

/* =========================================================
   HOMEPAGE INSTAGRAM
========================================================= */

export interface HomepageInstagram {
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
  username: string;
  href: string;
  images: Array<{
    id: string;
    image: string;
    alt: string;
    href?: string;
    sortOrder: number;
    isActive: boolean;
  }>;
}