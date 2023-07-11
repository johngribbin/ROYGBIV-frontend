export type Info = { alias: string; color: string }

export type Member = {
  name: string
  nameError?: string
  type: string
  destination: string
  destinationError?: string
  split: number
  splitError?: string
  percentage?: number
}

export type Offer = {
  offer_id: string
  active: boolean
  single_use: boolean
  bolt12: string
  used: boolean
}

export type Prism = {
  label: string
  bolt12?: string
  members: Member[]
  offer: Offer
}
