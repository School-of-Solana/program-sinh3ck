import { getRemoveFromChannelInstructionAsync } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { Address } from 'gill'

export function useRemoveFromChannelMutation({ account, formData }: { account: UiWalletAccount, formData: { userAddress: Address, channelAddress: Address } }) {
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(await getRemoveFromChannelInstructionAsync({
        channelAuthority: txSigner,
        userAuthority: formData.userAddress,
        channel: formData.channelAddress,
      }), txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })
}
