import { SITE_NAME } from '@/lib/constants'

export default function PoliticaPrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-8">Política de Privacidade</h1>

      <div className="space-y-6 text-text-secondary leading-relaxed">
        <p>
          A {SITE_NAME} está comprometida em proteger a privacidade dos dados pessoais de seus
          usuários. Esta política descreve como coletamos, usamos e protegemos suas informações.
        </p>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            1. Dados Coletados
          </h2>
          <p>
            Coletamos informações fornecidas voluntariamente no cadastro (nome, e-mail, telefone,
            CPF/CNPJ) e dados de navegação (cookies, endereço IP, páginas visitadas) para melhorar
            a experiência de uso.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            2. Uso dos Dados
          </h2>
          <p>
            Os dados são utilizados para: processamento de pedidos, comunicação sobre status de
            entregas, emissão de notas fiscais, cumprimento de obrigações legais e melhoria dos
            nossos serviços.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            3. Compartilhamento
          </h2>
          <p>
            Não compartilhamos dados pessoais com terceiros, exceto quando necessário para:
            processamento de pagamentos, entrega de produtos e cumprimento de obrigações legais.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            4. Segurança
          </h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não
            autorizado, perda ou destruição. Utilizamos criptografia SSL em todas as transações.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-3">
            5. Seus Direitos
          </h2>
          <p>
            Conforme a LGPD, você tem direito a acessar, corrigir, excluir e portar seus dados
            pessoais. Para exercer esses direitos, entre em contato através da nossa página de
            contato.
          </p>
        </section>

        <p className="text-text-muted text-sm mt-8">Última atualização: março de 2026.</p>
      </div>
    </div>
  )
}
