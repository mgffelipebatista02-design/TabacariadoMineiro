'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Send, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'

export default function FeedbackPage() {
  const params = useParams()
  const tokenPedido = params.tokenPedido as string

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0) return

    setSubmitting(true)
    // Mock submit
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-md w-full text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="p-3 bg-status-success/10 rounded-full">
              <CheckCircle className="h-10 w-10 text-status-success" />
            </div>
            <h2 className="font-display text-xl text-text-primary">
              Obrigado pela sua avaliacao!
            </h2>
            <p className="text-sm text-text-muted">
              Sua avaliacao foi registrada com sucesso. Agradecemos o seu
              feedback.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card padding="lg" className="max-w-md w-full">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-display text-xl text-text-primary mb-1">
              Avalie seu pedido
            </h2>
            <p className="text-sm text-text-muted">
              Pedido: <span className="font-mono">{tokenPedido}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">
                Sua nota
              </label>
              <StarRating value={rating} onChange={setRating} size="lg" />
              {rating === 0 && (
                <p className="text-xs text-text-muted">
                  Selecione uma nota de 1 a 5
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="comment"
                className="text-sm font-medium text-text-secondary"
              >
                Comentario (opcional)
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Conte-nos sobre sua experiencia..."
                className="w-full rounded-[--radius-md] bg-bg-input border border-border-default px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent-amber focus:outline-none focus:ring-1 focus:ring-accent-amber resize-none"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={submitting}
              disabled={rating === 0}
            >
              <Send className="h-4 w-4" />
              Enviar Avaliacao
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
