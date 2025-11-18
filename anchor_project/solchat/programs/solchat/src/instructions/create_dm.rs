use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn create_dm_internal(
    ctx: Context<CreateDM>,
    first: Pubkey,
    second: Pubkey,
) -> Result<()> {
    let user_a_key = ctx.accounts.user_a.key();
    let user_b_key = ctx.accounts.user_b.key();

    require!(user_a_key != user_b_key, SolchatError::CannotDMYourself);
    require!(user_a_key == first || user_a_key == second, SolchatError::SignerNotInPair);

    let (min_k, max_k) = if user_a_key < user_b_key {
        (user_a_key, user_b_key)
    } else {
        (user_b_key, user_a_key)
    };
    require!(first == min_k && second == max_k, SolchatError::InvalidPairOrdering);
    
    let dm_thread = &mut ctx.accounts.dm_thread;
    dm_thread.user_a = first;
    dm_thread.user_b = second;
    dm_thread.bump = ctx.bumps.dm_thread;

    let message_metadata = &mut ctx.accounts.message_metadata;
    message_metadata.count = 0;
    message_metadata.emoji = "".to_string();
    message_metadata.bump = ctx.bumps.message_metadata;

    Ok(())
}

#[derive(Accounts)]
#[instruction(first: Pubkey, second: Pubkey)]
pub struct CreateDM<'info> {
    #[account(mut)]
    pub user_a: Signer<'info>,
    /// CHECK: user_b is just a pubkey
    pub user_b: UncheckedAccount<'info>,
    #[account(
        seeds = [USER_SEED.as_bytes(), user_a.key().as_ref()],
        bump,
    )]
    pub user_a_profile: Account<'info, UserProfile>,
    #[account(
        seeds = [USER_SEED.as_bytes(), user_b.key().as_ref()],
        bump,
    )]
    pub user_b_profile: Account<'info, UserProfile>,
    #[account(
        init,
        payer = user_a,
        seeds = [DM_SEED.as_bytes(), first.as_ref(), second.as_ref()],
        bump,
        space = 8 + DMThread::INIT_SPACE,
    )]
    pub dm_thread: Account<'info, DMThread>,
    #[account(
        init,
        payer = user_a,
        seeds = [MC_SEED.as_bytes(), dm_thread.key().as_ref()],
        bump,
        space = 8 + MessageMetadata::INIT_SPACE,
    )]
    pub message_metadata: Account<'info, MessageMetadata>,
    pub system_program: Program<'info, System>,
}
