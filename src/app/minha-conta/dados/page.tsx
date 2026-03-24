'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCPF, formatCNPJ } from '@/lib/utils'

const dadosSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
})

type DadosForm = z.infer<typeof dadosSchema>

export default function DadosPage() {
  const { user } = useAuth()
  const customer = user.customer
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosForm>({
    resolver: zodResolver(dadosSchema),
    defaultValues: {
      nome: customer?.name || '',
      email: customer?.email || '',
      telefone: customer?.phone || '',
    },
  })

  function onSubmit() {
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!customer) return null

  const document =
    customer.type === 'b2c'
      ? { label: 'CPF', value: formatCPF(customer.cpf) }
      : { label: 'CNPJ', value: formatCNPJ(customer.cnpj) }

  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-4">
        Meus Dados
      </h2>

      {success && (
        <div className="flex items-center gap-2 bg-status-success/10 border border-status-success/25 text-status-success rounded-[--radius-md] px-4 py-3 mb-4 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Dados atualizados com sucesso!
        </div>
      )}

      <Card padding="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            error={errors.nome?.message}
            {...register('nome')}
          />

          <Input
            label="E-mail"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Telefone"
            error={errors.telefone?.message}
            {...register('telefone')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">
              {document.label}
            </label>
            <p className="flex h-10 w-full items-center rounded-[--radius-md] bg-bg-input border border-border-default px-3 text-sm text-text-muted cursor-not-allowed opacity-70">
              {document.value}
            </p>
          </div>

          {customer.type === 'b2b' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Razão Social
                </label>
                <p className="flex h-10 w-full items-center rounded-[--radius-md] bg-bg-input border border-border-default px-3 text-sm text-text-muted cursor-not-allowed opacity-70">
                  {customer.razaoSocial}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-secondary">
                  Nome Fantasia
                </label>
                <p className="flex h-10 w-full items-center rounded-[--radius-md] bg-bg-input border border-border-default px-3 text-sm text-text-muted cursor-not-allowed opacity-70">
                  {customer.nomeFantasia}
                </p>
              </div>
            </>
          )}

          <Button type="submit" className="mt-2 self-start">
            Salvar alterações
          </Button>
        </form>
      </Card>
    </div>
  )
}
