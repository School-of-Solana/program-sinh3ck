import { UiWalletAccount } from '@wallet-ui/react'
import { useRemoveFromChannelMutation } from '../data-access/use-remove-from-channel-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Address } from 'gill'
import { Button } from '@/components/ui/button'
import { SettingsIcon, UserMinusIcon, UserPenIcon, UserPlusIcon } from 'lucide-react'
import { ChannelPermission } from '@project/anchor'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@radix-ui/react-dropdown-menu'

export function SolchatUiRemoveFromChannel({ account, permissions, channelAddress }: { account: UiWalletAccount, permissions: ChannelPermission | undefined, channelAddress: Address }) {
  const [formData, setFormData] = useState({
    userAddress: '' as Address<string>,
    channelAddress: channelAddress,
  })
  
  const removeFromChannelMutation = useRemoveFromChannelMutation({ account, formData })

  const handleSubmit = async () => {
    // console.log(formData)
    await removeFromChannelMutation.mutateAsync()
    setFormData({
      ...formData,
      userAddress: '' as Address<string>,
    })
  }

  return (
    <AppModal
      title='Remove User From Channel'
      submit={handleSubmit}
      trigger={<Button variant="outline" size='icon' {...(permissions !== ChannelPermission.Admin && permissions !== ChannelPermission.RemoveMember ? {disabled: true} : {})}><UserMinusIcon /></Button>}
    >
      <div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='remove-user-address'>User address</Label>
            <Input
              id='remove-user-address'
              value={formData.userAddress}
              onChange={(e) => setFormData(prev => ({...prev, userAddress: e.target.value as Address<string>}))}
            />
          </div>
        </div>
      </div>
    </AppModal>
  )
}
