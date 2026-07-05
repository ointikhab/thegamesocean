/**
 * Updates the footer global to include the Refund & Exchange Policy link
 * and align labels with the About/Contact/Terms pages.
 *
 * Run with:  npm run payload run src/scripts/sync-footer.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'footer',
    overrideAccess: true,
    data: {
      columns: [
        {
          heading: 'Shop',
          links: [
            { label: 'PlayStation', href: '/shop?platform=playstation' },
            { label: 'Xbox', href: '/shop?platform=xbox' },
            { label: 'Nintendo Switch', href: '/shop?platform=switch' },
            { label: 'Accessories', href: '/shop?category=accessories' },
            { label: 'Deals', href: '/shop?sort=deals' },
          ],
        },
        {
          heading: 'Support',
          links: [
            { label: 'Contact Us', href: '/contact' },
            { label: 'Refund & Exchange Policy', href: '/refund-exchange-policy' },
            { label: 'Track Your Order', href: '/account/orders' },
            { label: 'FAQs', href: '/contact' },
          ],
        },
        {
          heading: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/terms-of-service' },
          ],
        },
      ],
    },
  })

  payload.logger.info('✅  footer global updated')
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
