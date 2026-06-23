import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteMedia } from '../contexts/MainSiteMediaContext';
import { usePartnerAsset } from '../utils/partnerMedia';

export function useMainSiteServiceHero({
  videoSlot,
  imageSlot,
  fallbackVideo = null,
  fallbackPoster = null,
  partnerImageKey = null,
}) {
  const { isPartnerSite } = usePartnerBranding();
  const { getServiceVideo, getServiceImage } = useMainSiteMedia();
  const { src: partnerImage } = usePartnerAsset(partnerImageKey, fallbackPoster);

  if (isPartnerSite) {
    return {
      videoSrc: null,
      posterSrc: partnerImageKey ? partnerImage : fallbackPoster,
    };
  }

  return {
    videoSrc: getServiceVideo(videoSlot, fallbackVideo),
    posterSrc: getServiceImage(imageSlot, fallbackPoster),
  };
}

export function useMainSiteLandingHeroVideo(fallbackVideo) {
  const { isPartnerSite } = usePartnerBranding();
  const { getHeroVideo } = useMainSiteMedia();

  if (isPartnerSite) {
    return fallbackVideo;
  }

  return getHeroVideo(fallbackVideo);
}
