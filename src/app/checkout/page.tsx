'use client'

import { useState } from 'react'
import { Stepper } from '@/components/ui/stepper'
import { Card } from '@/components/ui/card'
import { CartSummary } from '@/components/cart/cart-summary'
import { AgeVerification } from '@/components/checkout/age-verification'
import { Identification } from '@/components/checkout/identification'
import { ShippingStep } from '@/components/checkout/shipping-step'
import { PaymentStep } from '@/components/checkout/payment-step'
import { Confirmation } from '@/components/checkout/confirmation'

const STEPS = ['Idade', 'Identificação', 'Entrega', 'Pagamento', 'Confirmação']

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 0))

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AgeVerification onNext={goNext} />
      case 1:
        return <Identification onNext={goNext} onBack={goBack} />
      case 2:
        return <ShippingStep onNext={goNext} onBack={goBack} />
      case 3:
        return <PaymentStep onNext={goNext} onBack={goBack} />
      case 4:
        return <Confirmation />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-text-primary mb-6">Checkout</h1>

      {/* Stepper */}
      <Stepper steps={STEPS} currentStep={currentStep} className="mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          <Card padding="lg">{renderStep()}</Card>
        </div>

        {/* Sidebar */}
        {currentStep < 4 && (
          <div className="w-full lg:w-[360px] shrink-0">
            <div className="lg:sticky lg:top-24">
              <CartSummary condensed />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
