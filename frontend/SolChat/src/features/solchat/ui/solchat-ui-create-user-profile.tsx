import { UiWalletAccount } from '@wallet-ui/react'
import { useCreateUserProfileMutation } from '../data-access/use-create-user-profile-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function SolchatUiCreateUserProfile({ account }: { account: UiWalletAccount }) {
  const [formData, setFormData] = useState({
    username: '',
  })

  const createUserProfileMutation = useCreateUserProfileMutation({ account, formData })

  const handleSubmit = async () => {
    await createUserProfileMutation.mutateAsync()
    setFormData({
      username: '',
    })
  }

  return (
    <AppModal
      title='Create User Profile'
      submit={handleSubmit}
    >
      <div>
        <div>
          <Label htmlFor='create-user-username'>Username</Label>
          <Input
            id='create-user-username'
            value={formData.username}
            onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
          />
        </div>
      </div>
    </AppModal>
  )
}
