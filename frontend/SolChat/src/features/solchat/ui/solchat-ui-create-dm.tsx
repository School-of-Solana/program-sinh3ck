import { UiWalletAccount } from '@wallet-ui/react'
import { useCreateDmMutation } from '../data-access/use-create-dm-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SolchatUiCreateDm({ account }: { account: UiWalletAccount }) {
  const [formData, setFormData] = useState({
    userB: ''
  })

  const createDmMutation = useCreateDmMutation({ account, formData })

  const handleSubmit = async () => {
    await createDmMutation.mutateAsync()
    setFormData({
      userB: '',
    })
  }

  return (
    <AppModal
      title='Create DM'
      submit={handleSubmit}
    >
      <div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='create-dm-userb'>User B</Label>
          <Input
            id='create-dm-userb'
            value={formData.userB}
            onChange={(e) => setFormData(prev => ({...prev, userB: e.target.value}))}
          />
        </div>
      </div>
    </AppModal>
  )
}
