'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SITE_NAME, ANVISA_NOTICE } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-secondary border-t border-border-default">
      <div className="mx-auto max-w-[1200px] px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Logo + Description */}
          <div className="space-y-4">
            <Link
              href="/"
              className="font-display text-xl font-bold text-accent-amber"
            >
              {SITE_NAME}
            </Link>
            <p className="text-sm leading-relaxed text-text-secondary">
              Tabacaria especializada em produtos premium para varejo e atacado.
              Qualidade, variedade e os melhores preços de Minas Gerais.
            </p>
          </div>

          {/* Col 2: Institutional Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
              Navegação
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/catalogo"
                className="text-sm text-text-secondary hover:text-accent-amber transition-colors"
              >
                Catálogo
              </Link>
              <Link
                href="/sobre"
                className="text-sm text-text-secondary hover:text-accent-amber transition-colors"
              >
                Sobre
              </Link>
              <Link
                href="/contato"
                className="text-sm text-text-secondary hover:text-accent-amber transition-colors"
              >
                Contato
              </Link>
            </nav>
          </div>

          {/* Col 3: Legal Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
              Legal
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                href="/politica-de-privacidade"
                className="text-sm text-text-secondary hover:text-accent-amber transition-colors"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/termos-de-uso"
                className="text-sm text-text-secondary hover:text-accent-amber transition-colors"
              >
                Termos de Uso
              </Link>
              <Link
                href="/compliance"
                className="text-sm text-text-secondary hover:text-accent-amber transition-colors"
              >
                Compliance
              </Link>
            </nav>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-primary">
              Contato
            </h3>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <p>contato@tabacariadomineiro.com.br</p>
              <p>(31) 99999-0000</p>
              <p>Belo Horizonte, MG</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-default">
        <div
          className={cn(
            'mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-4 py-6',
            'sm:flex-row sm:justify-between'
          )}
        >
          <p className="text-xs text-text-muted">
            &copy; {currentYear} {SITE_NAME}. Todos os direitos reservados.
          </p>

          <p className="max-w-md text-center text-xs leading-relaxed text-text-muted sm:text-right">
            {ANVISA_NOTICE}
          </p>

          <span
            className={cn(
              'inline-flex items-center justify-center rounded-[--radius-md] border-2 border-accent-amber',
              'px-3 py-1 text-sm font-bold text-accent-amber'
            )}
          >
            +18
          </span>
        </div>
      </div>
    </footer>
  )
}
