import type { CollectionConfig } from 'payload'

import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { adminsCanMutate } from '@/access'

export const Products: CollectionConfig = {
  slug: 'products',
  access: adminsCanMutate,
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
    defaultColumns: ['title', 'platform', 'price', 'stock', 'status', 'featured'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Sold out', value: 'sold-out' },
        { label: 'Coming soon', value: 'coming-soon' },
        { label: 'Draft', value: 'draft' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'platform',
      type: 'relationship',
      relationTo: 'platforms',
      admin: { position: 'sidebar' },
    },
    {
      name: 'condition',
      type: 'select',
      defaultValue: 'new',
      admin: { position: 'sidebar' },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Used', value: 'used' },
        { label: 'Both (new & used)', value: 'both' },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      admin: { position: 'sidebar' },
    },
    {
      name: 'sku',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Selling price in PKR' },
    },
    {
      name: 'compareAtPrice',
      type: 'number',
      min: 0,
      admin: { description: 'Original price — shown struck-through when higher than price (sale badge)' },
    },
    {
      name: 'usedPrice',
      type: 'number',
      min: 0,
      admin: {
        condition: (data) => data?.condition === 'both',
        description: 'Selling price for the used condition (this product also supports "New" via the price field above).',
      },
    },
    {
      name: 'usedCompareAtPrice',
      type: 'number',
      min: 0,
      admin: {
        condition: (data) => data?.condition === 'both',
        description: 'Original/struck-through price for the used condition.',
      },
    },
    {
      name: 'stock',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 0,
      min: 0,
      max: 5,
      admin: { description: 'Average rating (seeded/derived from reviews)' },
    },
    {
      name: 'reviewCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: { description: 'Shown on product cards and listing pages' },
    },
    {
      name: 'note',
      type: 'textarea',
      admin: { description: 'Optional notice shown prominently on the product page — e.g. "All prices subject to change", "Digital code — non-refundable", "Ships from UAE"' },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: { description: 'YouTube video URL or video ID — e.g. https://youtu.be/abc123 or https://www.youtube.com/watch?v=abc123' },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'specs',
      type: 'array',
      labels: { singular: 'Spec', plural: 'Specs' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      labels: { singular: 'Variant', plural: 'Variants' },
      admin: {
        description:
          'Optional purchasable options (e.g. colour or edition). Leave empty for single-SKU products.',
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'sku', type: 'text' },
        {
          name: 'condition',
          type: 'select',
          options: [
            { label: 'New', value: 'new' },
            { label: 'Used', value: 'used' },
          ],
          admin: {
            condition: (data) => data?.condition === 'both',
            description: 'Which condition this specific variant is — shown when the product supports both New & Used.',
          },
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
          admin: { description: 'Selling price for this variant (leave blank to use base product price)' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
          admin: { description: 'Original/struck-through price for this variant (shows sale badge)' },
        },
        { name: 'stock', type: 'number', required: true, defaultValue: 0, min: 0 },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
