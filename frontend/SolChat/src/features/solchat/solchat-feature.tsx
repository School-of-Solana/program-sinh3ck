import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { SolchatUiButtonCreateChannel } from './ui/solchat-ui-button-create-channel.tsx'
import { SolchatUiList } from './ui/solchat-ui-list'
import { SolchatUiProgramExplorerLink } from './ui/solchat-ui-program-explorer-link'
import { SolchatUiProgramGuard } from './ui/solchat-ui-program-guard'

export default function SolchatFeature() {
  const { account } = useSolana()

  return (
    <SolchatUiProgramGuard>
      <AppHero
        title="Solchat"
        subtitle={
          account
            ? "Create a Solchat channel on chain"
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <SolchatUiProgramExplorerLink />
        </p>
        {account ? (
          <SolchatUiButtonCreateChannel account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <SolchatUiList account={account} /> : null}
    </SolchatUiProgramGuard>
  )
}