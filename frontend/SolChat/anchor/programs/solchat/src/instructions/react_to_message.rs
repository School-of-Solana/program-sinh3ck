use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn react_to_message_internal(
    ctx: Context<ReactToMessage>,
    emoji: String,
    _message_id: u32,
) -> Result<()> {
    require!(emoji.len() <= 32, SolchatError::InvalidEmoji);

    let author = &ctx.accounts.author;
    let parent = ctx.accounts.parent.try_borrow_data()?;
    let channel = Channel::try_deserialize(&mut parent.as_ref());
    let dm_thread = DMThread::try_deserialize(&mut parent.as_ref());

    if let Ok(_) = channel {
        if ctx.accounts.channel_member.is_none() {
            return Err(SolchatError::ChannelMemberAccountNotProvided.into());
        }
    } else if let Ok(dm_thread) = dm_thread {
        require!(author.key() == dm_thread.user_a || author.key() == dm_thread.user_b, SolchatError::InsufficientPermissions);
    } else {
        return Err(SolchatError::InvalidChannelOrDMThread.into());
    }

    let message_metadata = &mut ctx.accounts.message_metadata;
    require!(message_metadata.emoji.len() + emoji.len() <= REACTIONS_LENGTH, SolchatError::TooManyReactions);
    message_metadata.emoji.push_str(&emoji.to_owned());

    Ok(())
}

#[derive(Accounts)]
#[instruction(_emoji: String, messageid: u32)]
pub struct ReactToMessage<'info> {
    #[account(mut)]
    pub author: Signer<'info>,
    /// CHECK: Checks are made within the instruction logic
    pub parent: UncheckedAccount<'info>, // Channel or DMThread
    #[account(
        mut,
        seeds = [MC_SEED.as_bytes(), parent.key().as_ref()],
        bump
    )]
    pub message_metadata: Account<'info, MessageMetadata>,
    #[account(
        seeds = [MESSAGE_SEED.as_bytes(), parent.key().as_ref(), messageid.to_be_bytes().as_ref()],
        bump,
    )]
    pub message: Account<'info, Message>,
    #[account(
        seeds = [MEMBER_SEED.as_bytes(), parent.key().as_ref(), author.key().as_ref()],
        bump,
    )]
    pub channel_member: Option<Account<'info, ChannelMember>>,
}