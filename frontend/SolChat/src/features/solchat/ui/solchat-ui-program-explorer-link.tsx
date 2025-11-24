// import { SOLCHAT_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'
import { SOLCHAT_PROGRAM_ADDRESS } from '@project/anchor'

export function SolchatUiProgramExplorerLink() {
  return <AppExplorerLink address={SOLCHAT_PROGRAM_ADDRESS} label={ellipsify(SOLCHAT_PROGRAM_ADDRESS)} />
}
