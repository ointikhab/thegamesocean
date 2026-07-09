import type { CollectionConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: adminsCanMutate,
  admin: {
    group: 'Catalog',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    // On Railway this must point at the mounted Volume's path (e.g. /data/media) via
    // MEDIA_UPLOAD_DIR — otherwise uploads live on the container's ephemeral disk and
    // vanish on every redeploy. Left unset, it falls back to Payload's normal local
    // "media" folder for local development.
    staticDir: process.env.MEDIA_UPLOAD_DIR || 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 400, position: 'centre' },
      { name: 'card', width: 640, height: 640, position: 'centre' },
      { name: 'large', width: 1600, height: 1600, position: 'centre', withoutEnlargement: true },
      // Wide landscape crop for the homepage hero carousel — square sizes above would
      // otherwise get double-cropped (once into a square, again to fit the wide banner).
      { name: 'hero', width: 2400, height: 1200, position: 'centre', withoutEnlargement: true },
    ],
    mimeTypes: ['image/*'],
  },
}
