import AuroraFooter from '../footers/AuroraFooter';
import AtelierFooter from '../footers/AtelierFooter';
import InstitutionalFooter from '../footers/InstitutionalFooter';
import NoirFooter from '../footers/NoirFooter';
import EditorialFooter from '../footers/EditorialFooter';

const TEMPLATE_FOOTERS = {
  modern: AuroraFooter,
  minimal: AtelierFooter,
  corporate: InstitutionalFooter,
  bold: NoirFooter,
  studio: EditorialFooter,
};

function PartnerTemplateFooter({ templateId, onScrollToSection }) {
  const Footer = TEMPLATE_FOOTERS[templateId] || AuroraFooter;
  return <Footer onScrollToSection={onScrollToSection} />;
}

export default PartnerTemplateFooter;
