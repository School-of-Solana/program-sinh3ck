use anchor_lang::prelude::*;

pub const USERNAME_LENGTH: usize = 20;
pub const CHANNEL_LENGTH: usize = 24;
pub const CONTENT_LENGTH: usize = 500;
pub const REACTIONS_LENGTH: usize = 32 * 5; // Max 5 reactions

pub const USER_SEED: &str = "_USER";
pub const CHANNEL_SEED: &str = "_CHANNEL";
pub const MEMBER_SEED: &str = "_MEMBER";
pub const DM_SEED: &str = "_DM";
pub const MESSAGE_SEED: &str = "_MESSAGE";
pub const MC_SEED: &str = "_MC";

#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub authority: Pubkey,    // user wallet
    #[max_len(USERNAME_LENGTH)]
    pub username: String,     // chosen handle
    pub joined_channels: u32, // optional count
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Channel {
    pub authority: Pubkey,    // creator
    #[max_len(CHANNEL_LENGTH)]
    pub name: String,
    pub is_private: bool,
    pub member_count: u32,
    pub bump: u8,
}

#[derive(AnchorDeserialize, AnchorSerialize, Clone, PartialEq, InitSpace)]
pub enum ChannelPermission {
    Admin,
    AddMember,
    RemoveMember,
    ChangeSettings,
    Reader,
}

#[account]
#[derive(InitSpace)]
pub struct ChannelMember {
    pub channel: Pubkey,
    pub user: Pubkey,
    pub permissions: ChannelPermission,
    pub joined_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct DMThread {
    pub user_a: Pubkey,
    pub user_b: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Message {
    pub author: Pubkey,
    pub parent: Pubkey, // channel or DM
    #[max_len(CONTENT_LENGTH)]
    pub content: String,
    pub timestamp: i64,
    pub reply_to: Option<Pubkey>, // message this is replying to
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct MessageMetadata {
    pub count: u32,
    #[max_len(REACTIONS_LENGTH)]
    pub emoji: String,
    pub bump: u8,
}

// #[account]
// #[derive(InitSpace)]
// pub struct Reaction {
//     pub message: Pubkey,
//     pub user: Pubkey,
//     #[max_len(EMOJI_LENGTH)]
//     pub emoji: String,
//     pub bump: u8,
// }
