export interface Banner {
  id: string
  title: string
  subtitle: string
  gradient: string
  alt: string
  link: string
  ctaLabel: string
}

export const banners: Banner[] = [
  {
    id: 'banner-01',
    title: 'Essências Importadas',
    subtitle: 'Conheça nossa seleção de essências premium das melhores marcas internacionais.',
    gradient: 'from-[#4A6629] via-[#5B7A34] to-[#6B8A3E]',
    alt: 'Seleção de essências importadas para narguile',
    link: '/catalogo/essencias',
    ctaLabel: 'Conhecer',
  },
  {
    id: 'banner-02',
    title: 'Narguiles para Coleção',
    subtitle: 'Peças exclusivas com design artesanal e acabamento premium.',
    gradient: 'from-[#2D1B0E] via-[#5C3A1E] to-[#C8956C]',
    alt: 'Narguiles artesanais de coleção',
    link: '/catalogo/narguile',
    ctaLabel: 'Explorar',
  },
  {
    id: 'banner-03',
    title: 'Atendimento B2B Especializado',
    subtitle: 'Condições diferenciadas para lojistas. Catálogo completo e entrega para todo o Brasil.',
    gradient: 'from-[#1A2E0A] via-[#3A5A1A] to-[#5B7A34]',
    alt: 'Atendimento especializado para atacado',
    link: '/pedido-rapido',
    ctaLabel: 'Informações',
  },
  {
    id: 'banner-04',
    title: 'Acessórios Selecionados',
    subtitle: 'Grinders, piteiras e bandejas das marcas mais reconhecidas do mercado.',
    gradient: 'from-[#3B2F2F] via-[#6B5B4B] to-[#C8956C]',
    alt: 'Acessórios para tabacaria',
    link: '/catalogo/acessorios',
    ctaLabel: 'Explorar',
  },
]
