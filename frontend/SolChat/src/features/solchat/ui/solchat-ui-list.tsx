import { SolchatUiCard } from './solchat-ui-card'
import { useSolchatAccountsQuery } from '@/features/solchat/data-access/use-solchat-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function SolchatUiList({ account }: { account: UiWalletAccount }) {
  const counterAccountsQuery = useSolchatAccountsQuery()

  if (counterAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!counterAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {counterAccountsQuery.data?.map((solchat) => (
        <SolchatUiCard account={account} key={solchat.address} solchat={solchat} />
      ))}
    </div>
  )
}