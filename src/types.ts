export type Info = { alias: string; color: string }

export type Member = {
  name: string
  nameError?: string
  destination: string
  destinationError?: string
  split: number
  splitError?: string
  percentage?: number
}

export type Prism = {
  label: string
  members: Member[]
}
