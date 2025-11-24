import { useGetProgramAccountQuery } from '@/features/solchat/data-access/use-get-program-account-query'
import { D_M_THREAD_DISCRIMINATOR, getDMThreadDecoder } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'

export function useGetDms({ account }: { account: UiWalletAccount }) {
  const query = useGetProgramAccountQuery()

  const filteredAccounts = query.data?.filter((account) => {
    const data = Buffer.from(account.account.data[0], 'base64')
    const discriminator = data.subarray(0, 8)
    return discriminator.equals(Buffer.from(D_M_THREAD_DISCRIMINATOR))
  })

  const decoder = getDMThreadDecoder();
  const decodedAccounts = filteredAccounts?.map((account) => ({
    address: account.pubkey,
    data: decoder.decode(Buffer.from(account.account.data[0], 'base64'))
  }))
  // console.log(decodedAccounts)

  return { query, decodedAccounts }
}
