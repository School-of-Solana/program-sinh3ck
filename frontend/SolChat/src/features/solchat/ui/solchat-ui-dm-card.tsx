import { AppExplorerLink } from '@/components/app-explorer-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea';
import { DMThread } from '@project/anchor';
import { UiWalletAccount } from '@wallet-ui/react';
import { Address } from 'gill';
import { MessageCircleIcon, MoveHorizontalIcon } from 'lucide-react';
import { ellipsify } from '@wallet-ui/react'
import { CopyButton } from '@/components/ui/shadcn-io/copy-button';
import { SolchatUiSendMessage } from './solchat-ui-send-message';
import { useGetMessages } from '../data-access/use-get-messages';
import { Message, MessageContent } from '@/components/ui/shadcn-io/ai/message';
import { useGetUserProfiles } from '../data-access/use-get-user-profiles';
import { M } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

export function DMUiCard({ account, data }: { account: UiWalletAccount; data: { address: Address, data: DMThread} }) {
  const { query, decodedAccounts } = useGetMessages({account});
  const messages = decodedAccounts?.filter((decodedAccount) => {
    return decodedAccount.data.parent == data.address
  }).sort((m1, m2) => {
    return (m1.data.timestamp === m2.data.timestamp) ? 0 : m1.data.timestamp > m2.data.timestamp ? 1 : -1
  })

    // console.log(decodedAccounts)

  const { query: query2, decodedAccounts: decodedAccounts2 } = useGetUserProfiles();
  const users = decodedAccounts2?.filter((decodedAccount) => {
    return decodedAccount.data.authority == data.data.userA || decodedAccount.data.authority == data.data.userB
  })
  console.log(users)
  const userA = data.data.userA == users![0].data.authority ? users![0] : users![1]
  const userB = data.data.userB == users![0].data.authority ? users![0] : users![1]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className='flex flex-row items-center gap-2'>
          <MessageCircleIcon />
          {userA.data.username}&nbsp;
          (
            <AppExplorerLink address={data.data.userA} label={ellipsify(data.data.userA)} />
            <CopyButton 
              content={data.data.userA}
              variant="secondary"
              size='sm'
            />
          )
          <MoveHorizontalIcon />
          {userB.data.username}&nbsp;
          (
            <AppExplorerLink address={data.data.userB} label={ellipsify(data.data.userB)} />
            <CopyButton 
              content={data.data.userB}
              variant="secondary"
              size='sm'
            />
          )
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 justify-evenly">
          {messages?.map((m) => (
            <Message from={m.data.author == account.address ? 'user' : 'assistant'} key={m.address}>
              <MessageContent>{m.data.author == account.address ? 'You: ': (m.data.author == userA.address ? userA.data.username : userB.data.username) + ': '}{m.data.content}</MessageContent>
            </Message>
          ))}
          <SolchatUiSendMessage account={account} channelAddress={data.address} isChannel={false} />
        </div>
      </CardContent>
    </Card>
  )
}