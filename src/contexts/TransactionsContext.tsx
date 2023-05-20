import { ReactNode, createContext, useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface Transaction {
    id: number
    description: string
    type: 'income' | 'outcome'
    price: number
    category: string
    createdAt: string
}
interface TransactionsProviderProps {
    children: ReactNode
}

interface NewTransactionInputs {
    type: 'income' | 'outcome'
    category: string
    description: string
    price: number
}

interface TransactionContextType {
    transactions: Transaction[]
    getTransactions: (query?: string) => Promise<void>
    createTransaction: (data: NewTransactionInputs) => Promise<void>
}

export const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    async function getTransactions(query?: string) {
        const response = await api.get('/transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query,
            },
        })
        setTransactions(response.data)
    }

    async function createTransaction(data: NewTransactionInputs) {
        const { category, description, price, type } = data

        const response = await api.post('/transactions', {
            description,
            category,
            type,
            price,
            createdAt: new Date(),
        })

        setTransactions((state) => [...state, response.data])
    }

    useEffect(() => {
        getTransactions()
    }, [])

    return (
        <TransactionsContext.Provider value={{ transactions, getTransactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}
