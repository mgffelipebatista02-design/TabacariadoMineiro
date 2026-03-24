import { SITE_NAME, ANVISA_NOTICE } from '@/lib/constants'

export default function TermosDeUsoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-8">Termos de Uso</h1>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <p>
          Ao utilizar o site da {SITE_NAME}, você concorda com os termos e condições descritos
          abaixo. Leia atentamente antes de prosseguir.
        </p>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            1. Restrição de Idade
          </h2>
          <p>
            {ANVISA_NOTICE} Ao acessar este site e realizar qualquer pedido, você declara ter 18
            anos ou mais.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            2. Uso do Site
          </h2>
          <p>
            Este site destina-se exclusivamente à consulta de informações sobre produtos e
            realização de pedidos. É proibido o uso para fins ilícitos ou que violem a legislação
            vigente.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            3. Pedidos e Pagamentos
          </h2>
          <p>
            Todos os pedidos estão sujeitos à disponibilidade de estoque e confirmação de
            pagamento. Os preços podem ser alterados sem aviso prévio. A nota fiscal eletrônica
            será emitida para todas as operações.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            4. Entregas e Devoluções
          </h2>
          <p>
            Os prazos de entrega variam conforme a região e modalidade de frete escolhida.
            Devoluções são aceitas conforme o Código de Defesa do Consumidor, no prazo de 7 dias
            corridos após o recebimento.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            5. Propriedade Intelectual
          </h2>
          <p>
            Todo o conteúdo deste site (textos, imagens, logotipos, layout) é de propriedade da{' '}
            {SITE_NAME} e está protegido por leis de propriedade intelectual.
          </p>
        </section>

        <p className="text-text-muted text-sm mt-8">Última atualização: março de 2026.</p>
      </div>
    </div>
  )
}
