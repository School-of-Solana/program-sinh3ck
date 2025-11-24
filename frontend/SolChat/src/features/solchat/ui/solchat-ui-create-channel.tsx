import { UiWalletAccount } from '@wallet-ui/react'
import { useCreateChannelMutation } from '../data-access/use-create-channel-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function SolchatUiCreateChannel({ account }: { account: UiWalletAccount }) {
  const [formData, setFormData] = useState({
    name: '',
    isPrivate : false,
  })

  const createChannelMutation = useCreateChannelMutation({ account, formData })

  const handleSubmit = async () => {
    await createChannelMutation.mutateAsync()
    setFormData({
      name: '',
      isPrivate: false,
    })
  }

  return (
    <AppModal
      title='Create Channel'
      submit={handleSubmit}
    >
      <div>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='create-channel-name'>Channel Name</Label>
            <Input
              id='create-channel-name'
              value={formData.name}
              onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            />
          </div>
          <div className='flex flex-row gap-4'>
            <Label htmlFor='create-channel-is-private'>Private channel</Label>
            <Switch
              id='create-channel-is-private'
              checked={formData.isPrivate}
              onCheckedChange={(e) => setFormData(prev => ({...prev, isPrivate: e.valueOf()}))}
            />
          </div>
        </div>
      </div>
    </AppModal>
  )
}
