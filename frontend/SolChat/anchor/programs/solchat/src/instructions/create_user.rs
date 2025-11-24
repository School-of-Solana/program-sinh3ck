use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn create_user_internal(
    ctx: Context<CreateUser>,
    username: String,
) -> Result<()> {
    require!(username.len() <= USERNAME_LENGTH, SolchatError::UsernameTooLong);

    let user = &mut ctx.accounts.user_profile;
    user.authority = ctx.accounts.authority.key();
    user.username = username;
    user.joined_channels = 0;
    user.bump = ctx.bumps.user_profile;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        seeds = [USER_SEED.as_bytes(), authority.key().as_ref()],
        bump,
        space = 8 + UserProfile::INIT_SPACE,
    )]
    pub user_profile: Account<'info, UserProfile>,
    pub system_program: Program<'info, System>,
}
