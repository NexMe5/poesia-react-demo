import { BUSINESS, CONTACT } from '../../../data/site';

const Mail = () => <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>;

/** Privacy Policy. Each section: id (anchor), title, body. */
export const PRIVACY_POLICY = {
  slug: 'privacy-policy',
  label: 'Legal',
  title: 'Privacy Policy',
  effective: '1 November 2026',
  intro: (
    <>
      This Privacy Policy explains how {BUSINESS.name} collects, uses, shares and protects personal data when you
      visit this website or otherwise deal with us, and the choices and rights available to you.
    </>
  ),
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      body: (
        <>
          <p>
            {BUSINESS.name} (“<strong>Poesia</strong>”, “<strong>we</strong>”, “<strong>us</strong>” or
            “<strong>our</strong>”) roasts and supplies coffee, and supplies coffee equipment, barista training and
            related services, to cafés, hotels, restaurants, workplaces and other businesses. Our roastery and office is
            at {CONTACT.address}.
          </p>
          <p>
            For the purposes of the Digital Personal Data Protection Act, 2023 and the rules made under it (together,
            the “<strong>DPDP Act</strong>”), we are the Data Fiduciary for the personal data described in this
            Policy. We also follow the Information Technology Act, 2000 and the rules made under it.
          </p>
          <p>
            “<strong>Personal data</strong>” means any data about an individual who can be identified by or in relation
            to that data. “<strong>You</strong>” means any individual who visits this website or communicates with us,
            including individuals acting on behalf of a business.
          </p>
        </>
      ),
    },
    {
      id: 'what-we-collect',
      title: 'Personal data we collect',
      body: (
        <>
          <h3>When you browse this website</h3>
          <p>
            This website does not ask you to create an account, does not contain forms, and does not use cookies,
            analytics, advertising or tracking technologies. Like every website, it is delivered by a hosting provider
            whose servers automatically record limited technical information with each request: your IP address,
            browser and device type, the date and time, and the page or file requested. These records are used only to
            operate, secure and troubleshoot the website.
          </p>
          <p>
            To load faster on later visits and to remain available offline, the website stores copies of its own files
            (code, fonts and images) in your browser’s cache. These copies contain no personal data, and you may delete
            them at any time through your browser settings.
          </p>
          <h3>When you contact us</h3>
          <p>
            When you call, email or message us on WhatsApp, or request a tasting or a quotation, we receive the
            information you choose to share, which typically includes your name, the name of your business, your role,
            your phone number, email address or WhatsApp profile, the location of your outlet, and the content of your
            message.
          </p>
          <h3>When you become a business customer</h3>
          <p>
            To supply products and services we may also collect the business details of your organisation and its
            contact persons, such as billing and delivery addresses, GST registration number, order and payment
            records, details needed to install and service equipment, and the names of staff who attend barista
            training. Payments are made through banks or payment providers; we do not collect or store card details.
          </p>
          <p>
            We do not ask for, and request that you do not send us, passwords, government identification numbers of
            individuals, health information or other sensitive personal data. Our services are intended for businesses,
            and we do not knowingly collect personal data of children.
          </p>
        </>
      ),
    },
    {
      id: 'how-we-use',
      title: 'How we use personal data',
      body: (
        <>
          <p>We use personal data only for the following purposes:</p>
          <ul>
            <li>to respond to your enquiries and to arrange tastings, quotations and visits;</li>
            <li>to supply coffee and equipment, and to provide installation, training, maintenance and support;</li>
            <li>to issue invoices, receive payments and maintain accounting and tax records;</li>
            <li>to communicate with you about your orders, deliveries and services;</li>
            <li>with your consent, to tell you about new blends, products or offers relevant to your business;</li>
            <li>to keep this website and our systems secure and to prevent fraud or misuse; and</li>
            <li>to comply with applicable law and with lawful requests of public authorities.</li>
          </ul>
          <p>We do not sell personal data, and we do not use it for automated decision-making or profiling.</p>
        </>
      ),
    },
    {
      id: 'legal-basis',
      title: 'Consent and legitimate uses',
      body: (
        <>
          <p>
            We process personal data on the basis of your consent or for a legitimate use permitted by the DPDP Act,
            for example where you have voluntarily provided the data for a specified purpose such as an enquiry or an
            order, or where processing is necessary to comply with a legal obligation.
          </p>
          <p>
            Where we rely on consent, you may withdraw it at any time by writing to <Mail />. Withdrawal does not affect
            processing carried out before it, and we may be unable to continue providing a service that depends on the
            data concerned. We will stop sending promotional messages promptly when you ask us to.
          </p>
        </>
      ),
    },
    {
      id: 'sharing',
      title: 'Who we share personal data with',
      body: (
        <>
          <p>We share personal data only as needed for the purposes above, with:</p>
          <ul>
            <li>our website hosting provider, which stores and delivers the website;</li>
            <li>communication services you choose to reach us through, such as WhatsApp, telephone and email providers;</li>
            <li>logistics and courier partners who deliver orders;</li>
            <li>equipment manufacturers, their distributors and authorised technicians, for installation, warranty and servicing;</li>
            <li>professional advisers such as chartered accountants, auditors and lawyers, under a duty of confidentiality; and</li>
            <li>government, tax, regulatory or law enforcement authorities, where required by law or legal process.</li>
          </ul>
          <p>
            Where a service provider processes personal data on our behalf, we engage it under terms that require it
            to use the data only on our instructions and to protect it with reasonable security safeguards.
          </p>
        </>
      ),
    },
    {
      id: 'third-parties',
      title: 'Third-party services and links',
      body: (
        <p>
          This website links to services operated by others, including WhatsApp, Instagram, Facebook and Google Maps.
          When you follow such a link or message us through such a service, the provider of that service handles your
          data under its own privacy policy, and we are not responsible for its practices. We encourage you to read
          those policies.
        </p>
      ),
    },
    {
      id: 'transfers',
      title: 'Where personal data is processed',
      body: (
        <p>
          We are based in India. Some of our service providers, such as hosting and communication services, may process
          personal data on servers located outside India. Any such transfer is made in accordance with the DPDP Act,
          including any restrictions notified by the Government of India.
        </p>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep personal data',
      body: (
        <p>
          We keep personal data only for as long as it is needed for the purpose for which it was collected. Records of
          orders, invoices and payments are kept for the period required by applicable tax and accounting laws.
          Enquiries that do not lead to a business relationship are deleted within a reasonable period, and in any case
          within twenty-four months of our last communication, unless you ask us to keep them. Server logs are kept by
          our hosting provider for a limited period for security purposes.
        </p>
      ),
    },
    {
      id: 'security',
      title: 'How we protect personal data',
      body: (
        <p>
          We take reasonable security measures to protect personal data against unauthorised access, disclosure,
          alteration and loss. This website is served only over an encrypted connection (HTTPS), and access to customer
          information within our business is limited to those who need it. No method of transmission or storage is
          completely secure; if a personal data breach occurs, we will act on it and notify affected persons and
          authorities as required by law.
        </p>
      ),
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      body: (
        <>
          <p>Subject to the DPDP Act, you have the right to:</p>
          <ul>
            <li>obtain a summary of the personal data we hold about you and how we process it;</li>
            <li>have inaccurate or incomplete personal data corrected, completed or updated;</li>
            <li>have personal data erased when it is no longer needed, unless we must keep it to comply with law;</li>
            <li>withdraw consent you have given;</li>
            <li>have your grievances addressed by us; and</li>
            <li>nominate another person to exercise these rights on your behalf in the event of death or incapacity.</li>
          </ul>
          <p>
            To exercise any of these rights, write to <Mail /> from the email address or phone number you use with us,
            so that we can verify your request. We will respond within the time prescribed by applicable law.
          </p>
        </>
      ),
    },
    {
      id: 'grievances',
      title: 'Grievance Officer',
      body: (
        <>
          <p>
            In accordance with the Information Technology Act, 2000, the rules made under it, and the DPDP Act, any
            questions, complaints or grievances about the processing of your personal data may be addressed to our
            Grievance Officer:
          </p>
          <address className="legal-card">
            <strong>Grievance Officer, {BUSINESS.name}</strong>
            <span>{CONTACT.address}</span>
            <span>Email: <Mail /></span>
            <span>Phone: <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a></span>
          </address>
          <p>
            We will acknowledge your grievance promptly and resolve it within the time prescribed by applicable law. If
            you are not satisfied with our response, you may approach the Data Protection Board of India in the manner
            provided under the DPDP Act.
          </p>
        </>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this Policy',
      body: (
        <p>
          We may update this Policy from time to time, for example if we change how the website works or if the law
          changes. The updated Policy will be published on this page with a revised effective date. Where a change
          materially affects how we use personal data you have already shared, we will inform you through the contact
          details we hold.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact us',
      body: (
        <p>
          For any question about this Policy, write to <Mail />, call{' '}
          <a href={`tel:${CONTACT.phone}`}>{CONTACT.phoneDisplay}</a>, or write to us at {CONTACT.address}.
        </p>
      ),
    },
  ],
};
