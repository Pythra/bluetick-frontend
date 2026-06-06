import { Link, Navigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { legalDocumentsBySlug } from '../../data/legalDocuments';
import { parseLegalDocumentLines } from '../../utils/parseLegalDocumentLines';
import './LegalPages.css';

function renderContentBlock(block) {
  if (block.type === 'paragraph') {
    return <p>{block.text}</p>;
  }

  if (block.type === 'list') {
    return (
      <>
        {block.intro ? <p>{block.intro}</p> : null}
        {block.items.length ? (
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }

  if (block.type === 'subsection') {
    return (
      <>
        <h3 className="legal-subsection-title">{block.title}</h3>
        {block.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {block.items.length ? (
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }

  return null;
}

function LegalDocumentPage() {
  const { slug } = useParams();
  const document = legalDocumentsBySlug[slug];

  if (!document) {
    return <Navigate to="/" replace />;
  }

  const sections = parseLegalDocumentLines(document.lines);

  return (
    <div className="legal-page">
      <Navbar />
      <div className="legal-container">
        <h1>{document.title}</h1>
        <p className="last-updated">Effective Date: {document.effectiveDate}</p>

        {sections.map((section) => (
          <section className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.content.map((block, blockIndex) => (
              <div key={`${section.title}-${blockIndex}`}>{renderContentBlock(block)}</div>
            ))}
          </section>
        ))}

        <section className="legal-section legal-closing">
          <p>
            Questions about this document? Contact us at{' '}
            <a href="mailto:info@bluetickgeng.com">info@bluetickgeng.com</a>.
          </p>
          <p className="legal-back-link">
            <Link to="/">Back to home</Link>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default LegalDocumentPage;
