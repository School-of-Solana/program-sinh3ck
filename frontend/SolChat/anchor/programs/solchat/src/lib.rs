// Stops Rust Analyzer complaining about missing configs
// See https://solana.stackexchange.com/questions/17777
#![allow(unexpected_cfgs)]

// Fix warning: use of deprecated method `anchor_lang::prelude::AccountInfo::<'a>::realloc`: Use AccountInfo::resize() instead
// See https://solana.stackexchange.com/questions/22979
#![allow(deprecated)]

use anchor_lang::prelude::*;
use crate::instructions::*;
use crate::state::ChannelPermission;

pub mod errors;
pub mod instructions;
pub mod state;

declare_id!("2sLSWFDEgyXYQgwRVeUsJ5RrPKtaJfacRMGrHiKTE4UT");

#[program]
pub mod solchat {
    use super::*;

    pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
        msg!("Create user!");

        create_user_internal(ctx, username)
    }

    pub fn create_channel(ctx: Context<CreateChannel>, name: String, is_private: bool) -> Result<()> {
        msg!("Create channel!");
        
        create_channel_internal(ctx, name, is_private)
    }

    pub fn invite_to_channel(ctx: Context<InviteToChannel>, permission: ChannelPermission) -> Result<()> {
        msg!("Invite to channel!");
        
        invite_to_channel_internal(ctx, permission)
    }

    pub fn remove_from_channel(ctx: Context<RemoveFromChannel>) -> Result<()> {
        msg!("Invite to channel!");
        
        remove_from_channel_internal(ctx)
    }

    pub fn join_channel(ctx: Context<JoinChannel>) -> Result<()> {
        msg!("Join channel!");
        
        join_channel_internal(ctx)
    }

    pub fn exit_channel(ctx: Context<ExitChannel>) -> Result<()> {
        msg!("Exit channel!");
        
        exit_channel_internal(ctx)
    }

    pub fn change_user_channel_permissions(ctx: Context<ChangeUserChannelPermissions>, permission: ChannelPermission) -> Result<()> {
        msg!("Change user channel permissions!");
        
        change_user_channel_permissions_internal(ctx, permission)
    }

    pub fn change_channel_settings(ctx: Context<ChangeChannelSettings>, is_private: bool) -> Result<()> {
        msg!("Change channel settings!");
        
        change_channel_settings_internal(ctx, is_private)
    }

    pub fn create_dm(ctx: Context<CreateDM>, first: Pubkey, second: Pubkey) -> Result<()> {
        msg!("Create DM!");
        
        create_dm_internal(ctx, first, second)
    }

    pub fn send_message(ctx: Context<SendMessage>, message_content: String, replytomessageid: Option<u32>) -> Result<()> {
        msg!("Send message!");
        
        send_message_internal(ctx, message_content, replytomessageid)
    }

    pub fn react_to_message(ctx: Context<ReactToMessage>, emoji: String, messageid: u32) -> Result<()> {
        msg!("React to message!");
        
        react_to_message_internal(ctx, emoji, messageid)
    }
}
