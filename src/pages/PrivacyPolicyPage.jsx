import LegalLayout from './legal/LegalLayout';
import { PRIVACY_POLICY } from './legal/content/privacyPolicy';
import { usePageMeta } from '../lib/usePageMeta';

export default function PrivacyPolicyPage() {
  usePageMeta('/privacy-policy');
  return <LegalLayout doc={PRIVACY_POLICY} />;
}
