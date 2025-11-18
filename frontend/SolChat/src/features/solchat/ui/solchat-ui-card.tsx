import { SolchatAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
// import { CounterUiButtonClose } from './counter-ui-button-close'
// import { CounterUiButtonDecrement } from './counter-ui-button-decrement'
// import { CounterUiButtonIncrement } from './counter-ui-button-increment'
// import { CounterUiButtonSet } from './counter-ui-button-set'

export function SolchatUiCard({ account, solchat }: { account: UiWalletAccount; solchat: SolchatAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solchat: {solchat.valueOf()}</CardTitle>
        <CardDescription>
          {/* Account: <AppExplorerLink address={solchat.address} label={ellipsify(solchat.address)} /> */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          {/* <CounterUiButtonIncrement account={account} counter={counter} />
          <CounterUiButtonSet account={account} counter={counter} />
          <CounterUiButtonDecrement account={account} counter={counter} />
          <CounterUiButtonClose account={account} counter={counter} /> */}
        </div>
      </CardContent>
    </Card>
  )
}