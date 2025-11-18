# Project Description

**Deployed Frontend URL:** LINK (See Additional Notes for Evaluators below)

**Solana Program ID:** 2sLSWFDEgyXYQgwRVeUsJ5RrPKtaJfacRMGrHiKTE4UT (Devnet)

## Project Overview

### Description
Solchat is a decentralized on-chain messaging system built on Solana. It allows users to create public or private chat channels, automatically registers channel members, and stores metadata required for message handling. Each channel and membership record is represented by PDA-derived accounts, ensuring deterministic, secure ownership and preventing collisions.

This project demonstrates more advanced Solana concepts including multi-PDA account orchestration, private vs. public channel logic, member registration, message metadata storage, and authority-based permission validation.

Solchat forms the foundation for a decentralized chat application or community-driven discussion system, where channel data is provably stored and enforced by the program.

### Key Features
- Create User Profile
  - Users can their profile to be registered on Solchat.

- Create Channel
  - Users can create a new chat channel with a chosen name.
  - Channel accounts are derived via PDAs to ensure unique and deterministic identifiers.

- Public & Private Channels
  - Public channels can be listed and joined freely.
  - Private channels restrict access via roles.

- Channel Membership
  - A PDA account stores metadata for each channel-member pair.
  - When a new channel is created, the program automatically adds the creator as a member.

- Direct Messages
  - Instead of using channels, users can also interact between themselves via DM.

- Message Metadata Tracking
  - Each channel has a metadata PDA used for tracking message counters and future message-related operations (e.g., message count, indexing, or replies).

- Message Replies And Reactions
  - Each message on a channel or DM can have replies and reactions (emojis).

  
### How to Use the dApp

1. Connect Wallet: Connect your Solana wallet to authenticate and derive your member accounts.
2. Create your user profile.
3. Create a Channel: Provide a name and a flag to determine the channel's visibility.
4. Be invited to private channels or join public channels.
5. Start direct messages with other users.
6. Reply and react to messages in channels or DMs.


## Program Architecture
The Solchat program uses a multi-account architecture that splits user and channel identity and permissions, membership records, and message-related metadata into separate PDAs. This separation ensures scalability and avoids cross-channel data collisions.

Each instruction interacts with multiple PDAs simultaneously, emphasizing Solana development patterns such as:
- Zero-copy account deserialization
- Seed-validated access control
- Authority-validated write operations
- Deterministic account creation

### PDA Usage
Solchat heavily relies on PDA derivation to ensure uniqueness across the board, prevent unauthorized overwrites, and enforce per-member data records.

**PDAs Used**
- UserProfile PDA
    ```
    Seeds: ["_USER_", user_pubkey]
    ```

- Channel PDA
    ```
    Seeds: ["_CHANNEL", channel_name]
    ````

- ChannelMembers PDA
    ```
    Seeds: ["_MEMBER", channel_pubkey, member_wallet_pubkey]
    ````

- DMThread PDA
    ```
    Seeds: ["_DM", first_user_pubkey, second_user_pubkey]
    ```

- Message PDA
    ```
    Seeds: ["_MESSAGE", parent_pubkey, message_counter]
    ```

- MessageMetadata PDA
    ```
    Seeds: ["_MC", parent_pubkey]
    ```

### Program Instructions

- **create_user**: Creates a new user profile with the relevant user's public key. The user will be able to use the Solchat program.
- **⁠create_channel**: Creates a new channel account with its initial metadata and automatically registers the creator as the first member.
- **join_channel**: Join a public channel. The user will be able to send messages.
- **exit_channel**: Exits a channel. The user will no longer be able to send messages.
- **invite_to_channel**: Invites a user to a private channel. The invited user will be able to send messages. User roles are applied.
- **remove_from_channel**: Removes a user from a private channel. The removed user will no longer be able to send messages. User roles are no longer applied.
- **change_user_channel_permissions**: Changes the permissions of the user for a specific channel. User roles are applied.
- **change_channel_settings**: Changes the visibility settings of a channel. User roles are applied.
- **create_dm**: Start a DM thread with another user.
- **send_message**: Send message on a channel or through a DM.
- **react_to_message**: React to channel or DM messages with emojis.

### Account Structure

```rust
#[account]
#[derive(InitSpace)]
pub struct UserProfile {
    pub authority: Pubkey,
    #[max_len(USERNAME_LENGTH)]
    pub username: String,
    pub joined_channels: u32,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Channel {
    pub authority: Pubkey,
    #[max_len(CHANNEL_LENGTH)]
    pub name: String,
    pub is_private: bool,
    pub member_count: u32,
    pub bump: u8,
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
    pub reply_to: Option<Pubkey>,
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
```

## Testing

### Test Coverage
Comprehensive test suite covering all instructions with both successful operations and error conditions to ensure program security and reliability.

```
solchat
    Create User
      ✔ Create user successfully (475ms)
      ✔ Create second user successfully (467ms)
      ✔ FAIL: Create duplicate user
      ✔ FAIL: Create user with 20+ character username
      ✔ FAIL: Create user with wrong PDA
    Create Channel
      ✔ Create channel successfully (422ms)
      ✔ Create second channel successfully (460ms)
      ✔ Create third channel successfully with other user (472ms)
      ✔ FAIL: Create duplicate channel
      ✔ FAIL: Create channel with 24+ character name
      ✔ FAIL: Create channel with wrong channel members PDA
    Invite To Channel
      ✔ Invite to channel successfully as Admin (414ms)
      ✔ Invite to channel successfully as AddMember (926ms)
      ✔ FAIL: Invite to already joined channel
      ✔ FAIL: Invite to non-existing channel
      ✔ FAIL: Invite non-existing user profile to channel
      ✔ FAIL: Invite to channel without proper permissions (445ms)
    Join Channel
      ✔ Join channel successfully (448ms)
      ✔ FAIL: Join already joined channel
      ✔ FAIL: Join private channel
    Exit Channel
      ✔ Exit channel successfully (427ms)
      ✔ FAIL: Exit already exited channel
    Remove From Channel
      ✔ Remove from channel successfully (445ms)
      ✔ FAIL: Remove from already exited channel
    Change User Channel Permissions
      ✔ Change user channel permissions successfully (443ms)
      ✔ FAIL: Change user channel permissions without proper permissions
      ✔ FAIL: Change own user channel permissions
    Change Channel Settings
      ✔ Change channel settings successfully (433ms)
      ✔ FAIL: Change channel settings without proper permissions
    Create DM
      ✔ Create DM successfully (444ms)
      ✔ FAIL: Create DM with user with no profile
      ✔ FAIL: Create DM with unsorted pubkeys
      ✔ FAIL: Create already created DM
      ✔ FAIL: Create DM with yourself
      ✔ FAIL: Create DM with signer not in pair
    Send Message
      ✔ Send message in channel successfully (1341ms)
      ✔ Send message in DM successfully (1438ms)
      ✔ FAIL: Send message with 500+ characters
      ✔ FAIL: Send message reply with inexistent original message
      ✔ FAIL: Send message in channel without permissions
      ✔ FAIL: Send message in unowned DM
    React To Message
      ✔ React to message successfully (411ms)
      ✔ FAIL: React to message with too many emojis

43 passing (12s)
```

### Running Tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

Unfortunately, I was not able to finish and deploy the frontend app. React is too much of a steep learning curve for the time I have left. I solely implemented a button to create a channel to ensure it successfully interacts with the solana program deployed on Devnet. A channel is successfully created.