import { getCreateUserInstructionAsync } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'

export function useCreateUserProfileMutation({ account, formData }: { account: UiWalletAccount, formData: { username: string } }) {
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(await getCreateUserInstructionAsync({
        authority: txSigner,
        username: formData.username
      }), txSigner)
      // return await signAndSend(getCreateChannelInstruction({ programAddress: useSolchatProgramId }), txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })
}
