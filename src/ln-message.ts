import Lnmessage from 'lnmessage'
import type { Info, Prism } from './types'
import { bolt12$, modalState$, nodeInfo$, prisms$ } from './streams'
import { parseNodeAddress } from './utils'

export let ln: Lnmessage
let rune: string

export async function connect(address: string, runeToken: string, websocketProxy: string) {
  const { publicKey, ip, port } = parseNodeAddress(address)
  rune = runeToken
  // https://github.com/aaronbarnardsound/lnmessage#initialisation
  ln = new Lnmessage({
    // The public key of the node you would like to connect to
    remoteNodePublicKey: publicKey,
    // WebSocket proxy endpoint to connect through if running in prod
    wsProxy: websocketProxy,
    // The IP address of the node
    ip,
    // The port of the node, defaults to 9735
    port,
    // Connect directly to a node without TLS
    wsProtocol: 'ws:',
    logger: {
      info: console.log,
      error: console.error,
      warn: console.warn
    }
  })

  // Initiate the connection to the remote node
  await ln.connect()
  // Fetch node info & prism list
  const nodeInfoResult = await request('getinfo')
  nodeInfo$.next(nodeInfoResult as Info)
  const prismsResult = await request('listprisms')
  prisms$.next(prismsResult as Prism[])
}

export async function request(method: string, params?: unknown): Promise<unknown> {
  console.log(
    `
  
  LN = 
  
  `,
    ln
  )

  try {
    const result = await ln.commando({
      method,
      params,
      rune
    })

    return result
  } catch (error) {
    const { message } = error as { message: string }
    console.log(message)
  }
}

export async function createPrism(prism: Prism) {
  const { label, members } = prism

  const params = {
    label,
    members: members.map((member) => ({
      name: member.name,
      destination: member.destination,
      split: member.split
    }))
  }

  console.log('PARAMS = ', params)

  try {
    const result = await request('createprism', params)
    bolt12$.next((result as { bolt12: string }).bolt12)
    modalState$.next('qr')
    const prismsResult = await request('listprisms')
    prisms$.next(prismsResult as Prism[])
  } catch (error) {
    console.error(error)
  }
}
