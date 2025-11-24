use anchor_lang::prelude::*;

#[error_code]
pub enum SolchatError {
    #[msg("Username too long")]
    UsernameTooLong,
    #[msg("Channel name too long")]
    ChannelNameTooLong,
    #[msg("Insufficient Permissions")]
    InsufficientPermissions,
    #[msg("Cannot join private channel")]
    CannotJoinPrivateChannel,
    #[msg("Cannot change own permissions")]
    CannotChangeOwnPermissions,
    #[msg("Cannot DM yourself")]
    CannotDMYourself,
    #[msg("Signer not in provided pair")]
    SignerNotInPair,
    #[msg("Invalid pair ordering")]
    InvalidPairOrdering,
    #[msg("Invalid channel or DM thread")]
    InvalidChannelOrDMThread,
    #[msg("Channel member account not provided")]
    ChannelMemberAccountNotProvided,
    #[msg("Message content too long")]
    MessageContentTooLong,
    #[msg("Reply to message ID required")]
    ReplyToMessageIDRequired,
    #[msg("Invalid Emoji")]
    InvalidEmoji,
    #[msg("Too many reactions")]
    TooManyReactions,
}