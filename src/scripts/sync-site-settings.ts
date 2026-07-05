/**
 * Updates the site-settings global with the real contact details
 * (email, phone, shop address, Google Maps link).
 *
 * Run with:  npm run payload run src/scripts/sync-site-settings.ts
 */
import { getPayload } from 'payload'
import config from '@payload-config'

async function run() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      contactEmail: 'asifmohsin646@gmail.com',
      contactPhone: '+92 342 2904189',
      address: 'Shop # 11 Anaya Mobile Mall, Gurumandir, Karachi',
      mapLink: 'https://maps.app.goo.gl/ZcYeKxXeASD8wkew8',
    },
  })

  payload.logger.info('✅  site-settings global updated with contact details')
}

await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
