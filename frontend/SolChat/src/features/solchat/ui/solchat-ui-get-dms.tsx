import { UiWalletAccount } from '@wallet-ui/react'
import { useGetDms } from '../data-access/use-get-dms'
import { DMUiCard } from './solchat-ui-dm-card';

export function SolchatUiGetDMs({ account }: { account: UiWalletAccount }) {
//   const { cluster } = useSolana()
  const { query, decodedAccounts } = useGetDms({account});
  const ownDms = decodedAccounts?.filter((decodedAccount) => {
    return decodedAccount.data.userA == account.address || decodedAccount.data.userB == account.address
  })

  if (query.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (ownDms?.length == 0) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>DMs</h2>
        No DMs found. Create one to get started.
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      <div className="text-center">
        <h2 className={'text-2xl'}>DMs</h2>
      </div>
      <div>
        {ownDms?.map((dm) => (
          <DMUiCard account={account} key={dm.address} data={dm} />
        ))}
      </div>
    </div>
  )
}
