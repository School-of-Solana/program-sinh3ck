import { UiWalletAccount } from '@wallet-ui/react'
import { useExitChannelMutation } from '../data-access/use-exit-channel-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChannelPermission } from '@project/anchor'
import { Address } from 'gill'

export function SolchatUiExitChannel({ account, permissions, channelAddress }: { account: UiWalletAccount, permissions: ChannelPermission | undefined, channelAddress: Address }) {
  const formData = {
    channel: channelAddress.toString()
  }
  const exitChannelMutation = useExitChannelMutation({ account, formData })

  const handleSubmit = async () => {
    await exitChannelMutation.mutateAsync()
  }

  return (
    <AppModal
      title='Exit Channel'
      submit={handleSubmit}
      submitLabel='Yes'
      trigger={<Button variant="outline" size='icon' {...permissions === undefined ? {disabled: true} : {}}><LogOutIcon /></Button>}
    >
      <div>
        <div>
          Are you sure you want to exit this channel?
        </div>
      </div>
    </AppModal>
  )
}
