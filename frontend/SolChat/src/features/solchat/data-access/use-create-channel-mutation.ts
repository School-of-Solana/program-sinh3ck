import { getCreateChannelInstructionAsync } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'

export function useCreateChannelMutation({ account, formData }: { account: UiWalletAccount, formData: {name: string, isPrivate: boolean} }) {
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(await getCreateChannelInstructionAsync({
        authority: txSigner,
        name: formData.name,
        isPrivate: formData.isPrivate
      }), txSigner)
      // return await signAndSend(getCreateChannelInstruction({ programAddress: useSolchatProgramId }), txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })
}
