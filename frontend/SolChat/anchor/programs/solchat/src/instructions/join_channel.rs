use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn join_channel_internal(
    ctx: Context<JoinChannel>,
) -> Result<()> {
    let channel = &mut ctx.accounts.channel;

    require!(!channel.is_private, SolchatError::CannotJoinPrivateChannel);

    channel.member_count += 1;

    let user_profile = &mut ctx.accounts.user;
    user_profile.joined_channels += 1;

    let channel_member_user = &mut ctx.accounts.channel_member;
    channel_member_user.channel = channel.key();
    channel_member_user.user = ctx.accounts.user_authority.key();
    channel_member_user.permissions = ChannelPermission::Reader;
    channel_member_user.joined_at = Clock::get()?.unix_timestamp;
    channel_member_user.bump = ctx.bumps.channel_member;

    Ok(())
}

#[derive(Accounts)]
pub struct JoinChannel<'info> {
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
        init,
        payer = user_authority,
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), user_authority.key().as_ref()],
        bump,
        space = 8 + ChannelMember::INIT_SPACE,
    )]
    pub channel_member: Account<'info, ChannelMember>,
    pub system_program: Program<'info, System>,
}
