import type { Member } from './types'

export type ParsedNodeAddress = {
  publicKey: string
  ip: string
  port?: number
}

export function parseNodeAddress(address: string): ParsedNodeAddress {
  try {
    const [publicKey, host] = address.split('@')
    const [ip, port] = host.split(':')
    return { publicKey, ip, port: port ? parseInt(port) : undefined }
  } catch (error) {
    return {
      publicKey: '',
      ip: '',
      port: undefined
    }
  }
}

export const nodePublicKeyRegex = /[0-9a-fA-F]{66}/
const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){4}$/
const domainRegex =
  /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/

export function validateParsedNodeAddress({ publicKey, ip, port }: ParsedNodeAddress): boolean {
  if (!publicKey || !ip) return false

  if (port && (port < 1 || port > 65535)) return false

  if (!publicKey.match(nodePublicKeyRegex)) return false

  if (!ip.match(ipRegex) && !ip.match(domainRegex) && ip !== 'localhost') return false

  return true
}

export function truncateValue(val: string, length = 9): string {
  return val.length <= length ? val : `${val.slice(0, length)}...${val.slice(-length)}`
}

/**
 *
 * @returns boolean indicating if write was successful
 */
export async function writeClipboardValue(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    return false
  }
}

export function addMemberPercentages(members: Member[]) {
  const allSplits = members.map((member) => member.split).reduce((a, b) => a + b)
  const updatedMembers = members.map((member) => {
    return {
      ...member,
      percentage: member.split ? (member.split / allSplits) * 100 : 0
    }
  })

  return [...updatedMembers]
}

export function shortenString(str: string, maxLength = 16) {
  if (str.length <= maxLength) {
    return str
  }

  const ellipsis = '...'
  const truncatedLength = maxLength - ellipsis.length

  const start = str.substring(0, Math.ceil(truncatedLength / 2))
  const end = str.substring(str.length - Math.floor(truncatedLength / 2))

  return start + ellipsis + end
}
