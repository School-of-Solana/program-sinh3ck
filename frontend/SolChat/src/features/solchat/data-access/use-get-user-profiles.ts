import { useGetProgramAccountQuery } from '@/features/solchat/data-access/use-get-program-account-query'
import { getUserProfileDecoder, USER_PROFILE_DISCRIMINATOR } from '@project/anchor'

export function useGetUserProfiles() {
  const query = useGetProgramAccountQuery()

  const filteredAccounts = query.data?.filter((account) => {
    const data = Buffer.from(account.account.data[0], 'base64')
    const discriminator = data.subarray(0, 8)
    return discriminator.equals(Buffer.from(USER_PROFILE_DISCRIMINATOR))
  })

  const decoder = getUserProfileDecoder();
  const decodedAccounts = filteredAccounts?.map((account) => ({
    address: account.pubkey,
    data: decoder.decode(Buffer.from(account.account.data[0], 'base64'))
  }))
//   console.log(decodedAccounts)

  return { query, decodedAccounts }
}
