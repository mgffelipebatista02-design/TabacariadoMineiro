'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn, formatBRL } from '@/lib/utils'
import { SHIPPING_OPTIONS } from '@/lib/constants'
import { useCart } from '@/hooks/use-cart'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const shippingSchema = z.object({
  cep: z.string().min(8, 'CEP obrigatório'),
  street: z.string().min(3, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  shippingMethod: z.string().min(1, 'Selecione um método de envio'),
})

type ShippingFormData = z.infer<typeof shippingSchema>

interface ShippingStepProps {
  onNext: () => void
  onBack: () => void
}

export function ShippingStep({ onNext, onBack }: ShippingStepProps) {
  const { setShipping } = useCart()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      shippingMethod: '',
    },
  })

  const cepValue = useWatch({ control, name: 'cep' })
  const selectedMethod = useWatch({ control, name: 'shippingMethod' })

  // Mock CEP autofill
  useEffect(() => {
    const cleanCep = (cepValue ?? '').replace(/\D/g, '')
    if (cleanCep.length === 8) {
      setValue('street', 'Rua das Flores')
      setValue('neighborhood', 'Centro')
      setValue('city', 'Belo Horizonte')
      setValue('state', 'MG')
    }
  }, [cepValue, setValue])

  const onSubmit = (data: ShippingFormData) => {
    const option = SHIPPING_OPTIONS.find((o) => o.id === data.shippingMethod)
    if (option) {
      setShipping(option.price)
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">Entrega</h2>
        <p className="text-sm text-text-secondary mt-1">Endereço e método de envio</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="CEP"
            placeholder="00000-000"
            inputMode="numeric"
            error={errors.cep?.message}
            {...register('cep')}
          />
          <div /> {/* spacer */}
        </div>

        <Input
          label="Rua"
          placeholder="Nome da rua"
          error={errors.street?.message}
          {...register('street')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Número"
            placeholder="Nº"
            error={errors.number?.message}
            {...register('number')}
          />
          <Input
            label="Complemento"
            placeholder="Apto, Bloco..."
            error={errors.complement?.message}
            {...register('complement')}
          />
        </div>

        <Input
          label="Bairro"
          placeholder="Bairro"
          error={errors.neighborhood?.message}
          {...register('neighborhood')}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Cidade"
            placeholder="Cidade"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="Estado"
            placeholder="UF"
            maxLength={2}
            error={errors.state?.message}
            {...register('state')}
          />
        </div>

        {/* Shipping method */}
        <div className="space-y-2 pt-2">
          <span className="text-sm font-medium text-text-secondary">Método de envio</span>
          {errors.shippingMethod && (
            <p className="text-xs text-status-error">{errors.shippingMethod.message}</p>
          )}
          <div className="space-y-2">
            {SHIPPING_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-center justify-between rounded-[--radius-lg] border p-3 transition-colors duration-200',
                  selectedMethod === option.id
                    ? 'border-accent-green bg-accent-green/5'
                    : 'border-border-default hover:border-border-hover bg-bg-input'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    value={option.id}
                    {...register('shippingMethod')}
                    className="accent-accent-green"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary">{option.name}</span>
                    <span className="text-xs text-text-muted">{option.days}</span>
                  </div>
                </div>
                <span className="font-mono text-sm font-semibold text-text-primary">
                  {formatBRL(option.price)}
                </span>
              </label>
            ))}
          </div>
        </div>

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
