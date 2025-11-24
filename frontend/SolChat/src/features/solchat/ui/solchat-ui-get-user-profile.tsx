import { UiWalletAccount } from '@wallet-ui/react'
import { useGetUserProfiles } from '../data-access/use-get-user-profiles';
import { SolchatUiCreateUserProfile } from './solchat-ui-create-user-profile';

export function SolchatUiGetUserProfile({ account }: { account: UiWalletAccount }) {
  const { query, decodedAccounts } = useGetUserProfiles();
  const ownAccount = decodedAccounts?.filter((decodedAccount) => {
    return decodedAccount.data.authority == account.address
  })[0]

  if (query.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  // if (!query.data?.length) {
  if (!ownAccount) {
    return (
      <SolchatUiCreateUserProfile account={account} />
    )
  }
  return (
    <div className={'space-y-6'}>
      <div>
        <h3>Username: <b>{ownAccount?.data.username}</b></h3>
      </div>
    </div>
  )
}
