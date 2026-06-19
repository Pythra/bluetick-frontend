import AuroraNavbar from '../navbars/AuroraNavbar';
import AtelierNavbar from '../navbars/AtelierNavbar';
import InstitutionalNavbar from '../navbars/InstitutionalNavbar';
import NoirNavbar from '../navbars/NoirNavbar';
import EditorialNavbar from '../navbars/EditorialNavbar';

const TEMPLATE_NAVBARS = {
  modern: AuroraNavbar,
  minimal: AtelierNavbar,
  corporate: InstitutionalNavbar,
  bold: NoirNavbar,
  studio: EditorialNavbar,
};

function TemplateNavbar({ templateId, onScrollToSection }) {
  const Nav = TEMPLATE_NAVBARS[templateId] || AuroraNavbar;
  return <Nav onScrollToSection={onScrollToSection} />;
}

export default TemplateNavbar;
