use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn remove_from_channel_internal(
    ctx: Context<RemoveFromChannel>,
) -> Result<()> {
    let channel_authority_permissions = &ctx.accounts.channel_member_signer.permissions;

    require!(
        matches!(
            channel_authority_permissions,
            ChannelPermission::Admin | ChannelPermission::RemoveMember
        ),
        SolchatError::InsufficientPermissions
    );

    let user_profile = &mut ctx.accounts.user;
    user_profile.joined_channels -= 1;

    let channel = &mut ctx.accounts.channel;
    channel.member_count -= 1;

    Ok(())
}

#[derive(Accounts)]
pub struct RemoveFromChannel<'info> {
    #[account(mut)]
    pub channel_authority: Signer<'info>,
    /// CHECK: No checks are performed
    pub user_authority: UncheckedAccount<'info>,
    #[account(
        mut,
        seeds = [USER_SEED.as_bytes(), user_authority.key().as_ref()],
        bump,
    )]
    pub user: Account<'info, UserProfile>,
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), channel_authority.key().as_ref()],
        bump,
    )]
    pub channel_member_signer: Account<'info, ChannelMember>,
    #[account(
        mut,
        close = channel_authority,
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), user_authority.key().as_ref()],
        bump,
    )]
    pub channel_member_user: Account<'info, ChannelMember>,
    pub system_program: Program<'info, System>,
}
