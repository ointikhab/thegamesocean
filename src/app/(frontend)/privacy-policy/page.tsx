import type { Metadata } from 'next'

import { LegalPage } from '@/components/ui/legal-page'

export const metadata: Metadata = {
  title: 'Privacy Policy — The Games Ocean',
  description: 'How The Games Ocean collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="July 22, 2026"
      intro="At The Games Ocean, we value your privacy and are committed to protecting your personal information."
      sections={[
        {
          heading: '1. Information We Collect',
          body: (
            <>
              <p>We collect information when you:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact customer support</li>
              </ul>
              <p>This includes your name, email, phone number, delivery address, and payment details.</p>
            </>
          ),
        },
        {
          heading: '2. How We Use Your Information',
          body: (
            <>
              <p>Your information is used to:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Process and deliver your orders</li>
                <li>Improve our website experience</li>
                <li>Notify you about new products or promotions (only if you opt in)</li>
              </ul>
            </>
          ),
        },
        {
          heading: '3. Information Sharing',
          body: (
            <>
              <p>We do not sell, trade, or rent customer information.</p>
              <p>Data may be shared only with trusted third-party partners (e.g., couriers or payment providers) for order fulfillment.</p>
            </>
          ),
        },
        {
          heading: '4. Cookies',
          body: (
            <>
              <p>Our website uses cookies to improve site functionality, personalize content, and analyze performance.</p>
              <p>You can disable cookies anytime through your browser settings.</p>
            </>
          ),
        },
        {
          heading: '5. Data Protection',
          body: (
            <>
              <p>We maintain strict digital security standards to prevent unauthorized access or misuse.</p>
              <p>Users may request data removal or unsubscribe from marketing emails at any time.</p>
            </>
          ),
        },
      ]}
    />
  )
}
