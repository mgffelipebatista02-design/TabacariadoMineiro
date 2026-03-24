import type { AdminMetrics } from '@/types'

export const adminMetrics: AdminMetrics = {
  totalRevenue: 287450.8,
  totalOrders: 1243,
  averageTicket: 231.26,
  totalCustomers: 856,

  revenueByMonth: [
    { month: 'Jan/2026', revenue: 18920.5 },
    { month: 'Fev/2026', revenue: 21345.0 },
    { month: 'Mar/2026', revenue: 25780.3 },
    { month: 'Abr/2026', revenue: 22150.9 },
    { month: 'Mai/2026', revenue: 24600.2 },
    { month: 'Jun/2026', revenue: 19870.4 },
    { month: 'Jul/2026', revenue: 27350.1 },
    { month: 'Ago/2026', revenue: 26480.7 },
    { month: 'Set/2026', revenue: 23190.5 },
    { month: 'Out/2026', revenue: 28750.3 },
    { month: 'Nov/2026', revenue: 32540.8 },
    { month: 'Dez/2026', revenue: 36472.1 },
  ],

  topProducts: [
    { name: 'Essência Adalya Double Apple', quantity: 342, revenue: 10225.8 },
    { name: 'Seda RAW Classic King Size', quantity: 520, revenue: 4108.0 },
    { name: 'Essência Al Fakher Peach', quantity: 298, revenue: 7420.2 },
    { name: 'Isqueiro Clipper Classic', quantity: 445, revenue: 7075.5 },
    { name: 'Essência Fumari White Grape', quantity: 215, revenue: 9653.5 },
    { name: 'Narguilé Triton Zip', quantity: 87, revenue: 16521.3 },
    { name: 'Essência Adalya Mint', quantity: 276, revenue: 8252.4 },
    { name: 'Pueblo Classic', quantity: 189, revenue: 7541.1 },
    { name: 'Grinder de Metal 4 Partes', quantity: 156, revenue: 7784.4 },
    { name: 'Isqueiro BIC Maxi', quantity: 380, revenue: 6422.0 },
  ],

  ordersByMode: [
    { mode: 'B2C', count: 876 },
    { mode: 'B2B', count: 367 },
  ],

  lowStockProducts: [
    { id: 'nar-005', name: 'Narguilé Regal Prince', stock: 8 },
    { id: 'nar-004', name: 'Narguilé Moze Breeze Two', stock: 3 },
    { id: 'tab-004', name: 'Golden Virginia Original', stock: 5 },
    { id: 'isq-004', name: 'Isqueiro Zippo Black Matte', stock: 7 },
    { id: 'ess-004', name: 'Essência Tangiers Blueberry', stock: 9 },
  ],
}
