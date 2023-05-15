import Lnmessage from 'lnmessage'
import type { Info, Prism } from './types'
import { nodeInfo$, prisms$, connectionStatus$ } from './streams'
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

  try {
    connectionStatus$.next({
      data: 'connecting',
      loading: true
    })
    // Initiate the connection to the remote node
    await ln.connect()

    connectionStatus$.next({
      data: 'connected',
      loading: false
    })
  } catch (error) {
    connectionStatus$.next({
      data: 'disconnected',
      loading: false,
      error: String(error)
    })
  }
}

export async function request(method: string, params?: unknown): Promise<unknown> {
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

export async function getInfo() {
  try {
    nodeInfo$.next({
      data: null,
      loading: true
    })
    const result = (await request('getinfo')) as Info
    nodeInfo$.next({
      data: result,
      loading: false
    })
    return result
  } catch (error) {
    nodeInfo$.next({
      data: null,
      loading: false,
      error: String(error)
    })
  }
}

export async function listPrisms() {
  try {
    prisms$.next({
      data: [],
      loading: true
    })
    const result = (await request('listprisms')) as Prism[]
    prisms$.next({
      data: result,
      loading: false
    })
    return result
  } catch (error) {
    prisms$.next({
      data: [],
      loading: false,
      error: String(error)
    })
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

  try {
    const result = await request('createprism', params)
    return result as Prism
  } catch (error) {
    console.error(error)
  }
}
