import type { Metadata } from 'next'

import { LegalPage } from '@/components/ui/legal-page'

export const metadata: Metadata = {
  title: 'Terms & Conditions — The Games Ocean',
  description: 'The terms and conditions governing your use of The Games Ocean website and your orders with us.',
}

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      updated="July 6, 2026"
      intro="Please read these terms carefully before using The Games Ocean or placing an order with us."
      sections={[
        {
          heading: '1. Acceptance of terms',
          body: (
            <p>
              By accessing or using thegamesocean.com (&quot;the Site&quot;), you agree to be bound by these
              Terms & Conditions. If you do not agree with any part of these terms, please do not use the Site
              or place an order with us.
            </p>
          ),
        },
        {
          heading: '2. Eligibility',
          body: (
            <p>
              You must be at least 18 years old, or placing an order under the supervision of a parent or
              guardian, to make a purchase on the Site. By placing an order you confirm that the information
              you provide is accurate and complete.
            </p>
          ),
        },
        {
          heading: '3. Products, pricing & availability',
          body: (
            <>
              <p>
                All prices are listed in Pakistani Rupees (PKR) and are subject to change without prior notice.
                We make every effort to display accurate pricing and stock availability, but errors can occur —
                if a product is mispriced or listed in error, we reserve the right to cancel the order and issue
                a full refund.
              </p>
              <p>
                Product images are for illustration purposes; actual packaging or accessories may vary slightly
                from what is shown.
              </p>
            </>
          ),
        },
        {
          heading: '4. Orders & payment',
          body: (
            <p>
              Orders can be paid via Cash on Delivery or supported online payment methods shown at checkout. An
              order is only confirmed once you receive an order confirmation from us. We reserve the right to
              refuse or cancel any order at our discretion, including in cases of suspected fraud or stock
              unavailability.
            </p>
          ),
        },
        {
          heading: '5. Shipping & delivery',
          body: (
            <p>
              Estimated delivery timelines are provided at checkout and on individual product pages. Delays
              caused by courier partners, weather, or circumstances beyond our control are not the
              responsibility of The Games Ocean, though we will assist in tracking and resolving any issues.
            </p>
          ),
        },
        {
          heading: '6. Returns, exchanges & warranty',
          body: (
            <p>
              Returns, exchanges and warranty claims are handled in accordance with our{' '}
              <a href="/refund-exchange-policy" className="font-semibold text-violet-glow hover:text-violet-glow/80">
                Refund & Exchange Policy
              </a>
              .
            </p>
          ),
        },
        {
          heading: '7. Intellectual property',
          body: (
            <p>
              All content on the Site — including logos, graphics, product descriptions and design — is the
              property of The Games Ocean or its licensors and may not be reproduced without written permission.
            </p>
          ),
        },
        {
          heading: '8. Limitation of liability',
          body: (
            <p>
              The Games Ocean is not liable for any indirect, incidental, or consequential damages arising from
              the use of our products or the Site, to the fullest extent permitted by applicable law.
            </p>
          ),
        },
        {
          heading: '9. Governing law',
          body: (
            <p>
              These terms are governed by the laws of the Islamic Republic of Pakistan, and any disputes shall be
              subject to the exclusive jurisdiction of the courts of Lahore, Pakistan.
            </p>
          ),
        },
        {
          heading: '10. Changes to these terms',
          body: (
            <p>
              We may update these Terms & Conditions from time to time. Continued use of the Site after changes
              are posted constitutes acceptance of the revised terms.
            </p>
          ),
        },
        {
          heading: '11. Contact us',
          body: (
            <p>
              Questions about these terms? Reach out via our{' '}
              <a href="/contact" className="font-semibold text-violet-glow hover:text-violet-glow/80">
                Contact page
              </a>{' '}
              — we&apos;re happy to help.
            </p>
          ),
        },
      ]}
    />
  )
}
