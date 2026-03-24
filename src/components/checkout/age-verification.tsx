'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ageSchema = z
  .object({
    day: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => {
        const n = Number(v)
        return n >= 1 && n <= 31
      }, 'Dia inválido'),
    month: z
      .string()
      .min(1, 'Obrigatório')
      .refine((v) => {
        const n = Number(v)
        return n >= 1 && n <= 12
      }, 'Mês inválido'),
    year: z
      .string()
      .min(4, 'Ano inválido')
      .refine((v) => {
        const n = Number(v)
        return n >= 1900 && n <= new Date().getFullYear()
      }, 'Ano inválido'),
  })
  .refine(
    (data) => {
      const birth = new Date(Number(data.year), Number(data.month) - 1, Number(data.day))
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age >= 18
    },
    {
      message: 'Acesso restrito a maiores de 18 anos',
      path: ['year'],
    }
  )

type AgeFormData = z.input<typeof ageSchema>

interface AgeVerificationProps {
  onNext: () => void
}

export function AgeVerification({ onNext }: AgeVerificationProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgeFormData>({
    resolver: zodResolver(ageSchema),
  })

  const onSubmit = () => {
    onNext()
  }

  // Collect all error messages
  const rootError = errors.year?.message

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">
          Verificação de Idade
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Informe sua data de nascimento
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-3">
          <Input
            label="Dia"
            placeholder="DD"
            maxLength={2}
            inputMode="numeric"
            error={errors.day?.message}
            {...register('day')}
          />
          <Input
            label="Mês"
            placeholder="MM"
            maxLength={2}
            inputMode="numeric"
            error={errors.month?.message}
            {...register('month')}
          />
          <Input
            label="Ano"
            placeholder="AAAA"
            maxLength={4}
            inputMode="numeric"
            error={!errors.day && !errors.month ? rootError : undefined}
            {...register('year')}
          />
        </div>

        {rootError && rootError === 'Acesso restrito a maiores de 18 anos' && (
          <div className="rounded-[--radius-md] bg-status-error/10 border border-status-error/25 p-3">
            <p className="text-sm text-status-error font-medium">{rootError}</p>
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" size="lg" fullWidth>
            Continuar
          </Button>
        </div>
      </form>
    </div>
  )
}
