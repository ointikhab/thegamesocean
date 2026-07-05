import type { Metadata } from 'next'

import { LegalPage } from '@/components/ui/legal-page'

export const metadata: Metadata = {
  title: 'Refund & Exchange Policy — The Games Ocean',
  description: 'Everything you need to know about returning, exchanging, or getting a refund on your The Games Ocean order.',
}

export default function RefundExchangePolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund & Exchange Policy"
      updated="July 6, 2026"
      intro="We want you to love your gear. Here's how returns, exchanges and refunds work at The Games Ocean."
      sections={[
        {
          heading: '1. Return window',
          body: (
            <p>
              You may request a return or exchange within <strong>7 days</strong> of receiving your order.
              Requests made after this window will be reviewed on a case-by-case basis but are not guaranteed.
            </p>
          ),
        },
        {
          heading: '2. Eligibility for return or exchange',
          body: (
            <>
              <p>To be eligible, the item must be:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Unused, unopened and in its original condition</li>
                <li>In the original packaging, with all accessories, manuals and seals intact</li>
                <li>Accompanied by proof of purchase (order number or invoice)</li>
              </ul>
            </>
          ),
        },
        {
          heading: '3. Non-returnable items',
          body: (
            <>
              <p>For hygiene, licensing and security reasons, the following items cannot be returned or exchanged once delivered:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Digital gift cards and game codes (PSN, Xbox, Nintendo eShop, Roblox, etc.)</li>
                <li>Opened or used game discs/cartridges</li>
                <li>Earphones, headsets or controllers that have been used</li>
                <li>Items marked as final sale or clearance</li>
              </ul>
            </>
          ),
        },
        {
          heading: '4. Damaged or defective items',
          body: (
            <p>
              If your item arrives damaged, defective, or not as described, contact us within 48 hours of
              delivery with photos of the product and packaging. We&apos;ll arrange a free replacement, repair,
              or full refund — no questions asked.
            </p>
          ),
        },
        {
          heading: '5. How to request a return or exchange',
          body: (
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Reach out via our{' '}
                <a href="/contact" className="font-semibold text-violet-glow hover:text-violet-glow/80">
                  Contact page
                </a>{' '}
                with your order number and reason for return.
              </li>
              <li>Our support team will confirm eligibility and share pickup or drop-off instructions.</li>
              <li>Once the item is received and inspected, we&apos;ll process your exchange or refund.</li>
            </ol>
          ),
        },
        {
          heading: '6. Refund method & timeline',
          body: (
            <p>
              Approved refunds for online payments are credited back to the original payment method within
              5–10 business days. Refunds for Cash on Delivery orders are issued via bank transfer or store
              credit, whichever you prefer.
            </p>
          ),
        },
        {
          heading: '7. Exchanges',
          body: (
            <p>
              Want a different size, color or model instead? We&apos;ll gladly exchange your item for one of
              equal value, subject to stock availability. Price differences for higher-value items can be paid
              at the time of exchange.
            </p>
          ),
        },
        {
          heading: '8. Return shipping costs',
          body: (
            <p>
              Return shipping is free for damaged, defective, or incorrectly shipped items. For change-of-mind
              returns, a nominal courier fee may be deducted from your refund.
            </p>
          ),
        },
        {
          heading: '9. Need help?',
          body: (
            <p>
              Our support team is available 7 days a week — visit our{' '}
              <a href="/contact" className="font-semibold text-violet-glow hover:text-violet-glow/80">
                Contact page
              </a>{' '}
              and we&apos;ll sort it out quickly.
            </p>
          ),
        },
      ]}
    />
  )
}
