import { UiWalletAccount } from '@wallet-ui/react'
import { useChangeUserChannelPermissionsMutation } from '../data-access/use-change-user-channel-permissions-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Address } from 'gill'
import { Button } from '@/components/ui/button'
import { SettingsIcon, UserPenIcon } from 'lucide-react'
import { ChannelPermission } from '@project/anchor'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@radix-ui/react-dropdown-menu'

export function SolchatUiChangeUserChannelPermissions({ account, permissions, channelAddress }: { account: UiWalletAccount, permissions: ChannelPermission | undefined, channelAddress: Address }) {
  const [formData, setFormData] = useState({
    userAddress: '' as Address<string>,
    channelAddress: channelAddress,
    newPermissions: ChannelPermission.Reader
  })
  
  const changeChannelSettingsMutation = useChangeUserChannelPermissionsMutation({ account, formData })
  // console.log(permissions)

  const handleSubmit = async () => {
    // console.log(formData)
    await changeChannelSettingsMutation.mutateAsync()
    setFormData({
      ...formData,
      userAddress: '' as Address<string>,
      newPermissions: ChannelPermission.Reader
    })
  }

  return (
    <AppModal
      title='Change User Channel Permissions'
      submit={handleSubmit}
      trigger={<Button variant="outline" size='icon' {...permissions !== ChannelPermission.Admin? {disabled: true} : {}}><UserPenIcon /></Button>}
    >
      <div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='change-user-address'>User address</Label>
            <Input
              id='change-user-address'
              value={formData.userAddress}
              onChange={(e) => setFormData(prev => ({...prev, userAddress: e.target.value as Address<string>}))}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='change-user-new-permissions'>Permission level</Label>
            <Select
              defaultValue='Reader'
              onValueChange={(e: keyof typeof ChannelPermission) => setFormData(prev => ({...prev, newPermissions: ChannelPermission[e]}))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Permission level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="AddMember">AddMember</SelectItem>
                  <SelectItem value="RemoveMember">RemoveMember</SelectItem>
                  <SelectItem value="ChangeSettings">ChangeSettings</SelectItem>
                  <SelectItem value="Reader">Reader</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </AppModal>
  )
}
