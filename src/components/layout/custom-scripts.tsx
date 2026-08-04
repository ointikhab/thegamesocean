'use client'

import { useEffect } from 'react'

/**
 * Injects admin-supplied raw HTML/JS (GTM, Meta Pixel, etc.) into the page.
 * <script> tags set via innerHTML never execute, so each one is rebuilt
 * as a real DOM node before being appended.
 */
export function CustomScripts({ html, target }: { html?: string | null; target: 'head' | 'body' }) {
  useEffect(() => {
    if (!html?.trim()) return

    const container = document.createElement('div')
    container.innerHTML = html
    const nodes = Array.from(container.childNodes)
    const mountPoint = target === 'head' ? document.head : document.body

    const inserted: ChildNode[] = []
    for (const node of nodes) {
      if (node.nodeName === 'SCRIPT') {
        const original = node as HTMLScriptElement
        const script = document.createElement('script')
        for (const { name, value } of Array.from(original.attributes)) {
          script.setAttribute(name, value)
        }
        script.text = original.text
        mountPoint.appendChild(script)
        inserted.push(script)
      } else {
        const clone = node.cloneNode(true) as ChildNode
        mountPoint.appendChild(clone)
        inserted.push(clone)
      }
    }

    return () => {
      for (const node of inserted) node.parentNode?.removeChild(node)
    }
  }, [html, target])

  return null
}
