import type { GlobalConfig } from 'payload'

import { adminsCanMutate } from '@/access'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: () => true,
    update: adminsCanMutate.update,
  },
  admin: { group: 'Site' },
  fields: [
    // ─── Hero Slides ─────────────────────────────────────────────────
    {
      name: 'heroSlides',
      label: 'Hero Slider',
      type: 'array',
      maxRows: 8,
      admin: { description: 'Slides shown in the homepage hero carousel. Use an image, or paste an MP4 URL for a looping video background.' },
      fields: [
        { name: 'eyebrow', type: 'text', admin: { description: 'Small badge text above the title, e.g. "New Arrival"' } },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'textarea' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Background image. Also used as the video poster when a video URL is set.' },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: { description: 'Optional: paste a direct MP4 URL to play a looping background video. The image above is used as the loading poster.' },
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Shop now' },
        { name: 'ctaHref', type: 'text', defaultValue: '/shop' },
        {
          name: 'theme',
          type: 'select',
          defaultValue: 'violet',
          options: [
            { label: 'Violet → Cyan', value: 'violet' },
            { label: 'Magenta → Violet', value: 'magenta' },
            { label: 'Cyan → Emerald', value: 'cyan' },
          ],
        },
      ],
    },

    // ─── Value Propositions ──────────────────────────────────────────
    {
      name: 'valueProps',
      label: 'Value Propositions',
      type: 'array',
      maxRows: 6,
      admin: { description: 'Trust-badge cards shown below the hero slider.' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          defaultValue: 'truck',
          options: [
            { label: 'Truck (Delivery)', value: 'truck' },
            { label: 'Shield Check (Authenticity)', value: 'shield-check' },
            { label: 'Badge Check (Warranty)', value: 'badge-check' },
            { label: 'Headset (Support)', value: 'headset' },
            { label: 'Zap (Speed)', value: 'zap' },
          ],
        },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'accent',
          type: 'select',
          required: true,
          defaultValue: 'violet',
          options: [
            { label: 'Violet', value: 'violet' },
            { label: 'Cyan', value: 'cyan' },
            { label: 'Emerald', value: 'emerald' },
            { label: 'Magenta', value: 'magenta' },
          ],
        },
      ],
    },

    // ─── Latest Arrivals ─────────────────────────────────────────────
    {
      name: 'latestArrivals',
      label: 'Latest Arrivals Section',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Just dropped' },
        { name: 'title', type: 'text', defaultValue: 'Latest arrivals' },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text', defaultValue: '/shop?sort=newest' },
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          maxRows: 10,
          admin: { description: 'Select up to 10 products to feature as latest arrivals.' },
        },
      ],
    },

    // ─── Shop by Platform ────────────────────────────────────────────
    {
      name: 'platformSection',
      label: 'Shop by Platform Section',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Shop by platform' },
        { name: 'title', type: 'text', defaultValue: 'Built for your setup, whatever it is.' },
        {
          name: 'description',
          type: 'textarea',
          defaultValue:
            'From living-room consoles to full PC battle-stations — find gear matched to your platform.',
        },
        {
          name: 'cards',
          type: 'array',
          maxRows: 8,
          admin: {
            description:
              'Platform browse cards. The Platform field controls the accent colour and icon.',
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'eyebrow', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'href', type: 'text', required: true },
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'PlayStation', value: 'playstation' },
                { label: 'Xbox', value: 'xbox' },
                { label: 'Nintendo Switch', value: 'switch' },
                { label: 'PC', value: 'pc' },
                { label: 'Universal', value: 'universal' },
              ],
            },
            {
              name: 'tag',
              type: 'text',
              admin: { description: 'Optional badge text, e.g. "Most Popular"' },
            },
          ],
        },
      ],
    },

    // ─── Platform Rails ───────────────────────────────────────────────
    {
      name: 'platformRails',
      label: 'Platform Product Rails',
      type: 'array',
      maxRows: 8,
      admin: {
        description:
          'Product rails after the platform grid (e.g. PlayStation, Xbox, Switch). Rail 1 appears above the Brand Strip; rail 2 above the Promo Band; the rest follow after.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          maxRows: 10,
          admin: { description: 'Select up to 10 products for this rail.' },
        },
      ],
    },

    // ─── Brand Strip ─────────────────────────────────────────────────
    {
      name: 'brandStripHeading',
      label: 'Brand Strip Heading',
      type: 'text',
      defaultValue: "Trusted gear from the world's best",
      admin: { description: 'Small label shown above the scrolling brand logos.' },
    },

    // ─── Promo Band ──────────────────────────────────────────────────
    {
      name: 'promoBand',
      label: 'Promo Band',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Trade-in & upgrade' },
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Got old gear? Trade it in for instant credit.',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          defaultValue:
            'Consoles, controllers and headsets accepted. Get an instant valuation online or in-store and roll it straight into your next order — no hassle, no waiting.',
        },
        {
          name: 'tags',
          type: 'array',
          admin: { description: 'Feature tag pills shown below the subtitle.' },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Get a valuation' },
        { name: 'primaryCtaHref', type: 'text', defaultValue: '/contact' },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Browse all products' },
        { name: 'secondaryCtaHref', type: 'text', defaultValue: '/shop' },
      ],
    },

    // ─── Category Rails ───────────────────────────────────────────────
    {
      name: 'categoryRails',
      label: 'Category Product Rails',
      type: 'array',
      maxRows: 8,
      admin: {
        description:
          'Category-based product rails shown at the bottom of the page. Admin hand-picks up to 10 products per rail.',
      },
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'href', type: 'text' },
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          maxRows: 10,
          admin: { description: 'Select up to 10 products for this rail.' },
        },
      ],
    },
  ],
}
