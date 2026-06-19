import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getPartnerTemplateLanding } from './registry';

function PartnerLandingPage({ onScrollToSection }) {
  const { templateId } = usePartnerBranding();
  const Landing = getPartnerTemplateLanding(templateId);
  return <Landing onScrollToSection={onScrollToSection} />;
}

export default PartnerLandingPage;
