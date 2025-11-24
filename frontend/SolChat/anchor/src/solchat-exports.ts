// Here we export some useful types and functions for interacting with the Anchor program.
import { address } from 'gill'
import { SolanaClusterId } from '@wallet-ui/react'
import { SOLCHAT_PROGRAM_ADDRESS } from './client/js'
import SolchatIDL from '../target/idl/solchat.json'

// Re-export the generated IDL and type
export { SolchatIDL }

export * from './client/js'

export function getSolchatProgramId(cluster: SolanaClusterId) {
    switch (cluster) {
        case 'solana:devnet':
        case 'solana:testnet':
            return address('2sLSWFDEgyXYQgwRVeUsJ5RrPKtaJfacRMGrHiKTE4UT')
        case 'solana:mainnet':
        default:
            return SOLCHAT_PROGRAM_ADDRESS
    }
}