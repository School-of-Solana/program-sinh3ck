import { UiWalletAccount } from '@wallet-ui/react'
import { useJoinChannelMutation } from '../data-access/use-join-channel-mutation'
import { useState } from 'react'
import { AppModal } from '@/components/app-modal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Address } from 'gill'
import { useSendMessageMutation } from '../data-access/use-send-message-mutation'
import { Textarea } from '@/components/ui/textarea'

export function SolchatUiSendMessage({ account, channelAddress, isChannel }: { account: UiWalletAccount, channelAddress: Address, isChannel: boolean }) {
  const [formData, setFormData] = useState({
    parent_pubkey: channelAddress,
    message_content: '',
    isChannel: isChannel,
    reply_to_message_id: null
  })

  const sendMessageMutation = useSendMessageMutation({ account, formData })

  const handleSubmit = async () => {
    console.log(formData)
    await sendMessageMutation.mutateAsync()
    setFormData({
        ...formData,
        message_content: '',
        isChannel: isChannel,
        reply_to_message_id: null
      })
  }

  return (
    <div className='w-full max-w-xs space-y-2'>
      <Textarea 
        placeholder="Type your message here." 
        id="message"
        onChange={(e) => setFormData(prev => ({...prev, message_content: e.target.value}))}
      />
      <Button type='submit' variant='outline' onClick={handleSubmit}>Send Message</Button>
    </div>
  )
}
