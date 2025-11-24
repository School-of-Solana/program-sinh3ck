import { ChannelUiCard } from './solchat-ui-channel-card'
import { UiWalletAccount } from '@wallet-ui/react'
import { useGetChannels } from '../data-access/use-get-channels'
import { useGetChannelMembers } from '../data-access/use-get-channel-members';

export function SolchatUiGetChannels({ account }: { account: UiWalletAccount }) {
  const { query, decodedAccounts } = useGetChannels({account});
  
  const { query: query2, decodedAccounts: decodedAccounts2 } = useGetChannelMembers({account});
  const joinedChannels = decodedAccounts2?.filter((decodedAccount2) => {
    return decodedAccount2.data.user == account.address
  })

  const joinedChannelKeys = new Set(joinedChannels?.map((m) => m.data.channel) ?? []);

  const channelsList = decodedAccounts?.filter((channel) =>
    joinedChannelKeys.has(channel.address) || channel.data.isPrivate == false
  ).map((channel) => ({
    address: channel.address,
    data: channel.data,
    permissions: joinedChannels?.find((joinedChannel) => joinedChannel.data.channel == channel.address)?.data.permissions
  })).sort((channel1, channel2) => {
    return (channel1.data.isPrivate === channel2.data.isPrivate) ? 0 : channel1.data.isPrivate ? 1 : -1
  })

  // console.log(channelsList)

  if (query.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (channelsList?.length == 0) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>Channels</h2>
        No channels found. Create one to get started.
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      <div className="text-center">
        <h2 className={'text-2xl'}>Channels</h2>
      </div>
      <div>
        {channelsList?.map((channel) => (
          <ChannelUiCard account={account} key={channel.address} data={channel} />
        ))}
      </div>
    </div>
  )
}
