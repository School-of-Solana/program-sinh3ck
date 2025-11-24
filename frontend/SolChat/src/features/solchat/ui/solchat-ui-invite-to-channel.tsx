import { UiWalletAccount } from '@wallet-ui/react'
import { useInviteToChannelMutation } from '../data-access/use-invite-to-channel-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Address } from 'gill'
import { Button } from '@/components/ui/button'
import { SettingsIcon, UserPenIcon, UserPlusIcon } from 'lucide-react'
import { ChannelPermission } from '@project/anchor'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@radix-ui/react-dropdown-menu'

export function SolchatUiInviteToChannel({ account, permissions, channelAddress }: { account: UiWalletAccount, permissions: ChannelPermission | undefined, channelAddress: Address }) {
  const [formData, setFormData] = useState({
    userAddress: '' as Address<string>,
    channelAddress: channelAddress,
    permissions: ChannelPermission.Reader
  })
  
  const inviteToChannelMutation = useInviteToChannelMutation({ account, formData })
  // console.log(permissions)

  const handleSubmit = async () => {
    // console.log(formData)
    await inviteToChannelMutation.mutateAsync()
    setFormData({
      ...formData,
      userAddress: '' as Address<string>,
      permissions: ChannelPermission.Reader
    })
  }

  return (
    <AppModal
      title='Invite User To Channel'
      submit={handleSubmit}
      trigger={<Button variant="outline" size='icon' {...(permissions !== ChannelPermission.Admin && permissions !== ChannelPermission.AddMember ? {disabled: true} : {})}><UserPlusIcon /></Button>}
    >
      <div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='invite-user-address'>User address</Label>
            <Input
              id='invite-user-address'
              value={formData.userAddress}
              onChange={(e) => setFormData(prev => ({...prev, userAddress: e.target.value as Address<string>}))}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='invite-user-new-permissions'>Permission level</Label>
            <Select
              defaultValue='Reader'
              onValueChange={(e: keyof typeof ChannelPermission) => setFormData(prev => ({...prev, permissions: ChannelPermission[e]}))}
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
