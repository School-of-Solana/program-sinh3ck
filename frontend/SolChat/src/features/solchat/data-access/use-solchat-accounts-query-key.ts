import { useSolana } from '@/components/solana/use-solana'

export function useSolchatAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['channel', 'all', { cluster }]
}