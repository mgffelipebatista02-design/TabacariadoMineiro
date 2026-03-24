'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Lock, Building2, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Pill } from '@/components/ui/pill'

type PersonType = 'cpf' | 'cnpj'

const schema = z
  .object({
    personType: z.enum(['cpf', 'cnpj']),
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
    telefone: z.string().min(10, 'Telefone inválido'),
    senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    confirmarSenha: z.string().min(1, 'Confirme a senha'),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    razaoSocial: z.string().optional(),
    inscricaoEstadual: z.string().optional(),
    nomeFantasia: z.string().optional(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })
  .refine((data) => data.personType !== 'cpf' || (data.cpf && data.cpf.length >= 11), {
    message: 'CPF inválido',
    path: ['cpf'],
  })
  .refine((data) => data.personType !== 'cnpj' || (data.cnpj && data.cnpj.length >= 14), {
    message: 'CNPJ inválido',
    path: ['cnpj'],
  })
  .refine((data) => data.personType !== 'cnpj' || (data.razaoSocial && data.razaoSocial.length >= 3), {
    message: 'Razão social obrigatória',
    path: ['razaoSocial'],
  })

type FormData = z.infer<typeof schema>

export default function CadastroPage() {
  const [personType, setPersonType] = useState<PersonType>('cpf')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { personType: 'cpf' },
  })

  function onSubmit() {
    setSuccess(true)
    reset()
    setTimeout(() => setSuccess(false), 4000)
  }

  function handleTypeChange(type: PersonType) {
    setPersonType(type)
    setValue('personType', type)
    setSuccess(false)
  }

  return (
    <div className="max-w-lg mx-auto mt-24 px-4 pb-16">
      <Card padding="lg">
        <h1 className="font-display text-2xl text-text-primary mb-6 text-center">Cadastro</h1>

        <div className="flex gap-2 justify-center mb-6">
          <Pill active={personType === 'cpf'} onClick={() => handleTypeChange('cpf')} type="button">
            Pessoa Física (CPF)
          </Pill>
          <Pill active={personType === 'cnpj'} onClick={() => handleTypeChange('cnpj')} type="button">
            Lojista (CNPJ)
          </Pill>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-status-success/10 border border-status-success/25 text-status-success rounded-[--radius-md] px-4 py-3 mb-4 text-sm">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Cadastro realizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            icon={<User className="h-4 w-4" />}
            error={errors.nome?.message}
            {...register('nome')}
          />
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            icon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            icon={<Phone className="h-4 w-4" />}
            error={errors.telefone?.message}
            {...register('telefone')}
          />

          {personType === 'cpf' && (
            <Input
              label="CPF"
              placeholder="000.000.000-00"
              error={errors.cpf?.message}
              {...register('cpf')}
            />
          )}

          <AnimatePresence mode="wait">
            {personType === 'cnpj' && (
              <motion.div
                key="cnpj-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 overflow-hidden"
              >
                <Input
                  label="CNPJ"
                  placeholder="00.000.000/0000-00"
                  icon={<Building2 className="h-4 w-4" />}
                  error={errors.cnpj?.message}
                  {...register('cnpj')}
                />
                <Input
                  label="Razão Social"
                  placeholder="Razão social da empresa"
                  error={errors.razaoSocial?.message}
                  {...register('razaoSocial')}
                />
                <Input
                  label="Inscrição Estadual"
                  placeholder="Inscrição estadual"
                  error={errors.inscricaoEstadual?.message}
                  {...register('inscricaoEstadual')}
                />
                <Input
                  label="Nome Fantasia"
                  placeholder="Nome fantasia"
                  error={errors.nomeFantasia?.message}
                  {...register('nomeFantasia')}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            icon={<Lock className="h-4 w-4" />}
            error={errors.senha?.message}
            {...register('senha')}
          />
          <Input
            label="Confirmar Senha"
            type="password"
            placeholder="Repita a senha"
            icon={<Lock className="h-4 w-4" />}
            error={errors.confirmarSenha?.message}
            {...register('confirmarSenha')}
          />

          <Button type="submit" fullWidth className="mt-2">
            Cadastrar
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Já tem conta?{' '}
          <Link href="/login" className="text-accent-amber hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  )
}
