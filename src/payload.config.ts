import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Banners } from './collections/Banners'
import { Brands } from './collections/Brands'
import { Categories } from './collections/Categories'
import { Customers } from './collections/Customers'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { SupportTickets } from './collections/SupportTickets'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { HomePage } from './globals/HomePage'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— NEXORA Admin',
    },
  },
  collections: [Users, Customers, Media, Brands, Categories, Products, Reviews, Orders, Banners, Pages, SupportTickets],
  globals: [SiteSettings, Header, Footer, HomePage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // The dev schema-push prompts for confirmation on a TTY when it detects
    // "warnings" — which hangs/exits non-interactive runs (e.g. the seed script).
    // Schema is already in sync from the running dev server, so push can be skipped.
    push: process.env.PAYLOAD_SKIP_DB_PUSH !== 'true',
  }),
  sharp,
  plugins: [],
})
