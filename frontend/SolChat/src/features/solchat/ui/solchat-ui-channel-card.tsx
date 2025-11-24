import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea';
import { Channel, ChannelPermission } from '@project/anchor';
import { UiWalletAccount } from '@wallet-ui/react';
import { Address } from 'gill';
import { HashIcon, LockIcon, LogOutIcon, SettingsIcon, UserMinusIcon, UserPenIcon, UserPlusIcon } from 'lucide-react';
import { SolchatUiJoinChannel } from './solchat-ui-join-channel';
import { Button } from '@/components/ui/button';
import { SolchatUiExitChannel } from './solchat-ui-exit-channel';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { SolchatUiChangeChannelSettings } from './solchat-ui-change-channel-settings';
import { SolchatUiChangeUserChannelPermissions } from './solchat-ui-change-user-channel-permissions';
import { AppExplorerLink } from '@/components/app-explorer-link';
import { ellipsify } from '@wallet-ui/react'
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { SolchatUiInviteToChannel } from './solchat-ui-invite-to-channel';
import { SolchatUiRemoveFromChannel } from './solchat-ui-remove-from-channel';
import { SolchatUiSendMessage } from './solchat-ui-send-message';
import { useGetMessages } from '../data-access/use-get-messages';
import { Message, MessageContent } from '@/components/ui/shadcn-io/ai/message';
import { useGetUserProfiles } from '../data-access/use-get-user-profiles';

export function ChannelUiCard({ account, data}: { account: UiWalletAccount, data: { address: Address, data: Channel, permissions: ChannelPermission | undefined }}) {
  const { query, decodedAccounts } = useGetMessages({account});
  const messages = decodedAccounts?.filter((decodedAccount) => {
    return decodedAccount.data.parent == data.address
  })

  const { query: query2, decodedAccounts: decodedAccounts2 } = useGetUserProfiles();
  const users = decodedAccounts2

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className='flex flex-row items-center gap-2'>
          {data.data.isPrivate ? (
            <LockIcon />
          ) : (
            <HashIcon />
          )}
          {data.data.name} (
            <AppExplorerLink address={data.address} label={ellipsify(data.address)} />
            <CopyButton 
              content={data.address}
              variant="secondary"
              size='sm'
            />
          )
        </CardTitle>
        <div>
          {data.permissions === undefined ? (
            null
          ) : (
            <div className='flex flex-row gap-3'>
              <SolchatUiInviteToChannel account={account} permissions={data.permissions} channelAddress={data.address} />
              <SolchatUiRemoveFromChannel account={account} permissions={data.permissions} channelAddress={data.address} />
              <SolchatUiChangeUserChannelPermissions account={account} permissions={data.permissions} channelAddress={data.address} />
              <Separator />
              <SolchatUiChangeChannelSettings account={account} permissions={data.permissions} channelAddress={data.address} isPrivateChannel={data.data.isPrivate} />
              <SolchatUiExitChannel account={account} permissions={data.permissions} channelAddress={data.address} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 justify-evenly">
          {messages?.map((m) => (
            <Message from={m.data.author == account.address ? 'user' : 'assistant'} key={m.address}>
              <MessageContent>{m.data.author == account.address ? 'You: ': (users?.find((user) => {return m.data.author == user.data.authority})?.data.username) + ': '}{m.data.content}</MessageContent>
            </Message>
          ))}
          {data.permissions === undefined ? (
            <div className='w-full text-center'>
              <SolchatUiJoinChannel account={account} channelAddress={data.address} />
            </div>
          ) : (
            <SolchatUiSendMessage account={account} channelAddress={data.address} isChannel={true} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}