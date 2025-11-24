import { UiWalletAccount } from '@wallet-ui/react'
import { useJoinChannelMutation } from '../data-access/use-join-channel-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Address } from 'gill'

export function SolchatUiJoinChannel({ account, channelAddress }: { account: UiWalletAccount, channelAddress: Address }) {
  const formData = {
    channel: channelAddress.toString()
  }
  const joinChannelMutation = useJoinChannelMutation({ account, formData })

  const handleSubmit = async () => {
    await joinChannelMutation.mutateAsync()
  }

  return (
    <Button type="submit" variant="outline" onClick={handleSubmit}>
      Join Channel
    </Button>
  )
}
