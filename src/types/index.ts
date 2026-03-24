export type Mode = 'b2c' | 'b2b'

export type Category = 'Essências' | 'Sedas' | 'Isqueiros' | 'Narguilé' | 'Acessórios' | 'Tabaco'

export interface ProductVariation {
  id: string
  name: string
  sku: string
  priceB2C: number
  priceB2B: number
  stock: number
  image?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: Category
  description: string
  specifications: Record<string, string>
  priceB2C: number
  priceB2B: number
  unitB2C: string
  unitB2B: string
  minQtyB2B: number
  stock: number
  images: string[]
  variations?: ProductVariation[]
  rating: number
  reviewCount: number
  featured?: boolean
  tags?: string[]
}

export interface CartItem {
  productId: string
  variationId?: string
  quantity: number
  name: string
  price: number
  image: string
  unit: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  discountTier: number | null
  shipping: number
  total: number
}

export type OrderStatus =
  | 'pendente'
  | 'confirmado'
  | 'em_separacao'
  | 'enviado'
  | 'em_transito'
  | 'entregue'
  | 'cancelado'

export interface OrderTimelineEvent {
  status: OrderStatus
  date: string
  description: string
  location?: string
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
  unit: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  paymentMethod: string
  paymentCondition?: string
  trackingCode?: string
  timeline: OrderTimelineEvent[]
  nfe?: string
  customerId: string
  shippingAddress: Address
}

export interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  cep: string
  isDefault?: boolean
}

export interface CustomerBase {
  id: string
  name: string
  email: string
  phone: string
  addresses: Address[]
  createdAt: string
}

export interface CustomerB2C extends CustomerBase {
  type: 'b2c'
  cpf: string
}

export interface CustomerB2B extends CustomerBase {
  type: 'b2b'
  cnpj: string
  razaoSocial: string
  inscricaoEstadual: string
  nomeFantasia: string
  approved: boolean
  priceGroup: 'standard' | 'premium' | 'vip'
}

export type Customer = CustomerB2C | CustomerB2B

export interface UserProfile {
  isAuthenticated: boolean
  role: 'guest' | 'b2c' | 'b2b' | 'admin'
  customer: Customer | null
}

export interface AdminMetrics {
  totalRevenue: number
  totalOrders: number
  averageTicket: number
  totalCustomers: number
  revenueByMonth: { month: string; revenue: number }[]
  topProducts: { name: string; quantity: number; revenue: number }[]
  ordersByMode: { mode: string; count: number }[]
  lowStockProducts: { id: string; name: string; stock: number }[]
}

export interface PickingItem {
  orderId: string
  orderNumber: string
  productName: string
  sku: string
  quantity: number
  location: string
  picked: boolean
}

export interface Review {
  id: string
  productId: string
  customerName: string
  rating: number
  comment: string
  date: string
}
