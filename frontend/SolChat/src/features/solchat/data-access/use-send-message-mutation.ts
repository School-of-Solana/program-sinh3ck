import { fetchMessageMetadata, getSendMessageInstructionAsync, SOLCHAT_PROGRAM_ADDRESS } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { toastTx } from '@/components/toast-tx'
import { UiWalletAccount, useWalletUi, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { AccountMeta, Address, Endian, getAddressEncoder, getBytesEncoder, getProgramDerivedAddress, getU32Encoder } from 'gill'
import { expectAddress, expectSome } from 'anchor/src/client/js/generated/shared'
import { useSolana } from '@/components/solana/use-solana'

export function useSendMessageMutation({ account, formData }: { account: UiWalletAccount, formData: { parent_pubkey: Address, message_content: string, isChannel: boolean, reply_to_message_id: number | null } }) {
  const client = useSolana().client
  const txSigner = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  const programAddress = SOLCHAT_PROGRAM_ADDRESS;
  
  return useMutation({
    mutationFn: async () => {
      let message_data_address = await getProgramDerivedAddress({
        programAddress,
        seeds: [
            getBytesEncoder().encode(new Uint8Array([95, 77, 67])),
            getAddressEncoder().encode(expectAddress(formData.parent_pubkey)),
        ],
      });
      // console.log(message_data_address[0])
      const message_metadata = await fetchMessageMetadata(client.rpc, message_data_address[0])
      let message_address = await getProgramDerivedAddress({
        programAddress,
        seeds: [
            getBytesEncoder().encode(
            new Uint8Array([95, 77, 69, 83, 83, 65, 71, 69])
            ),
            getAddressEncoder().encode(expectAddress(formData.parent_pubkey)),
            getU32Encoder({endian: Endian.Big}).encode(message_metadata.data.count),
        ],
      });
      // console.log(message_address[0])
      let channel_address = undefined
      if (formData.isChannel) {
        [channel_address] = await getProgramDerivedAddress({
          programAddress,
          seeds: [
            getBytesEncoder().encode(new Uint8Array([95, 77, 69, 77, 66, 69, 82])),
            getAddressEncoder().encode(expectAddress(formData.parent_pubkey)),
            getAddressEncoder().encode(expectAddress(txSigner.address)),
          ],
        });
      }
      const ix = await getSendMessageInstructionAsync({
          author: txSigner,
          parent: formData.parent_pubkey,
          channelMember: channel_address,
          message: message_address[0],
          messageContent: formData.message_content,
          replytomessageid: null
      })

      console.log(ix)
      return await signAndSend(ix, txSigner)
    },
    onSuccess: (signature) => {
      toastTx(signature)
    },
    onError: (e) => toast.error('Failed to run program'),
  })
}
