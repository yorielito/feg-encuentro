export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  youtube?: string;
};

export type HomeContentData = {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;

  aboutTitle: string;
  aboutText: string;
  aboutImageUrl: string;

  prayerSectionTitle: string;
  prayerSectionText: string;
  prayerSectionImageUrl?: string;

  donationTitle: string;
  donationText: string;

  finalCtaTitle: string;
  finalCtaText: string;
};

export type SiteSettingsData = {
  id: string;
  churchName: string;
  logoUrl?: string;
  city: string;
  country: string;
  address?: string;
  phone?: string;
  email?: string;
  serviceTimes?: string[];
  socialLinks?: SocialLinks;
  homeContent: HomeContentData;
  updatedAt?: string;
};
