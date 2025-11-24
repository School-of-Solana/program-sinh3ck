import { getChangeChannelSettingsInstructionAsync } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { Address } from 'gill'

export function useChangeChannelSettingsMutation({ account, formData }: { account: UiWalletAccount, formData: {name: Address, isPrivate: boolean} }) {
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(await getChangeChannelSettingsInstructionAsync({
        channelAuthority: txSigner,
        channel: formData.name,
        isPrivate: formData.isPrivate
      }), txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })
}
