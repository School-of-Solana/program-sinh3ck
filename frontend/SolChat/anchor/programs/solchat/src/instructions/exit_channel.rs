use anchor_lang::prelude::*;

use crate::state::*;

pub fn exit_channel_internal(
    ctx: Context<ExitChannel>,
) -> Result<()> {
    let channel = &mut ctx.accounts.channel;
    channel.member_count -= 1;

    let user_profile = &mut ctx.accounts.user;
    user_profile.joined_channels -= 1;

    Ok(())
}

#[derive(Accounts)]
pub struct ExitChannel<'info> {
    #[account(mut)]
    pub user_authority: Signer<'info>,
    #[account(
        mut,
        seeds = [USER_SEED.as_bytes(), user_authority.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, UserProfile>,
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(
        mut,
        close = user_authority,
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), user_authority.key().as_ref()],
        bump,
    )]
    pub channel_member: Account<'info, ChannelMember>,
    pub system_program: Program<'info, System>,
}
