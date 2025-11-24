import { getSolchatProgramId, SOLCHAT_PROGRAM_ADDRESS } from '@project/anchor'
import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { useWalletUi } from '@wallet-ui/react'
import { useMemo } from 'react';

// export function useSolchatProgramId() {
//   const { cluster } = useWalletUi();

//   return useMemo(() => {return SOLCHAT_PROGRAM_ADDRESS})
// }

export function useGetProgramAccountQuery() {
  const { client, cluster } = useSolana()

  return useQuery({
    queryKey: ['accounts', { cluster }],
    queryFn: () => client.rpc.getProgramAccounts(SOLCHAT_PROGRAM_ADDRESS, {encoding: 'base64'}).send(),
  })
}
