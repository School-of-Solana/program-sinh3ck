use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn create_channel_internal(
    ctx: Context<CreateChannel>,
    name: String,
    is_private: bool,
) -> Result<()> {
    require!(name.len() <= CHANNEL_LENGTH, SolchatError::ChannelNameTooLong);

    let channel = &mut ctx.accounts.channel;
    channel.authority = ctx.accounts.authority.key();
    channel.name = name;
    channel.is_private = is_private;
    channel.member_count = 1;
    channel.bump = ctx.bumps.channel;

    let channel_members = &mut ctx.accounts.channel_members;
    channel_members.channel = channel.key();
    channel_members.user = channel.authority.key();
    channel_members.permissions = ChannelPermission::Admin;
    channel_members.joined_at = Clock::get()?.unix_timestamp;
    channel_members.bump = ctx.bumps.channel_members;

    let message_metadata = &mut ctx.accounts.message_metadata;
    message_metadata.count = 0;
    message_metadata.emoji = "".to_string();
    message_metadata.bump = ctx.bumps.message_metadata;

    Ok(())
}

#[derive(Accounts)]
#[instruction(name: String)]
pub struct CreateChannel<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        seeds = [CHANNEL_SEED.as_bytes(), name.as_bytes()],
        bump,
        space = 8 + Channel::INIT_SPACE,
    )]
    pub channel: Account<'info, Channel>,
    #[account(
        init,
        payer = authority,
        seeds = [MEMBER_SEED.as_bytes(), channel.key().as_ref(), authority.key().as_ref()],
        bump,
        space = 8 + ChannelMember::INIT_SPACE,
    )]
    pub channel_members: Account<'info, ChannelMember>,
    #[account(
        init,
        payer = authority,
        seeds = [MC_SEED.as_bytes(), channel.key().as_ref()],
        bump,
        space = 8 + MessageMetadata::INIT_SPACE,
    )]
    pub message_metadata: Account<'info, MessageMetadata>,
    pub system_program: Program<'info, System>,
}
