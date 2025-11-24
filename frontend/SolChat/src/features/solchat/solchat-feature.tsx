import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { SolchatUiProgramExplorerLink } from './ui/solchat-ui-program-explorer-link'
import { SolchatUiCreateChannel } from './ui/solchat-ui-create-channel'
import { SolchatUiGetChannels } from './ui/solchat-ui-get-channels'
import { SolchatUiGetUserProfile } from './ui/solchat-ui-get-user-profile'
import { SolchatUiGetDMs } from './ui/solchat-ui-get-dms'
import { SolchatUiCreateDm } from './ui/solchat-ui-create-dm'
import { SolchatUiJoinChannel } from './ui/solchat-ui-join-channel'

export default function SolchatFeature() {
  const { account } = useSolana()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletDropdown />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHero title="Solchat" subtitle={'Solchat'}>
        <p className="mb-6">
          <SolchatUiProgramExplorerLink />
        </p>
        <SolchatUiGetUserProfile account={account}/>
        <SolchatUiCreateChannel account={account} />
        <SolchatUiCreateDm account={account} />
      </AppHero>
      {/* <SolchatUiProgram /> */}
      <SolchatUiGetChannels account={account} />
      <br />
      <br />
      <SolchatUiGetDMs account={account} />
    </div>
  )
}
