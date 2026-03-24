'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Customer, CustomerB2C, CustomerB2B, UserProfile } from '@/types'

interface AuthContextValue {
  user: UserProfile
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'tabacaria-auth'

const MOCK_USERS: { email: string; password: string; customer: Customer; role: UserProfile['role'] }[] = [
  {
    email: 'cliente@email.com',
    password: '123456',
    role: 'b2c',
    customer: {
      id: 'cust-b2c-001',
      type: 'b2c',
      name: 'João Silva',
      email: 'cliente@email.com',
      phone: '(31) 99999-0001',
      cpf: '12345678900',
      addresses: [
        {
          id: 'addr-001',
          label: 'Casa',
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Savassi',
          city: 'Belo Horizonte',
          state: 'MG',
          cep: '30130000',
          isDefault: true,
        },
      ],
      createdAt: '2024-01-15T10:00:00Z',
    } satisfies CustomerB2C,
  },
  {
    email: 'lojista@email.com',
    password: '123456',
    role: 'b2b',
    customer: {
      id: 'cust-b2b-001',
      type: 'b2b',
      name: 'Maria Souza',
      email: 'lojista@email.com',
      phone: '(31) 99999-0002',
      cnpj: '12345678000199',
      razaoSocial: 'Souza Tabacaria Ltda',
      inscricaoEstadual: '0012345678',
      nomeFantasia: 'Tabacaria da Maria',
      approved: true,
      priceGroup: 'standard',
      addresses: [
        {
          id: 'addr-002',
          label: 'Loja',
          street: 'Av. Afonso Pena',
          number: '4000',
          complement: 'Loja 12',
          neighborhood: 'Mangabeiras',
          city: 'Belo Horizonte',
          state: 'MG',
          cep: '30130001',
          isDefault: true,
        },
      ],
      createdAt: '2024-02-20T14:00:00Z',
    } satisfies CustomerB2B,
  },
  {
    email: 'admin@tabacaria.com',
    password: 'admin123',
    role: 'admin',
    customer: {
      id: 'cust-admin-001',
      type: 'b2c',
      name: 'Administrador',
      email: 'admin@tabacaria.com',
      phone: '(31) 99999-0000',
      cpf: '00000000000',
      addresses: [],
      createdAt: '2024-01-01T00:00:00Z',
    } satisfies CustomerB2C,
  },
]

const GUEST_PROFILE: UserProfile = {
  isAuthenticated: false,
  role: 'guest',
  customer: null,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(GUEST_PROFILE)
  const [isLoading, setIsLoading] = useState(true)

  // Hydrate session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored)
        if (parsed.isAuthenticated && parsed.customer) {
          setUser(parsed)
        }
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  // Persist session
  useEffect(() => {
    if (!isLoading) {
      if (user.isAuthenticated) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [user, isLoading])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (!found) {
      return false
    }

    setUser({
      isAuthenticated: true,
      role: found.role,
      customer: found.customer,
    })

    return true
  }, [])

  const logout = useCallback(() => {
    setUser(GUEST_PROFILE)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
