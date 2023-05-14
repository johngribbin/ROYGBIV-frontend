import { BehaviorSubject } from 'rxjs'
import type { Info, Prism } from './types'

export const connectionStatus$ = new BehaviorSubject<{
  data: 'disconnected' | 'connecting' | 'connected'
  loading?: boolean
  error?: string
}>({
  data: 'disconnected',
  loading: true
})

export const modalState$ = new BehaviorSubject<{
  data: 'qr' | null
  loading?: boolean
  error?: string
}>({
  data: null,
  loading: true
})

export const nodeInfo$ = new BehaviorSubject<{
  data: Info | null
  loading?: boolean
  error?: string
}>({
  data: null,
  loading: true
})

export const prisms$ = new BehaviorSubject<{
  data: Prism[] | []
  loading?: boolean
  error?: string
}>({
  data: [],
  loading: true
})

export const bolt12$ = new BehaviorSubject<{
  data: string
  loading?: boolean
  error?: string
}>({
  data: '',
  loading: true
})
