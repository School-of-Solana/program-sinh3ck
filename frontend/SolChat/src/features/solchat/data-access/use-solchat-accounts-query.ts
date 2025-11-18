import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { useSolchatAccountsQueryKey } from './use-solchat-accounts-query-key'
import { useAnchorProvider } from '@/components/solana/solana-provider';
import { getSolchatProgram } from 'generated/helper';

export function useSolchatAccountsQuery() {
  const { client } = useSolana()
  const provider = useAnchorProvider();
  const program = getSolchatProgram(provider);
  

  return useQuery({
    queryKey: useSolchatAccountsQueryKey(),
    queryFn: async () => program.account.channel.all(),
  })
}