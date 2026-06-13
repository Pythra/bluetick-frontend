import { usePartnerText } from '../utils/partnerText';
import './EditorialGuidelinesSection.css';

function EditorialGuidelinesSection() {
  const { shortBrandName } = usePartnerText();
  return (
    <section className="editorial-guidelines-section" id="editorial-guidelines">
      <div className="editorial-guidelines-inner">
        <h2 className="editorial-guidelines-title">Editorial Guidelines</h2>

        <p className="editorial-guidelines-lead">
          At {shortBrandName}, we prioritize legitimate news and timely announcements. All press releases
          must be newsworthy, covering company events, expansions, milestones, financial reports,
          competitions, or other significant developments.
        </p>

        <p className="editorial-guidelines-note">
          We do not accept general articles, opinion pieces, or purely promotional content.
        </p>

        <hr className="editorial-guidelines-divider" />

        <h3 className="editorial-guidelines-heading">Content Requirements</h3>
        <ul className="editorial-guidelines-list">
          <li>Press releases must be between 500 and 1,500 words.</li>
          <li>Content should read like a professional news announcement.</li>
          <li>All information must be accurate and free of aggressive language, slander, or unverified claims.</li>
          <li>Submissions containing strong religious or political opinions are not accepted.</li>
          <li>
            Press releases must be written in the third person, with first-person references allowed
            only in direct quotes.
          </li>
          <li>
            Each press release must follow a logical structure, including:
            <ul>
              <li>Headline (concise, under 10 words)</li>
              <li>Summary</li>
              <li>Main content</li>
              <li>Closing comment</li>
              <li>Editor&apos;s comment (if applicable)</li>
            </ul>
          </li>
          <li>Subheadings are generally not included in news announcements.</li>
          <li>All press releases must originate from a specific city and country.</li>
        </ul>

        <hr className="editorial-guidelines-divider" />

        <h3 className="editorial-guidelines-heading">Formatting and Submission Guidelines</h3>
        <ul className="editorial-guidelines-list">
          <li>Press releases must be properly formatted, with each paragraph separated by a line break.</li>
          <li>
            All submissions must be free of spelling and grammatical errors. {shortBrandName} does not
            proofread or edit content submitted for publication.
          </li>
          <li>
            Each press release must include valid media contact details, including a contact name and
            email address, where applicable.
          </li>
          <li>
            Hyperlinks must be relevant and direct readers to supporting information such as graphics,
            documents, or official sources.
          </li>
          <li>Links used solely for promotional purposes will be removed.</li>
        </ul>

        <hr className="editorial-guidelines-divider" />

        <h3 className="editorial-guidelines-heading">Image Requirements</h3>
        <ul className="editorial-guidelines-list">
          <li>Each submission must include one main image in .jpg or .png format.</li>
          <li>Company logos are not permitted within press releases.</li>
          <li>
            For additional media files, we recommend sharing a Google Drive or Dropbox link in the Notes
            to the Editor section.
          </li>
          <li>Embedded images within the press release body will result in a request for revisions.</li>
        </ul>

        <hr className="editorial-guidelines-divider" />

        <h3 className="editorial-guidelines-heading">Editorial and Compliance Policies</h3>
        <p className="editorial-guidelines-text">
          {shortBrandName} reserves the right to reject, modify, or delete any content deemed offensive,
          slanderous, racist, inflammatory, sexually explicit, or promoting violence or terrorism.
        </p>
        <ul className="editorial-guidelines-list">
          <li>
            If a press release contains grandiose claims (e.g., endorsements, partnerships, or
            extraordinary achievements), {shortBrandName} may request additional proof before publication.
          </li>
          <li>
            All submissions must be sent from a valid business email address. If authenticity is
            uncertain, additional verification may be required.
          </li>
          <li>
            If a press release does not meet our editorial standards, clients may opt for
            {shortBrandName}&apos;s Editorial Service, starting at ₦20,000 (+VAT), to refine and optimize
            the content.
          </li>
        </ul>

        <hr className="editorial-guidelines-divider" />

        <h3 className="editorial-guidelines-heading">Reasons for Refusal of Distribution</h3>
        <p className="editorial-guidelines-text">
          {shortBrandName} may refuse to distribute a press release for the following reasons:
        </p>
        <ul className="editorial-guidelines-list">
          <li>Poor headline — The headline lacks a clear news angle and/or attribution to the issuer.</li>
          <li>
            Advertisement or SPAM — The content reads like an advertisement or spam. Examples include
            words or phrases such as FREE, &quot;Make Money&quot;, &quot;Don&apos;t miss this
            opportunity!&quot;, SALE!!!!.
          </li>
          <li>Poor newsworthiness — The press release lacks sufficient news value.</li>
          <li>Poor writing quality — The content is poorly written or unclear.</li>
          <li>Lack of credible contact information — Missing or unreliable contact details.</li>
          <li>Keyword spamming — Excessive or manipulative use of keywords or phrases.</li>
        </ul>

        <p className="editorial-guidelines-subheading">Prohibited Content Includes:</p>
        <ul className="editorial-guidelines-list">
          <li>Personal opinions intended to harm or seek revenge against an individual or group.</li>
          <li>Blog posts or open letters that lack attribution or news value.</li>
          <li>
            Defamatory or harmful content, including material that incites hatred, bigotry, racism, or
            violence; promotes personal attacks; defames or victimizes individuals or organizations.
          </li>
          <li>
            Sexually explicit content, including references or links to explicit, illegal, or profane
            material.
          </li>
          <li>Health supplements or sexual enhancement pharmaceuticals.</li>
          <li>Get-rich schemes, networking marketing, or MLM-related content.</li>
          <li>Piggybacking, defined as unauthorized use of another issuer&apos;s name or identity.</li>
          <li>
            Unauthorized celebrity mentions without verified consent or documentation from a legal
            representative or management team.
          </li>
          <li>
            Unsubstantiated medical claims, including claims related to COVID-19 prevention or
            treatment.
          </li>
          <li>Inappropriate associations implying false government or official endorsements.</li>
          <li>
            Unapproved home testing kits for medical conditions without regulatory clearance.
          </li>
        </ul>

        <hr className="editorial-guidelines-divider" />

        <h3 className="editorial-guidelines-heading">Agreement</h3>
        <p className="editorial-guidelines-text">
          By submitting a press release to {shortBrandName}, you acknowledge and agree to comply with these
          editorial guidelines. Failure to meet these standards may result in rejection or removal of
          the submission.
        </p>
      </div>
    </section>
  );
}

export default EditorialGuidelinesSection;
