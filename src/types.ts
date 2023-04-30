export type Info = { alias: string; color: string }

export type Member = {
  name: string
  destination: string
  split: number
}

export type Prism = {
  label: string
  members: Member[]
}
