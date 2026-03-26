'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn, formatBRL } from '@/lib/utils'
import { adminMetrics } from '@/data/admin-metrics'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const CHART_COLORS = {
  primary: '#3A7D32',
  blue: '#3B82F6',
  green: '#22C55E',
  red: '#EF4444',
  gray: '#6B7280',
}

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.blue]

const periods = ['7d', '30d', '90d', '12m'] as const

const metricCards = [
  {
    label: 'Faturamento Total',
    value: adminMetrics.totalRevenue,
    format: 'currency' as const,
    trend: 12.5,
  },
  {
    label: 'Total de Pedidos',
    value: adminMetrics.totalOrders,
    format: 'number' as const,
    trend: 8.3,
  },
  {
    label: 'Ticket Médio',
    value: adminMetrics.averageTicket,
    format: 'currency' as const,
    trend: -2.1,
  },
  {
    label: 'Total de Clientes',
    value: adminMetrics.totalCustomers,
    format: 'number' as const,
    trend: 15.7,
  },
]

function formatMetricValue(value: number, format: 'currency' | 'number') {
  if (format === 'currency') return formatBRL(value)
  return value.toLocaleString('pt-BR')
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[--radius-md] bg-bg-card border border-border-default p-3 shadow-lg">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-mono text-text-primary">
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
          {entry.name}: {typeof entry.value === 'number' && entry.value > 100
            ? formatBRL(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<(typeof periods)[number]>('12m')

  const topProducts = adminMetrics.topProducts.slice(0, 8)

  return (
    <div className="space-y-6">
      {/* Period filter */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-text-primary">Dashboard</h2>
        <div className="flex gap-1 rounded-[--radius-lg] bg-bg-secondary p-1">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-[--radius-md] transition-colors',
                selectedPeriod === p
                  ? 'bg-accent-green text-bg-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.label} padding="lg">
            <p className="text-sm text-text-secondary mb-1">{metric.label}</p>
            <p className="font-mono text-2xl font-bold text-text-primary">
              {formatMetricValue(metric.value, metric.format)}
            </p>
            <div className="mt-2 flex items-center gap-1">
              {metric.trend >= 0 ? (
                <TrendingUp className="h-4 w-4 text-status-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-status-error" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  metric.trend >= 0 ? 'text-status-success' : 'text-status-error'
                )}
              >
                {metric.trend > 0 ? '+' : ''}
                {metric.trend}%
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue line chart */}
        <Card padding="lg">
          <h3 className="font-display text-base font-semibold text-text-primary mb-4">
            Faturamento Mensal
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={adminMetrics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C2D1A8" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#3D5228', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#C2D1A8' }}
                  tickFormatter={(v: string) => v.split('/')[0]}
                />
                <YAxis
                  tick={{ fill: '#3D5228', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#C2D1A8' }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Faturamento"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top products bar chart */}
        <Card padding="lg">
          <h3 className="font-display text-base font-semibold text-text-primary mb-4">
            Top Produtos
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#C2D1A8" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#3D5228', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#C2D1A8' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#3D5228', fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: '#C2D1A8' }}
                  width={130}
                  tickFormatter={(v: string) => v.length > 20 ? v.slice(0, 18) + '...' : v}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="quantity" name="Quantidade" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Orders by mode pie chart */}
        <Card padding="lg">
          <h3 className="font-display text-base font-semibold text-text-primary mb-4">
            Pedidos por Modo
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adminMetrics.ordersByMode}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="count"
                  nameKey="mode"
                  label={({ payload }: { payload?: { mode?: string; count?: number } }) => payload ? `${payload.mode}: ${payload.count}` : ''}
                  labelLine={false}
                >
                  {adminMetrics.ordersByMode.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  formatter={(value: string) => <span className="text-text-secondary text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Low stock alerts */}
        <Card padding="lg">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-accent-green" />
            <h3 className="font-display text-base font-semibold text-text-primary">
              Estoque Baixo
            </h3>
          </div>
          <div className="space-y-3">
            {adminMetrics.lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-[--radius-md] bg-bg-elevated p-3"
              >
                <span className="text-sm text-text-primary">{product.name}</span>
                <Badge variant={product.stock <= 5 ? 'red' : 'olive'}>
                  {product.stock} un.
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
