import { AnchorProvider, Program } from "@coral-xyz/anchor";
import SolchatIDL from "./solchat.json";
import type { Solchat } from "./solchat";

export { Solchat, SolchatIDL };

export function getSolchatProgram(provider: AnchorProvider) {
  return new Program(SolchatIDL as Solchat, provider);
}