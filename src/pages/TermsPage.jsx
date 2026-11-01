import LegalLayout from './legal/LegalLayout';
import { TERMS } from './legal/content/termsAndConditions';
import { usePageMeta } from '../lib/usePageMeta';

export default function TermsPage() {
  usePageMeta('/terms');
  return <LegalLayout doc={TERMS} />;
}
