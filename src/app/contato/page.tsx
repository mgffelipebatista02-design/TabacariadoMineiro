'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(3, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function ContatoPage() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-status-success" />
        <h1 className="font-display text-2xl font-bold mb-2">Mensagem Enviada</h1>
        <p className="text-text-secondary">Retornaremos em até 48 horas úteis.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold mb-8">Contato</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card padding="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input label="Nome" error={errors.name?.message} {...register('name')} />
              <Input
                label="E-mail"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input label="Assunto" error={errors.subject?.message} {...register('subject')} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Mensagem
                </label>
                <textarea
                  className="w-full rounded-[--radius-md] border border-border-default bg-bg-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber min-h-[120px] resize-y"
                  {...register('message')}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-status-error">{errors.message.message}</p>
                )}
              </div>
              <Button type="submit" loading={isSubmitting}>
                Enviar Mensagem
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-4">
          <Card padding="md">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-accent-amber mt-0.5" />
              <div>
                <p className="font-medium text-sm">E-mail</p>
                <p className="text-text-secondary text-sm">contato@tabacariadomineiro.com.br</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-accent-amber mt-0.5" />
              <div>
                <p className="font-medium text-sm">Telefone</p>
                <p className="text-text-secondary text-sm">(31) 3000-0000</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-accent-amber mt-0.5" />
              <div>
                <p className="font-medium text-sm">Endereço</p>
                <p className="text-text-secondary text-sm">
                  Belo Horizonte — MG
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
