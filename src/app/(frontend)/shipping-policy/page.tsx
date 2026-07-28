import type { Metadata } from 'next'

import { LegalPage } from '@/components/ui/legal-page'

export const metadata: Metadata = {
  title: 'Shipping Policy — The Games Ocean',
  description: 'How The Games Ocean processes, ships, and delivers your order across Pakistan.',
}

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Shipping Policy"
      updated="July 22, 2026"
      intro="At The Games Ocean, we aim to deliver your favorite gaming products safely and quickly all across Pakistan."
      sections={[
        {
          heading: '1. Order Handling & Packaging',
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Once an order is confirmed, we take 1–2 working days to process, verify, and carefully pack your items.</li>
              <li>Each product is inspected and securely bubble-wrapped and sealed before shipping.</li>
              <li>Orders placed on weekends or public holidays are processed on the next working day.</li>
            </ul>
          ),
        },
        {
          heading: '2. Delivery Time',
          body: (
            <>
              <p>Delivery typically takes 2–5 working days after dispatch.</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>Major Cities (Karachi, Lahore, Islamabad): 2–3 days</li>
                <li>Other Areas: 3–5 days</li>
              </ul>
              <p>You will receive an SMS or email with tracking details once your parcel is shipped.</p>
            </>
          ),
        },
        {
          heading: '3. Shipping Partners',
          body: <p>We work with TCS, Leopards, Call Courier, and M&amp;P to ensure reliable nationwide delivery.</p>,
        },
        {
          heading: '4. Shipping Charges',
          body: (
            <>
              <p>A small delivery fee applies based on location and order weight.</p>
              <p>Free delivery may be available for promotional offers or minimum order values.</p>
            </>
          ),
        },
        {
          heading: '5. Delivery Delays',
          body: (
            <>
              <p>Delivery times may vary due to public holidays, courier workload, or weather conditions.</p>
              <p>The Games Ocean is not responsible for courier delays, but we assist customers in tracking their orders.</p>
            </>
          ),
        },
      ]}
    />
  )
}
