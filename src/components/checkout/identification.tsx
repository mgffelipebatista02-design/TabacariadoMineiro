'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const cpfSchema = z.object({
  tipo: z.literal('cpf'),
  nome: z.string().min(3, 'Nome obrigatório'),
  cpf: z.string().min(11, 'CPF inválido').max(14),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
})

const cnpjSchema = z.object({
  tipo: z.literal('cnpj'),
  nome: z.string().min(3, 'Nome obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  razaoSocial: z.string().min(3, 'Razão social obrigatória'),
  inscricaoEstadual: z.string().min(1, 'Inscrição estadual obrigatória'),
  nomeFantasia: z.string().min(1, 'Nome fantasia obrigatório'),
})

const identificationSchema = z.discriminatedUnion('tipo', [cpfSchema, cnpjSchema])

type IdentificationData = z.infer<typeof identificationSchema>

interface IdentificationProps {
  onNext: () => void
  onBack: () => void
}

export function Identification({ onNext, onBack }: IdentificationProps) {
  const [tipo, setTipo] = useState<'cpf' | 'cnpj'>('cpf')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<IdentificationData>({
    resolver: zodResolver(identificationSchema),
    defaultValues: { tipo: 'cpf' } as Partial<IdentificationData>,
  })

  const handleToggle = (newTipo: 'cpf' | 'cnpj') => {
    setTipo(newTipo)
    reset({ tipo: newTipo } as Partial<IdentificationData>)
  }

  const onSubmit = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Identificação
        </h2>
        <p className="text-sm text-text-secondary mt-1">Preencha seus dados</p>
      </div>

      {/* Toggle CPF / CNPJ */}
      <div className="flex rounded-[--radius-lg] bg-bg-elevated p-1 w-fit">
        <button
          type="button"
          onClick={() => handleToggle('cpf')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-[--radius-md] transition-colors duration-200',
            tipo === 'cpf'
              ? 'bg-accent-amber text-bg-primary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          CPF
        </button>
        <button
          type="button"
          onClick={() => handleToggle('cnpj')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-[--radius-md] transition-colors duration-200',
            tipo === 'cnpj'
              ? 'bg-accent-amber text-bg-primary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          CNPJ
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('tipo')} />

        <Input
          label="Nome completo"
          placeholder="Seu nome"
          error={errors.nome?.message}
          {...register('nome')}
        />

        {tipo === 'cpf' ? (
          <Input
            label="CPF"
            placeholder="000.000.000-00"
            inputMode="numeric"
            error={(errors as Record<string, { message?: string }>).cpf?.message}
            {...register('cpf' as keyof IdentificationData)}
          />
        ) : (
          <Input
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            inputMode="numeric"
            error={(errors as Record<string, { message?: string }>).cnpj?.message}
            {...register('cnpj' as keyof IdentificationData)}
          />
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="email@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Telefone"
          placeholder="(00) 00000-0000"
          inputMode="tel"
          error={errors.telefone?.message}
          {...register('telefone')}
        />

        {/* CNPJ extra fields */}
        <AnimatePresence>
          {tipo === 'cnpj' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4"
            >
              <Input
                label="Razão Social"
                placeholder="Razão social da empresa"
                error={(errors as Record<string, { message?: string }>).razaoSocial?.message}
                {...register('razaoSocial' as keyof IdentificationData)}
              />
              <Input
                label="Inscrição Estadual"
                placeholder="Inscrição estadual"
                error={(errors as Record<string, { message?: string }>).inscricaoEstadual?.message}
                {...register('inscricaoEstadual' as keyof IdentificationData)}
              />
              <Input
                label="Nome Fantasia"
                placeholder="Nome fantasia"
                error={(errors as Record<string, { message?: string }>).nomeFantasia?.message}
                {...register('nomeFantasia' as keyof IdentificationData)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" size="lg" fullWidth>
            Continuar
          </Button>
        </div>
      </form>
    </div>
  )
}
