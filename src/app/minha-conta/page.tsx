'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MinhaContaPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/minha-conta/dados')
  }, [router])

  return null
}
