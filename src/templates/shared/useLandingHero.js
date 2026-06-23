import { useEffect, useRef, useState } from 'react';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { usePartnerAsset } from '../../utils/partnerMedia';
import { usePartnerSectionContent } from '../../utils/partnerSectionContent';
import { useMainSiteLandingHeroVideo } from '../../hooks/useMainSiteServiceHero';
import heroVideo from '../../assets/vid.mp4';

export const heroSlides = [
  {
    title: 'We Build Apps & Websites',
    description: 'Modern web and mobile products built for speed, growth, and measurable business outcomes.',
  },
  {
    title: 'We Handle Social Media Verification',
    description: 'Get trusted badges and monetization readiness across major platforms with guided execution.',
  },
  {
    title: 'We Deliver Media Publications',
    description: 'Publish your story on leading platforms in Nigeria, Africa, and international markets.',
  },
];

export const impactStats = [
  { value: 100, suffix: '+', label: 'Different Publication Platforms' },
  { value: 500, suffix: '+', label: 'Satisfied Customers' },
  { value: 250, suffix: '+', label: 'High-Impact Launches Delivered' },
];

export function useLandingHero() {
  const branding = usePartnerBranding();
  const {
    isPartnerSite,
    brandName,
    shortName,
    tagline,
    heroTitle,
    heroDescription,
    features,
    templateId,
  } = branding;

  const impactSection = usePartnerSectionContent('impactStats');
  const { src: partnerHeroVideo, isPartnerSite: onPartnerSite } = usePartnerAsset('heroVideo', heroVideo);
  const { src: partnerHeroImage } = usePartnerAsset('heroImage', null);
  const { src: heroPoster } = usePartnerAsset('heroPoster', null);
  const mainSiteHeroVideo = useMainSiteLandingHeroVideo(heroVideo);
  const heroMediaSrc = onPartnerSite ? partnerHeroImage || partnerHeroVideo : partnerHeroImage || mainSiteHeroVideo;
  const heroMediaType = onPartnerSite && partnerHeroImage ? 'image' : 'video';
  const displayName = shortName || brandName;

  const [activeSlide, setActiveSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((previous) => (previous + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const showHero = !isPartnerSite || features?.showHero !== false;
  const showPublicationLogos = !isPartnerSite || features?.showPublicationLogos;
  const showImpactStats = !isPartnerSite || features?.showImpactStats !== false;

  const kicker = isPartnerSite
    ? `${displayName} — Digital Growth Services`
    : 'Digital Growth Services for Brands';

  const title =
    isPartnerSite && heroTitle
      ? heroTitle
      : 'Build, Verify, Monetize, and Feature Your Brand Across Top Platforms';

  const description = isPartnerSite
    ? heroDescription || tagline
    : 'From websites and mobile apps to social verification, monetization, PR distribution, Instagram promotions, and Wikipedia pages, we deliver end-to-end services designed for business growth and credibility.';

  const mediaKicker = isPartnerSite ? `${displayName} Services` : 'Bluetick Services';

  return {
    branding,
    isPartnerSite,
    templateId: templateId || 'modern',
    displayName,
    showHero,
    showPublicationLogos,
    showImpactStats,
    kicker,
    title,
    description,
    mediaKicker,
    heroMediaSrc,
    heroMediaType,
    heroPoster,
    activeSlide,
    statsVisible,
    statsRef,
    impactItems: impactSection.items || impactStats,
  };
}
