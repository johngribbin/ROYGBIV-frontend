import { BehaviorSubject } from 'rxjs'

export const modalState$ = new BehaviorSubject<'connect' | 'qr' | null>(null)
