use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn change_user_channel_permissions_internal(
    ctx: Context<ChangeUserChannelPermissions>,
    permission: ChannelPermission,
) -> Result<()> {
    let channel_authority_permissions = &ctx.accounts.channel_member_signer.permissions;

    require!(*channel_authority_permissions == ChannelPermission::Admin, SolchatError::InsufficientPermissions);

    let channel_member_user = &mut ctx.accounts.channel_member_user;
    channel_member_user.permissions = permission;

    Ok(())
}

#[derive(Accounts)]
pub struct ChangeUserChannelPermissions<'info> {
    pub channel_authority: Signer<'info>,
    /// CHECK: No checks are performed
    pub user_authority: UncheckedAccount<'info>,
    pub channel: Account<'info, Channel>,
    #[account(
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), channel_authority.key().as_ref()],
        bump,
    )]
    pub channel_member_signer: Account<'info, ChannelMember>,
    #[account(
        mut,
        constraint = channel_member_signer.key() != channel_member_user.key() @ SolchatError::CannotChangeOwnPermissions,
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), user_authority.key().as_ref()],
        bump,
    )]
    pub channel_member_user: Account<'info, ChannelMember>,
}
