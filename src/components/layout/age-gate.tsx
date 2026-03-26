'use client'

import { useState } from 'react'
import { ShieldCheck, ShieldX } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false)
  const [denied, setDenied] = useState(false)

  return (
    <>
      {children}

      {!verified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary">
          {!denied ? (
            <div
              className={cn(
                'mx-4 w-full max-w-md rounded-[--radius-xl] bg-bg-card p-8 shadow-xl',
                'border border-border-default text-center',
                'animate-[fadeScaleIn_0.3s_ease-out]'
              )}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-bg-elevated">
                <ShieldCheck className="h-8 w-8 text-accent-green" />
              </div>

              <h1 className="font-display text-2xl font-bold text-text-primary">
                Verificação de Idade
              </h1>

              <p className="mt-3 text-text-secondary">
                Este site contém produtos destinados exclusivamente para maiores de 18 anos.
              </p>

              <p className="mt-4 text-lg font-semibold text-text-primary">
                Você tem 18 anos ou mais?
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setDenied(true)}
                  className={cn(
                    'flex-1 rounded-[--radius-md] border border-border-default px-6 py-3',
                    'font-medium text-text-secondary transition-colors',
                    'hover:bg-bg-secondary hover:border-border-hover'
                  )}
                >
                  Não
                </button>
                <button
                  onClick={() => setVerified(true)}
                  className={cn(
                    'flex-1 rounded-[--radius-md] bg-accent-green px-6 py-3',
                    'font-medium text-white transition-colors',
                    'hover:bg-accent-green-dark'
                  )}
                >
                  Sim, tenho 18+
                </button>
              </div>

              <p className="mt-6 text-xs text-text-muted">
                Ao confirmar, você declara ter 18 anos ou mais conforme exigido pela legislação vigente.
              </p>
            </div>
          ) : (
            <div
              className={cn(
                'mx-4 w-full max-w-md rounded-[--radius-xl] bg-bg-card p-8 shadow-xl',
                'border border-border-default text-center',
                'animate-[fadeScaleIn_0.3s_ease-out]'
              )}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-error/10">
                <ShieldX className="h-8 w-8 text-status-error" />
              </div>

              <h1 className="font-display text-2xl font-bold text-text-primary">
                Acesso Restrito
              </h1>

              <p className="mt-3 text-text-secondary">
                Este site é destinado exclusivamente para maiores de 18 anos. Você não pode acessar este conteúdo.
              </p>

              <button
                onClick={() => setDenied(false)}
                className={cn(
                  'mt-8 rounded-[--radius-md] border border-border-default px-6 py-3',
                  'font-medium text-text-secondary transition-colors',
                  'hover:bg-bg-secondary hover:border-border-hover'
                )}
              >
                Voltar
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
