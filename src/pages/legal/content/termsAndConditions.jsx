import { Link } from '../../../router/Router';
import { BUSINESS, CONTACT } from '../../../data/site';

const Mail = () => <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

/** Terms & Conditions of use of the website. Each section: id (anchor), title, body. */
export const TERMS = {
  slug: 'terms',
  label: 'Legal',
  title: 'Terms & Conditions',
  effective: '1 November 2026',
  intro: (
    <>
      These Terms &amp; Conditions govern your use of this website. Please read them carefully: by accessing or
      using the website you agree to be bound by them. If you do not agree, please do not use the website.
    </>
  ),
  sections: [
    {
      id: 'about',
      title: 'About us and these Terms',
      body: (
        <>
          <p>
            This website is operated by {BUSINESS.name} (“<strong>Poesia</strong>”, “<strong>we</strong>”,
            “<strong>us</strong>” or “<strong>our</strong>”), whose roastery and office is at {CONTACT.address}.
            “<strong>You</strong>” means any person who accesses or uses the website. If you use the website on behalf
            of a business or other organisation, you confirm that you are authorised to accept these Terms on its
            behalf, and “you” includes that organisation.
          </p>
          <p>
            These Terms constitute an electronic record under the Information Technology Act, 2000 and the rules made
            under it, and do not require a physical or digital signature.
          </p>
        </>
      ),
    },
    {
      id: 'purpose',
      title: 'Purpose of the website',
      body: (
        <p>
          The website presents Poesia, our coffee, the equipment we supply and the services we offer to cafés, hotels,
          restaurants, workplaces and other businesses. It is provided for information only. Nothing on the website is
          an offer to sell, and no products can be ordered or paid for through it.
        </p>
      ),
    },
    {
      id: 'product-information',
      title: 'Product and equipment information',
      body: (
        <>
          <p>
            We take care to describe our blends, equipment and services accurately. However, tasting notes, blend
            compositions, roast levels, photographs, packaging and equipment specifications shown on the website are
            indicative and given for general guidance. Coffee is an agricultural product, and its character may vary
            naturally between crops and seasons. Manufacturers may change the design or specifications of equipment
            without notice.
          </p>
          <p>
            The specifications, quantities and prices that apply to any supply are those confirmed in writing in our
            quotation, proforma invoice or agreement with you.
          </p>
        </>
      ),
    },
    {
      id: 'orders',
      title: 'Quotations, orders and supply',
      body: (
        <>
          <p>
            Any supply of coffee, equipment, installation, training or other services is subject to a separate
            quotation, proforma invoice, purchase order or written agreement accepted by us (a “<strong>Supply
            Agreement</strong>”), which sets out the price, applicable taxes, delivery, payment and other commercial
            terms. All supplies are subject to availability and to our acceptance.
          </p>
          <p>
            If there is any conflict between these Terms and a Supply Agreement, the Supply Agreement prevails for that
            supply. Messages exchanged by WhatsApp, telephone or email are not binding on us until confirmed in writing.
          </p>
        </>
      ),
    },
    {
      id: 'equipment',
      title: 'Equipment and third-party brands',
      body: (
        <p>
          Espresso machines, grinders, fully automatic machines and barista tools supplied by us are manufactured by
          third parties. They carry the warranty, if any, given by their manufacturer, on the manufacturer’s terms,
          unless a Supply Agreement provides otherwise. Product names, brands and trademarks of manufacturers shown on
          the website, including Astoria, CIME, Eureka, B-Dose and Dr. Coffee, belong to their respective owners and are
          used only to identify the equipment we supply. Their use does not imply that those owners endorse or are
          affiliated with Poesia.
        </p>
      ),
    },
    {
      id: 'tastings-training',
      title: 'Tastings, visits and training',
      body: (
        <p>
          Requests for coffee tastings, site visits or barista training made through the website or its links are
          subject to our availability and to scheduling with you. They may be offered free of charge or for a fee, as
          we confirm with you in advance.
        </p>
      ),
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual property',
      body: (
        <>
          <p>
            The website and its content, including the Poesia name, wordmark and emblem, packaging designs, text,
            photographs, illustrations, animations, the design and arrangement of the website and its underlying code,
            are owned by or licensed to Poesia and are protected by the laws of India and international treaties on
            copyright, trademarks and other intellectual property.
          </p>
          <p>
            You may view the website and print or save pages for your own reference in evaluating our products and
            services. You may not copy, reproduce, modify, distribute, publish, frame or otherwise use any part of the
            website or its content for any other purpose, or use our name or marks in a way that suggests a
            relationship with us, without our prior written permission.
          </p>
        </>
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      body: (
        <>
          <p>When using the website, you agree not to:</p>
          <ul>
            <li>use it in any way that breaches applicable law or the rights of any person;</li>
            <li>attempt to gain unauthorised access to the website, its servers or any connected system;</li>
            <li>introduce viruses or other harmful code, or interfere with the website’s operation or security;</li>
            <li>copy or extract content by automated means such as scraping, except as permitted by law; or</li>
            <li>impersonate Poesia or any other person, or misrepresent your affiliation with us.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'third-party-links',
      title: 'Links to third-party services',
      body: (
        <p>
          The website contains links to services operated by others, including WhatsApp, Instagram, Facebook and Google
          Maps. These links are provided for your convenience. We do not control those services and are not
          responsible for their content, availability or practices; your use of them is governed by their own terms
          and policies.
        </p>
      ),
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      body: (
        <p>
          The website is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, we
          make no representations or warranties, express or implied, that the website will be uninterrupted,
          error-free or free of harmful components, or that its content is complete or current at all times. We may
          change, suspend or withdraw the website, or any part of it, at any time without notice.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: (
        <>
          <p>
            To the fullest extent permitted by law, Poesia shall not be liable for any indirect, incidental, special or
            consequential loss, or for any loss of profit, revenue, business, goodwill or data, arising out of or in
            connection with your use of, or inability to use, the website or any reliance on its content.
          </p>
          <p>
            Our liability in respect of any supply of products or services is governed solely by the relevant Supply
            Agreement. Nothing in these Terms excludes or limits any liability that cannot be excluded or limited under
            applicable law.
          </p>
        </>
      ),
    },
    {
      id: 'indemnity',
      title: 'Indemnity',
      body: (
        <p>
          You agree to indemnify and hold harmless Poesia, its proprietors, employees and agents from any claim, loss,
          damage, cost or expense, including reasonable legal fees, arising out of your breach of these Terms or your
          misuse of the website.
        </p>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy',
      body: (
        <p>
          Our handling of personal data is described in our <Link to="/privacy-policy">Privacy Policy</Link>, which forms
          part of these Terms.
        </p>
      ),
    },
    {
      id: 'law',
      title: 'Governing law and jurisdiction',
      body: (
        <p>
          These Terms and any dispute or claim arising out of or in connection with them or the website shall be
          governed by the laws of India. Subject to applicable law, the courts at Goa, India shall have exclusive
          jurisdiction.
        </p>
      ),
    },
    {
      id: 'general',
      title: 'General',
      body: (
        <p>
          If any provision of these Terms is held invalid or unenforceable, the remaining provisions shall continue in
          full force and effect. Our failure to enforce any provision shall not be a waiver of our right to do so later.
          These Terms, together with our Privacy Policy, form the entire agreement between you and us concerning your use
          of the website.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to these Terms',
      body: (
        <p>
          We may revise these Terms from time to time. The revised Terms will be published on this page with a new
          effective date and apply from that date. Your continued use of the website after a revision means that you
          accept the revised Terms.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact us',
      body: (
        <p>
          For any question about these Terms, write to <Mail />, call{' '}
          <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a>, or write to us at {CONTACT.address}.
        </p>
      ),
    },
  ],
};
