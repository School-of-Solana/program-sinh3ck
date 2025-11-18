import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useSolchatCreateChannelMutation } from '@/features/solchat/data-access/use-solchat-create-channel-mutation'

export function SolchatUiButtonCreateChannel({ account }: { account: UiWalletAccount }) {
  const mutationCreateChannel = useSolchatCreateChannelMutation({ account })

  return (
    <Button onClick={() => mutationCreateChannel.mutateAsync()} disabled={mutationCreateChannel.isPending}>
      Create Channel {mutationCreateChannel.isPending && '...'}
    </Button>
  )
}