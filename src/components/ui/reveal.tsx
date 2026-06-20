'use client'

import { motion, type Variants } from 'framer-motion'
import React from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.21, 0.47, 0.32, 0.98] },
  }),
}

export function Reveal({
  children,
  index = 0,
  className,
  as: Component = 'div',
}: {
  children: React.ReactNode
  index?: number
  className?: string
  as?: React.ElementType
}) {
  const MotionComponent = motion.create(Component)
  return (
    <MotionComponent
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}
