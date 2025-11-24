import { UiWalletAccount } from '@wallet-ui/react'
import { useChangeChannelSettingsMutation } from '../data-access/use-change-channel-settings-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Address } from 'gill'
import { Button } from '@/components/ui/button'
import { SettingsIcon } from 'lucide-react'
import { ChannelPermission } from '@project/anchor'

export function SolchatUiChangeChannelSettings({ account, permissions, channelAddress, isPrivateChannel }: { account: UiWalletAccount, permissions: ChannelPermission | undefined, channelAddress: Address, isPrivateChannel: boolean }) {
  const [formData, setFormData] = useState({
    name: channelAddress,
    isPrivate: isPrivateChannel,
  })
  
  const changeChannelSettingsMutation = useChangeChannelSettingsMutation({ account, formData })

  const handleSubmit = async () => {
    await changeChannelSettingsMutation.mutateAsync()
  }

  return (
    <AppModal
      title='Change Channel'
      submit={handleSubmit}
      trigger={<Button variant="outline" size='icon' {...(permissions !== ChannelPermission.Admin && permissions !== ChannelPermission.ChangeSettings ? {disabled: true} : {})}><SettingsIcon /></Button>}
    >
      <div>
        <div className='flex flex-row gap-4'>
          <Label htmlFor='change-channel-is-private'>Private channel</Label>
          <Switch
            id='change-channel-is-private'
            checked={formData.isPrivate}
            onCheckedChange={(e) => setFormData(prev => ({...prev, isPrivate: e.valueOf()}))}
          />
        </div>
      </div>
    </AppModal>
  )
}
