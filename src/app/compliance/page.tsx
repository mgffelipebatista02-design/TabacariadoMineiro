import { SITE_NAME, ANVISA_NOTICE } from '@/lib/constants'
import { Shield, FileText, AlertTriangle, Scale } from 'lucide-react'

const items = [
  {
    icon: Shield,
    title: 'Conformidade ANVISA',
    description:
      'Todos os produtos comercializados estão em conformidade com as regulamentações da Agência Nacional de Vigilância Sanitária. Mantemos registros atualizados e seguimos rigorosamente as normas vigentes.',
  },
  {
    icon: FileText,
    title: 'Nota Fiscal Eletrônica',
    description:
      'Todas as operações de venda, tanto no varejo quanto no atacado, são acompanhadas de nota fiscal eletrônica (NF-e) emitida junto à Sefaz, garantindo total transparência fiscal.',
  },
  {
    icon: AlertTriangle,
    title: 'Restrição de Idade',
    description: ANVISA_NOTICE,
  },
  {
    icon: Scale,
    title: 'Código de Defesa do Consumidor',
    description:
      'Respeitamos integralmente o Código de Defesa do Consumidor. Garantimos direito de arrependimento em até 7 dias, troca de produtos com defeito e transparência em todas as etapas da compra.',
  },
]

export default function CompliancePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-4">Compliance e Conformidade</h1>
      <p className="text-text-secondary mb-10">
        A {SITE_NAME} opera em total conformidade com a legislação brasileira. Conheça nossos
        compromissos regulatórios.
      </p>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 rounded-[--radius-xl] border border-border-default bg-bg-card p-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[--radius-lg] bg-accent-amber/10">
              <item.icon className="h-5 w-5 text-accent-amber" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold mb-1">{item.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
