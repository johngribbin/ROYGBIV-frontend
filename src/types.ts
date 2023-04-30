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

export type Invoice = {
  /**
   * the amount required to pay this invoice
   */
  amount_msat?: number | string
  /**
   * the BOLT11 string (always present unless *bolt12* is)
   */
  bolt11?: string
  /**
   * the BOLT12 string (always present unless *bolt11* is)
   */
  bolt12?: string
  /**
   * description used in the invoice
   */
  description: string
  /**
   * UNIX timestamp of when it will become / became unpayable
   */
  expires_at: number
  /**
   * unique label supplied at invoice creation
   */
  label: string
  /**
   * the *id* of our offer which created this invoice (**experimental-offers** only).
   */
  local_offer_id?: string
  /**
   * the optional *payer_note* from invoice_request which created this invoice
   * (**experimental-offers** only).
   */
  payer_note?: string
  /**
   * the hash of the *payment_preimage* which will prove payment
   */
  payment_hash: string
  amount_received_msat?: string | number
  pay_index?: number
  paid_at?: number
  payment_preimage?: string
}
