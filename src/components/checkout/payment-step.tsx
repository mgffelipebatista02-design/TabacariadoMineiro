'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMode } from '@/hooks/use-mode'
import { PAYMENT_METHODS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PaymentStepProps {
  onNext: () => void
  onBack: () => void
}

const B2C_TAB_LABELS: Record<string, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  boleto: 'Boleto',
}

const B2B_TAB_LABELS: Record<string, string> = {
  pix: 'Pix',
  boleto_30: 'Boleto 30 dias',
  boleto_60: 'Boleto 60 dias',
  boleto_90: 'Boleto 90 dias',
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const { mode } = useMode()
  const methods = mode === 'b2b' ? PAYMENT_METHODS.b2b : PAYMENT_METHODS.b2c
  const labels = mode === 'b2b' ? B2B_TAB_LABELS : B2C_TAB_LABELS

  const [activeMethod, setActiveMethod] = useState<string>(methods[0])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = () => {
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary">Pagamento</h2>
        <p className="text-sm text-text-secondary mt-1">Selecione a forma de pagamento</p>
      </div>

      {/* Payment tabs */}
      <div className="flex flex-wrap gap-2">
        {methods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setActiveMethod(method)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-[--radius-md] border transition-colors duration-200',
              activeMethod === method
                ? 'border-accent-amber bg-accent-amber/10 text-accent-amber'
                : 'border-border-default text-text-secondary hover:border-border-hover hover:text-text-primary'
            )}
          >
            {labels[method]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Pix */}
        {activeMethod === 'pix' && (
          <Card padding="lg" className="flex flex-col items-center gap-4">
            <div className="h-48 w-48 rounded-[--radius-lg] border-2 border-border-default flex items-center justify-center bg-bg-elevated">
              <span className="text-sm text-text-muted font-mono">QR Code Pix</span>
            </div>
            <p className="text-sm text-text-secondary text-center">
              Escaneie o QR Code com o aplicativo do seu banco para realizar o pagamento.
            </p>
          </Card>
        )}

        {/* Card (B2C only) */}
        {activeMethod === 'cartao' && (
          <div className="space-y-4">
            <Input
              label="Número do Cartão"
              placeholder="0000 0000 0000 0000"
              inputMode="numeric"
              maxLength={19}
              error={errors.cardNumber?.message as string}
              {...register('cardNumber')}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Validade"
                placeholder="MM/AA"
                maxLength={5}
                error={errors.expiry?.message as string}
                {...register('expiry')}
              />
              <Input
                label="CVV"
                placeholder="000"
                inputMode="numeric"
                maxLength={4}
                error={errors.cvv?.message as string}
                {...register('cvv')}
              />
            </div>
            <Input
              label="Nome no Cartão"
              placeholder="Como impresso no cartão"
              error={errors.cardName?.message as string}
              {...register('cardName')}
            />
          </div>
        )}

        {/* Boleto (B2C) */}
        {activeMethod === 'boleto' && (
          <Card padding="lg" className="space-y-2">
            <p className="text-sm text-text-secondary">
              O boleto será gerado após a confirmação do pedido. O prazo de compensação é de até 3
              dias úteis.
            </p>
          </Card>
        )}

        {/* Boleto B2B variants */}
        {(activeMethod === 'boleto_30' ||
          activeMethod === 'boleto_60' ||
          activeMethod === 'boleto_90') && (
          <Card padding="lg" className="space-y-2">
            <p className="text-sm text-text-secondary">
              O boleto com vencimento em{' '}
              {activeMethod === 'boleto_30'
                ? '30'
                : activeMethod === 'boleto_60'
                  ? '60'
                  : '90'}{' '}
              dias será gerado após a confirmação do pedido.
            </p>
          </Card>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" size="lg" fullWidth>
            Confirmar Pagamento
          </Button>
        </div>
      </form>
    </div>
  )
}
