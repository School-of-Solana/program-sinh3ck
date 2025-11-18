import { useSolana } from '@/components/solana/use-solana'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill'
import { generateKeyPairSigner } from 'gill'
import { getCreateChannelInstruction } from '@project/anchor'
import { toastTx } from '@/components/toast-tx'
import { toast } from 'sonner'
import { PublicKey } from '@solana/web3.js';
import { SOLCHAT_PROGRAM_ADDRESS } from '@project/anchor'
import { address } from 'gill';

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519()

export function useSolchatCreateChannelMutation({ account }: { account: UiWalletAccount }) {
  const { cluster } = useSolana()
  const queryClient = useQueryClient()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()
  const [channelPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('_CHANNEL'),
      Buffer.from('Engineering'),
    ], new PublicKey(SOLCHAT_PROGRAM_ADDRESS)
  );
  const [channelMembersPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('_MEMBER'),
      channelPda.toBuffer(),
      new PublicKey(signer.address).toBuffer(),
    ], new PublicKey(SOLCHAT_PROGRAM_ADDRESS)
  );
  const [messageDataPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('_MC'),
      channelPda.toBuffer(),
    ], new PublicKey(SOLCHAT_PROGRAM_ADDRESS)
  );

  return useMutation({
    mutationFn: async () => {
      //const counter = await generateKeyPairSigner()
      return await signAndSend(getCreateChannelInstruction({
        authority: signer,
        channel: address(channelPda.toString()),
        channelMembers: address(channelMembersPda.toString()),
        messageMetadata: address(messageDataPda.toString()),
        name: 'Engineering',
        isPrivate: false,
      }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      //await queryClient.invalidateQueries({ queryKey: ['counter', 'accounts', { cluster }] })
    },
    onError: (e) => {toast.error('Failed to run program')},
  })
}