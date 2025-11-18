use anchor_lang::prelude::*;

use crate::errors::SolchatError;
use crate::state::*;

pub fn send_message_internal(
    ctx: Context<SendMessage>,
    message_content: String,
    _reply_to_message_id: Option<u32>,
) -> Result<()> {
    require!(message_content.len() <= CONTENT_LENGTH, SolchatError::MessageContentTooLong);

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
    message_metadata.count += 1;

    let message = &mut ctx.accounts.message;
    message.author = ctx.accounts.author.key();
    message.parent = ctx.accounts.parent.key();
    message.content = message_content;
    message.timestamp = Clock::get()?.unix_timestamp;
    message.reply_to = ctx.accounts.reply_to_message.clone().map(|msg| msg.key());
    message.bump = ctx.bumps.message;

    Ok(())
}

#[derive(Accounts)]
#[instruction(_message_content: String, reply_to_message_id: Option<u32>)]
pub struct SendMessage<'info> {
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
        init,
        payer = author,
        seeds = [MESSAGE_SEED.as_bytes(), parent.key().as_ref(), message_metadata.count.to_be_bytes().as_ref()],
        bump,
        space = 8 + Message::INIT_SPACE,
    )]
    pub message: Account<'info, Message>,
    #[account(
        seeds = [MEMBER_SEED.as_bytes(), parent.key().as_ref(), author.key().as_ref()],
        bump,
    )]
    pub channel_member: Option<Account<'info, ChannelMember>>,
    #[account(
        seeds = [MESSAGE_SEED.as_bytes(), parent.key().as_ref(), reply_to_message_id.clone().map_or_else(|| return Err(SolchatError::ReplyToMessageIDRequired), |msg_id| Ok(msg_id.to_be_bytes()))?.as_ref()],
        bump,
    )]
    pub reply_to_message: Option<Account<'info, Message>>,
    pub system_program: Program<'info, System>,
}
