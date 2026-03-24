export const SITE_NAME = 'Tabacaria do Mineiro'
export const SITE_DESCRIPTION = 'Tabacaria especializada — varejo e atacado'

export const B2B_MIN_ORDER = 500 // R$ 500 pedido mínimo B2B

export const DISCOUNT_TIERS = [
  { min: 150, discount: 0.05, label: '5% de desconto acima de R$ 150' },
  { min: 300, discount: 0.08, label: '8% de desconto acima de R$ 300' },
  { min: 500, discount: 0.12, label: '12% de desconto acima de R$ 500' },
] as const

export const SHIPPING_OPTIONS = [
  { id: 'pac', name: 'PAC', days: '8-12 dias úteis', price: 18.9 },
  { id: 'sedex', name: 'SEDEX', days: '3-5 dias úteis', price: 32.5 },
  { id: 'transportadora', name: 'Transportadora', days: '5-8 dias úteis', price: 25.0 },
] as const

export const PAYMENT_METHODS = {
  b2c: ['pix', 'cartao', 'boleto'] as const,
  b2b: ['pix', 'boleto_30', 'boleto_60', 'boleto_90'] as const,
}

export const CATEGORIES = [
  'Essências',
  'Sedas',
  'Isqueiros',
  'Narguilé',
  'Acessórios',
  'Tabaco',
] as const

export const ORDER_STATUSES = [
  'pendente',
  'confirmado',
  'em_separacao',
  'enviado',
  'em_transito',
  'entregue',
  'cancelado',
] as const

export const ANVISA_NOTICE = 'Produto destinado a maiores de 18 anos. Proibida a venda para menores de idade conforme legislação vigente.'
export const AGE_BANNER_TEXT = 'Este site é destinado exclusivamente a maiores de 18 anos.'
