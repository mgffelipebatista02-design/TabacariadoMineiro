'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const senhaSchema = z
  .object({
    senhaAtual: z.string().min(1, 'Senha atual obrigatória'),
    novaSenha: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

type SenhaForm = z.infer<typeof senhaSchema>

export default function SenhaPage() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SenhaForm>({
    resolver: zodResolver(senhaSchema),
  })

  function onSubmit() {
    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div>
      <h2 className="font-display text-xl text-text-primary mb-4">
        Alterar Senha
      </h2>

      {success && (
        <div className="flex items-center gap-2 bg-status-success/10 border border-status-success/25 text-status-success rounded-[--radius-md] px-4 py-3 mb-4 text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Senha alterada com sucesso!
        </div>
      )}

      <Card padding="lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 max-w-md"
        >
          <Input
            label="Senha atual"
            type="password"
            placeholder="Digite a senha atual"
            icon={<Lock className="h-4 w-4" />}
            error={errors.senhaAtual?.message}
            {...register('senhaAtual')}
          />

          <Input
            label="Nova senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            icon={<Lock className="h-4 w-4" />}
            error={errors.novaSenha?.message}
            {...register('novaSenha')}
          />

          <Input
            label="Confirmar nova senha"
            type="password"
            placeholder="Repita a nova senha"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmarSenha?.message}
            {...register('confirmarSenha')}
          />

          <Button type="submit" className="mt-2 self-start">
            Alterar Senha
          </Button>
        </form>
      </Card>
    </div>
  )
}
