'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AGE_BANNER_TEXT } from '@/lib/constants'

const STORAGE_KEY = 'age-banner-dismissed'

export function AgeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (dismissed !== 'true') {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  function handleDismiss() {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-40',
            'bg-accent-amber text-bg-primary',
            'px-4 py-3'
          )}
        >
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
            <p className="text-sm font-medium">{AGE_BANNER_TEXT}</p>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 rounded-[--radius-sm] p-1 hover:bg-accent-amber-dark/30 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
