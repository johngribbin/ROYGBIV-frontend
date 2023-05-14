import { BehaviorSubject } from 'rxjs'
import type { Info, Prism } from './types'

export const modalState$ = new BehaviorSubject<'qr' | null>(null)

export const nodeInfo$ = new BehaviorSubject<Info | null>(null)

export const prisms$ = new BehaviorSubject<Prism[] | []>([])

export const bolt12$ = new BehaviorSubject<string>('')
