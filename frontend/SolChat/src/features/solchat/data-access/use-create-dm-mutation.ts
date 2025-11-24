import { getCreateDmInstructionAsync} from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { Address, address } from 'gill'

export function useCreateDmMutation({ account, formData }: { account: UiWalletAccount, formData: {userB: string} }) {
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  const userB = formData.userB as Address<string>
  const [first, second] = txSigner.address < userB
  ? [txSigner.address, userB]
  : [userB, txSigner.address];

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(await getCreateDmInstructionAsync({
          userA: txSigner,
          userB: userB,
          first: first,
          second: second
      }), txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: () => toast.error('Failed to run program'),
  })
}
