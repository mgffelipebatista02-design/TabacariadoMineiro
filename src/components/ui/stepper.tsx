'use client'

import { cn } from '@/lib/utils'

export interface StepperProps {
  steps: string[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

function Stepper({ steps, currentStep, orientation = 'horizontal', className }: StepperProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-start' : 'flex-col items-start',
        className
      )}
    >
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isLast = index === steps.length - 1

        return (
          <div
            key={index}
            className={cn(
              'flex',
              isHorizontal ? 'flex-col items-center flex-1' : 'flex-row items-start',
              !isLast && !isHorizontal && 'mb-2'
            )}
          >
            <div
              className={cn(
                'flex',
                isHorizontal ? 'flex-row items-center w-full' : 'flex-col items-center'
              )}
            >
              {/* Step circle */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors duration-200',
                  isCompleted && 'border-accent-green bg-accent-green text-bg-primary',
                  isActive && 'border-accent-green text-accent-green bg-transparent',
                  !isCompleted && !isActive && 'border-border-default text-text-muted bg-transparent'
                )}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={cn(
                    'transition-colors duration-200',
                    isHorizontal
                      ? 'h-0.5 flex-1 mx-2'
                      : 'w-0.5 h-6 my-1',
                    isCompleted ? 'bg-accent-green' : 'bg-border-default'
                  )}
                />
              )}
            </div>

            {/* Step label */}
            <span
              className={cn(
                'text-xs font-medium transition-colors duration-200',
                isHorizontal ? 'mt-2 text-center' : 'ml-3 mt-1',
                isCompleted && 'text-accent-green',
                isActive && 'text-text-primary',
                !isCompleted && !isActive && 'text-text-muted'
              )}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export { Stepper }
