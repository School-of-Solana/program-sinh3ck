use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn change_channel_settings_internal(
    ctx: Context<ChangeChannelSettings>,
    is_private: bool,
) -> Result<()> {
    let channel_authority_permissions = &ctx.accounts.channel_member.permissions;

    require!(
        matches!(
            channel_authority_permissions,
            ChannelPermission::Admin | ChannelPermission::ChangeSettings
        ),
        SolchatError::InsufficientPermissions
    );

    let channel = &mut ctx.accounts.channel;
    channel.is_private = is_private;

    Ok(())
}

#[derive(Accounts)]
pub struct ChangeChannelSettings<'info> {
    pub channel_authority: Signer<'info>,
    #[account(mut)]
    pub channel: Account<'info, Channel>,
    #[account(
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), channel_authority.key().as_ref()],
        bump,
    )]
    pub channel_member: Account<'info, ChannelMember>,
}
