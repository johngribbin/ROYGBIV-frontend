import { BehaviorSubject } from 'rxjs'
import type { Prism } from './types'

export const modalState$ = new BehaviorSubject<'connect' | 'qr' | null>(null)

export const prisms$ = new BehaviorSubject<Prism[] | []>([])
