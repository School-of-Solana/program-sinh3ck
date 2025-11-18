import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solchat } from "../target/types/solchat";
import { PublicKey } from '@solana/web3.js';
import { assert } from "chai";

const USER_SEED = "_USER";
const CHANNEL_SEED = "_CHANNEL";
const MEMBER_SEED = "_MEMBER";
const DM_SEED = "_DM";
const MESSAGE_SEED = "_MESSAGE";
const MC_SEED = "_MC";

describe("solchat", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.solchat as Program<Solchat>;

  const alice = anchor.web3.Keypair.generate();
  const bob = anchor.web3.Keypair.generate();
  const charlie = anchor.web3.Keypair.generate();
  const dave = anchor.web3.Keypair.generate();
  const eve = anchor.web3.Keypair.generate();

  before("prepare", async () => {
    await airdrop(anchor.getProvider().connection, alice.publicKey);
    await airdrop(anchor.getProvider().connection, bob.publicKey);
    await airdrop(anchor.getProvider().connection, charlie.publicKey);
    await airdrop(anchor.getProvider().connection, dave.publicKey);
    await airdrop(anchor.getProvider().connection, eve.publicKey);
  });

  describe("Create User", async () => {
    it("Create user successfully", async () => {
      const username = "Alice";
      const [user_profile_pkey, user_profile_bump] = getUserProfileAddress(alice.publicKey, program.programId);
      
      await program.methods.createUser(username).accountsStrict(
        {
          authority: alice.publicKey,
          userProfile: user_profile_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        alice.publicKey,
        username,
        0,
        user_profile_bump,
      );
    });

    it("Create second user successfully", async () => {
      const username = "Bob";
      const [user_profile_pkey, user_profile_bump] = getUserProfileAddress(bob.publicKey, program.programId);
      
      await program.methods.createUser(username).accountsStrict(
        {
          authority: bob.publicKey,
          userProfile: user_profile_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        bob.publicKey,
        username,
        0,
        user_profile_bump,
      );
    });

    it("FAIL: Create duplicate user", async () => {
      const username = "Alice";
      const [user_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createUser(username).accountsStrict(
          {
            authority: alice.publicKey,
            userProfile: user_profile_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Creation of duplicate user should fail");
    });

    it("FAIL: Create user with 20+ character username", async () => {
      const username = "CharlieTooLongToEvenBeGood";
      const [user_profile_pkey, ] = getUserProfileAddress(charlie.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createUser(username).accountsStrict(
          {
            authority: charlie.publicKey,
            userProfile: user_profile_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([charlie]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "UsernameTooLong");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Creation of user with 20+ character username should fail");
    });

    it("FAIL: Create user with wrong PDA", async () => {
      const username = "Charlie";
      const [user_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createUser(username).accountsStrict(
          {
            authority: charlie.publicKey,
            userProfile: user_profile_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([charlie]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "ConstraintSeeds");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Creation of user with wrong PDA should fail");
    });
  });

  describe("Create Channel", async () => {
    it("Create channel successfully", async () => {
      const channel_name = "Engineering";
      const is_private_channel = true;
      const [channel_pkey, channel_bump] = getChannelAddress(channel_name, program.programId);
      const [channel_members_pkey, channel_members_bump] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(channel_pkey, program.programId);
      
      await program.methods.createChannel(channel_name, is_private_channel).accountsStrict(
        {
          authority: alice.publicKey,
          channel: channel_pkey,
          channelMembers: channel_members_pkey,
          messageMetadata: mm_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkChannel(
        program,
        channel_pkey,
        alice.publicKey,
        channel_name,
        is_private_channel,
        1,
        channel_bump,
      );

      await checkChannelMembers(
        program,
        channel_members_pkey,
        channel_pkey,
        alice.publicKey,
        "Admin",
        await getCurrentTimestamp(),
        channel_members_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        0,
        undefined,
        mm_bump,
      );
    });

    it("Create second channel successfully", async () => {
      const channel_name = "Human Resources";
      const is_private_channel = false;
      const [channel_pkey, channel_bump] = getChannelAddress(channel_name, program.programId);
      const [channel_members_pkey, channel_members_bump] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(channel_pkey, program.programId);
      
      await program.methods.createChannel(channel_name, is_private_channel).accountsStrict(
        {
          authority: alice.publicKey,
          channel: channel_pkey,
          channelMembers: channel_members_pkey,
          messageMetadata: mm_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkChannel(
        program,
        channel_pkey,
        alice.publicKey,
        channel_name,
        is_private_channel,
        1,
        channel_bump,
      );

      await checkChannelMembers(
        program,
        channel_members_pkey,
        channel_pkey,
        alice.publicKey,
        "Admin",
        await getCurrentTimestamp(),
        channel_members_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        0,
        undefined,
        mm_bump,
      );
    });

    it("Create third channel successfully with other user", async () => {
      const channel_name = "Sales";
      const is_private_channel = false;
      const [channel_pkey, channel_bump] = getChannelAddress(channel_name, program.programId);
      const [channel_members_pkey, channel_members_bump] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(channel_pkey, program.programId);
      
      await program.methods.createChannel(channel_name, is_private_channel).accountsStrict(
        {
          authority: bob.publicKey,
          channel: channel_pkey,
          channelMembers: channel_members_pkey,
          messageMetadata: mm_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkChannel(
        program,
        channel_pkey,
        bob.publicKey,
        channel_name,
        is_private_channel,
        1,
        channel_bump,
      );

      await checkChannelMembers(
        program,
        channel_members_pkey,
        channel_pkey,
        bob.publicKey,
        "Admin",
        await getCurrentTimestamp(),
        channel_members_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        0,
        undefined,
        mm_bump,
      );
    });

    it("FAIL: Create duplicate channel", async () => {
      const channel_name = "Engineering";
      const is_private_channel = true;
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_members_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(channel_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createChannel(channel_name, is_private_channel).accountsStrict(
          {
            authority: bob.publicKey,
            channel: channel_pkey,
            channelMembers: channel_members_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Creation of duplicate channel should fail");
    });

    it("FAIL: Create channel with 24+ character name", async () => {
      const channel_name = "TooLongOfAnUnnecessaryChannel";
      const is_private_channel = true;
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_members_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(channel_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createChannel(channel_name, is_private_channel).accountsStrict(
          {
            authority: bob.publicKey,
            channel: channel_pkey,
            channelMembers: channel_members_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "ChannelNameTooLong");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Creation of channel with 24+ character name should fail");
    });

    it("FAIL: Create channel with wrong channel members PDA", async () => {
      const channel_name = "Testing";
      const is_private_channel = true;
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_members_pkey, ] = getChannelMembersAddress(bob.publicKey, bob.publicKey, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(channel_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createChannel(channel_name, is_private_channel).accountsStrict(
          {
            authority: bob.publicKey,
            channel: channel_pkey,
            channelMembers: channel_members_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "ConstraintSeeds");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Creation of channel with wrong channel members PDA should fail");
    });
  });

  describe("Invite To Channel", async () => {
    it("Invite to channel successfully as Admin", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, channel_member_user_bump] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      await program.methods.inviteToChannel({addMember: {}}).accountsStrict(
        {
          channelAuthority: alice.publicKey,
          userAuthority: bob.publicKey,
          user: user_profile_pkey,
          channel: channel_pkey,
          channelMemberSigner: channel_member_signer_pkey,
          channelMemberUser: channel_member_user_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        undefined,
        undefined,
        1,
        undefined,
      );

      await checkChannel(
        program,
        channel_pkey,
        undefined,
        undefined,
        undefined,
        2,
        undefined,
      );

      await checkChannelMembers(
        program,
        channel_member_signer_pkey,
        channel_pkey,
        alice.publicKey,
        "Admin",
        undefined,
        undefined,
      );

      await checkChannelMembers(
        program,
        channel_member_user_pkey,
        channel_pkey,
        bob.publicKey,
        "AddMember",
        await getCurrentTimestamp(),
        channel_member_user_bump,
      );
    });

    it("Invite to channel successfully as AddMember", async () => {
      const username = "Charlie";
      const [user_profile_pkey, user_profile_bump] = getUserProfileAddress(charlie.publicKey, program.programId);
      
      await program.methods.createUser(username).accountsStrict(
        {
          authority: charlie.publicKey,
          userProfile: user_profile_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([charlie]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        charlie.publicKey,
        username,
        0,
        user_profile_bump,
      );

      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [channel_member_user_pkey, channel_member_user_bump] = getChannelMembersAddress(channel_pkey, charlie.publicKey, program.programId);

      await program.methods.inviteToChannel({reader: {}}).accountsStrict(
        {
          channelAuthority: bob.publicKey,
          userAuthority: charlie.publicKey,
          user: user_profile_pkey,
          channel: channel_pkey,
          channelMemberSigner: channel_member_signer_pkey,
          channelMemberUser: channel_member_user_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        undefined,
        undefined,
        1,
        undefined,
      );

      await checkChannel(
        program,
        channel_pkey,
        undefined,
        undefined,
        undefined,
        3,
        undefined,
      );

      await checkChannelMembers(
        program,
        channel_member_user_pkey,
        channel_pkey,
        charlie.publicKey,
        "Reader",
        await getCurrentTimestamp(),
        channel_member_user_bump,
      );
    });

    it("FAIL: Invite to already joined channel", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.inviteToChannel({addMember: {}}).accountsStrict(
          {
            channelAuthority: alice.publicKey,
            userAuthority: bob.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_user_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Invite to already joined channel should fail");
    });

    it("FAIL: Invite to non-existing channel", async () => {
      const channel_name = "NonExistingChannel";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.inviteToChannel({addMember: {}}).accountsStrict(
          {
            channelAuthority: alice.publicKey,
            userAuthority: bob.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_user_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "AccountNotInitialized");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Invite non-existing channel should fail");
    });

    it("FAIL: Invite non-existing user profile to channel", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, dave.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(dave.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.inviteToChannel({addMember: {}}).accountsStrict(
          {
            channelAuthority: alice.publicKey,
            userAuthority: dave.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_user_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "AccountNotInitialized");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Invite non-existing user profile to channel should fail");
    });
    
    it("FAIL: Invite to channel without proper permissions", async () => {
      const username = "Dave";
      const [user_profile_pkey, user_profile_bump] = getUserProfileAddress(dave.publicKey, program.programId);
      
      await program.methods.createUser(username).accountsStrict(
        {
          authority: dave.publicKey,
          userProfile: user_profile_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([dave]).rpc({ commitment: "confirmed" });

      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, charlie.publicKey, program.programId);
      const [channel_member_user_pkey, channel_member_user_bump] = getChannelMembersAddress(channel_pkey, dave.publicKey, program.programId);

      let should_fail = false;
      try {
        await program.methods.inviteToChannel({reader: {}}).accountsStrict(
          {
            channelAuthority: charlie.publicKey,
            userAuthority: dave.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_user_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([charlie]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InsufficientPermissions");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Invite to channel without proper permissions should fail");
    });
  });

  describe("Join Channel", async () => {
    it("Join channel successfully", async () => {
      const channel_name = "Human Resources";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, channel_member_bump] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      await program.methods.joinChannel().accountsStrict(
        {
          userAuthority: bob.publicKey,
          user: user_profile_pkey,
          channel: channel_pkey,
          channelMember: channel_member_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        undefined,
        undefined,
        2,
        undefined,
      );

      await checkChannel(
        program,
        channel_pkey,
        undefined,
        undefined,
        undefined,
        2,
        undefined,
      );

      await checkChannelMembers(
        program,
        channel_member_pkey,
        channel_pkey,
        bob.publicKey,
        "Reader",
        await getCurrentTimestamp(),
        channel_member_bump,
      );
    });

    it("FAIL: Join already joined channel", async () => {
      const channel_name = "Human Resources";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, channel_member_bump] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.joinChannel().accountsStrict(
          {
            userAuthority: bob.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMember: channel_member_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Join already joined channel should fail");
    });

    it("FAIL: Join private channel", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, channel_member_bump] = getChannelMembersAddress(channel_pkey, dave.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(dave.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.joinChannel().accountsStrict(
          {
            userAuthority: dave.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMember: channel_member_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([dave]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "CannotJoinPrivateChannel");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Join private channel should fail");
    });
  });

  describe("Exit Channel", async () => {
    it("Exit channel successfully", async () => {
      const channel_name = "Human Resources";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      await program.methods.exitChannel().accountsStrict(
        {
          userAuthority: bob.publicKey,
          user: user_profile_pkey,
          channel: channel_pkey,
          channelMember: channel_member_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        undefined,
        undefined,
        1,
        undefined,
      );

      await checkChannel(
        program,
        channel_pkey,
        undefined,
        undefined,
        undefined,
        1,
        undefined,
      );

      let should_fail = false;
      try {
        await program.account.channelMember.fetch(channel_member_pkey);
      } catch (error) {
        should_fail = true;
        assert.isTrue(error.message.includes("Account does not exist or has no data"), "Channel member account should be deleted after removal")
      }
      assert.strictEqual(should_fail, true, "Channel member should not exist after being removed");
    });

    it("FAIL: Exit already exited channel", async () => {
      const channel_name = "Human Resources";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.exitChannel().accountsStrict(
          {
            userAuthority: bob.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMember: channel_member_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Exit already exited channel should fail");
    });
  });

  describe("Remove From Channel", async () => {
    it("Remove from channel successfully", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, charlie.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(charlie.publicKey, program.programId);
      
      await program.methods.removeFromChannel().accountsStrict(
        {
          channelAuthority: alice.publicKey,
          userAuthority: charlie.publicKey,
          user: user_profile_pkey,
          channel: channel_pkey,
          channelMemberSigner: channel_member_signer_pkey,
          channelMemberUser: channel_member_user_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkUser(
        program,
        user_profile_pkey,
        undefined,
        undefined,
        0,
        undefined,
      );

      await checkChannel(
        program,
        channel_pkey,
        undefined,
        undefined,
        undefined,
        2,
        undefined,
      );

      let should_fail = false;
      try {
        await program.account.channelMember.fetch(channel_member_user_pkey);
      } catch (error) {
        should_fail = true;
        assert.isTrue(error.message.includes("Account does not exist or has no data"), "Channel member account should be deleted after removal")
      }
      assert.strictEqual(should_fail, true, "Channel member should not exist after being removed");
    });

    it("FAIL: Remove from already exited channel", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, charlie.publicKey, program.programId);
      const [user_profile_pkey, ] = getUserProfileAddress(charlie.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.removeFromChannel().accountsStrict(
          {
            channelAuthority: alice.publicKey,
            userAuthority: charlie.publicKey,
            user: user_profile_pkey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_user_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Remove from already exited channel should fail");
    });
  });

  describe("Change User Channel Permissions", async () => {
    it("Change user channel permissions successfully", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      
      await program.methods.changeUserChannelPermissions({reader: {}}).accountsStrict(
        {
          channelAuthority: alice.publicKey,
          userAuthority: bob.publicKey,
          channel: channel_pkey,
          channelMemberSigner: channel_member_signer_pkey,
          channelMemberUser: channel_member_user_pkey,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkChannelMembers(
        program,
        channel_member_user_pkey,
        undefined,
        undefined,
        "Reader",
        undefined,
        undefined,
      );
    });

    it("FAIL: Change user channel permissions without proper permissions", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [channel_member_user_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.changeUserChannelPermissions({reader: {}}).accountsStrict(
          {
            channelAuthority: bob.publicKey,
            userAuthority: alice.publicKey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_user_pkey,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InsufficientPermissions");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Change user channel permissions without proper permissions should fail");
    });

    it("FAIL: Change own user channel permissions", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_signer_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.changeUserChannelPermissions({reader: {}}).accountsStrict(
          {
            channelAuthority: alice.publicKey,
            userAuthority: alice.publicKey,
            channel: channel_pkey,
            channelMemberSigner: channel_member_signer_pkey,
            channelMemberUser: channel_member_signer_pkey,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "CannotChangeOwnPermissions");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Change own user channel permissions should fail");
    });
  });

  describe("Change Channel Settings", async () => {
    it("Change channel settings successfully", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      
      await program.methods.changeChannelSettings(false).accountsStrict(
        {
          channelAuthority: alice.publicKey,
          channel: channel_pkey,
          channelMember: channel_member_pkey,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkChannel(
        program,
        channel_pkey,
        undefined,
        undefined,
        false,
        undefined,
        undefined,
      );
    });

    it("FAIL: Change channel settings without proper permissions", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.changeChannelSettings(true).accountsStrict(
          {
            channelAuthority: bob.publicKey,
            channel: channel_pkey,
            channelMember: channel_member_pkey,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InsufficientPermissions");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Change channel settings without proper permissions should fail");
    });
  });

  describe("Create DM", async () => {
    it("Create DM successfully", async () => {
      const [user_a_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [user_b_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, dm_bump] = getDMThreadAddress(first, second, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      await program.methods.createDm(first, second).accountsStrict(
        {
          userA: alice.publicKey,
          userB: bob.publicKey,
          userAProfile: user_a_profile_pkey,
          userBProfile: user_b_profile_pkey,
          dmThread: dm_pkey,
          messageMetadata: mm_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });
      
      await checkDMThread(
        program,
        dm_pkey,
        first,
        second,
        dm_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        0,
        undefined,
        mm_bump
      );
    });

    it("FAIL: Create DM with user with no profile", async () => {
      const [user_a_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [user_b_profile_pkey, ] = getUserProfileAddress(eve.publicKey, program.programId);
      const [first, second] = sortPubkeys(alice.publicKey, eve.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createDm(first, second).accountsStrict(
          {
            userA: alice.publicKey,
            userB: eve.publicKey,
            userAProfile: user_a_profile_pkey,
            userBProfile: user_b_profile_pkey,
            dmThread: dm_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "AccountNotInitialized");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Create DM with user with no profile should fail");
    });

    it("FAIL: Create DM with unsorted pubkeys", async () => {
      const [user_a_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [user_b_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(second, first, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createDm(second, first).accountsStrict(
          {
            userA: alice.publicKey,
            userB: bob.publicKey,
            userAProfile: user_a_profile_pkey,
            userBProfile: user_b_profile_pkey,
            dmThread: dm_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InvalidPairOrdering");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Create DM with unsorted pubkeys should fail");
    });

    it("FAIL: Create already created DM", async () => {
      const [user_a_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [user_b_profile_pkey, ] = getUserProfileAddress(bob.publicKey, program.programId);
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createDm(first, second).accountsStrict(
          {
            userA: alice.publicKey,
            userB: bob.publicKey,
            userAProfile: user_a_profile_pkey,
            userBProfile: user_b_profile_pkey,
            dmThread: dm_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Create already created DM should fail");
    });

    it("FAIL: Create DM with yourself", async () => {
      const [user_a_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [user_b_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [first, second] = sortPubkeys(alice.publicKey, alice.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createDm(first, second).accountsStrict(
          {
            userA: alice.publicKey,
            userB: alice.publicKey,
            userAProfile: user_a_profile_pkey,
            userBProfile: user_b_profile_pkey,
            dmThread: dm_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "CannotDMYourself");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Create DM with yourself should fail");
    });

    it("FAIL: Create DM with signer not in pair", async () => {
      const [user_a_profile_pkey, ] = getUserProfileAddress(alice.publicKey, program.programId);
      const [user_b_profile_pkey, ] = getUserProfileAddress(charlie.publicKey, program.programId);
      const [first, second] = sortPubkeys(bob.publicKey, charlie.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.createDm(first, second).accountsStrict(
          {
            userA: alice.publicKey,
            userB: charlie.publicKey,
            userAProfile: user_a_profile_pkey,
            userBProfile: user_b_profile_pkey,
            dmThread: dm_pkey,
            messageMetadata: mm_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "SignerNotInPair");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Create DM with signer not in pair should fail");
    });
  });

  //TODO
  describe("Send Message", async () => {
    it("Send message in channel successfully", async () => {
      let message_content = "Hey, what's up?";
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member1_pkey, ] = getChannelMembersAddress(channel_pkey, alice.publicKey, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(channel_pkey, program.programId);
      const [message1_pkey, message1_bump] = getMessageAddress(channel_pkey, 0, program.programId);

      await program.methods.sendMessage(message_content, null).accountsStrict(
        {
          author: alice.publicKey,
          parent: channel_pkey,
          messageMetadata: mm_pkey,
          message: message1_pkey,
          channelMember: channel_member1_pkey,
          replyToMessage: null,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkMessage(
        program,
        message1_pkey,
        alice.publicKey,
        channel_pkey,
        message_content,
        await getCurrentTimestamp(),
        undefined,
        message1_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        1,
        undefined,
        mm_bump,
      );


      message_content = "Everything is good!";
      const [message2_pkey, message2_bump] = getMessageAddress(channel_pkey, 1, program.programId);
      const [channel_member2_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);

      await program.methods.sendMessage(message_content, null).accountsStrict(
        {
          author: bob.publicKey,
          parent: channel_pkey,
          messageMetadata: mm_pkey,
          message: message2_pkey,
          channelMember: channel_member2_pkey,
          replyToMessage: null,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkMessage(
        program,
        message2_pkey,
        bob.publicKey,
        channel_pkey,
        message_content,
        await getCurrentTimestamp(),
        undefined,
        message2_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        2,
        undefined,
        mm_bump,
      );


      message_content = "Could be better though!";
      const [message3_pkey, message3_bump] = getMessageAddress(channel_pkey, 2, program.programId);

      await program.methods.sendMessage(message_content, 1).accountsStrict(
        {
          author: bob.publicKey,
          parent: channel_pkey,
          messageMetadata: mm_pkey,
          message: message3_pkey,
          channelMember: channel_member2_pkey,
          replyToMessage: message2_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkMessage(
        program,
        message3_pkey,
        bob.publicKey,
        channel_pkey,
        message_content,
        await getCurrentTimestamp(),
        message2_pkey,
        message3_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        3,
        undefined,
        mm_bump,
      );
    });

    it("Send message in DM successfully", async () => {
      let message_content = "Hey, what's up?";
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [message1_pkey, message1_bump] = getMessageAddress(dm_pkey, 0, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(dm_pkey, program.programId);

      await program.methods.sendMessage(message_content, null).accountsStrict(
        {
          author: alice.publicKey,
          parent: dm_pkey,
          messageMetadata: mm_pkey,
          message: message1_pkey,
          channelMember: null,
          replyToMessage: null,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([alice]).rpc({ commitment: "confirmed" });

      await checkMessage(
        program,
        message1_pkey,
        alice.publicKey,
        dm_pkey,
        message_content,
        await getCurrentTimestamp(),
        undefined,
        message1_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        1,
        undefined,
        mm_bump,
      );

      message_content = "Everything is good!";
      const [message2_pkey, message2_bump] = getMessageAddress(dm_pkey, 1, program.programId);

      await program.methods.sendMessage(message_content, null).accountsStrict(
        {
          author: bob.publicKey,
          parent: dm_pkey,
          messageMetadata: mm_pkey,
          message: message2_pkey,
          channelMember: null,
          replyToMessage: null,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkMessage(
        program,
        message2_pkey,
        bob.publicKey,
        dm_pkey,
        message_content,
        await getCurrentTimestamp(),
        undefined,
        message2_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        2,
        undefined,
        mm_bump,
      );

      message_content = "Could be better though!";
      const [message3_pkey, message3_bump] = getMessageAddress(dm_pkey, 2, program.programId);

      await program.methods.sendMessage(message_content, 1).accountsStrict(
        {
          author: bob.publicKey,
          parent: dm_pkey,
          messageMetadata: mm_pkey,
          message: message3_pkey,
          channelMember: null,
          replyToMessage: message2_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkMessage(
        program,
        message3_pkey,
        bob.publicKey,
        dm_pkey,
        message_content,
        await getCurrentTimestamp(),
        message2_pkey,
        message3_bump,
      );

      await checkMessageMetadata(
        program,
        mm_pkey,
        3,
        undefined,
        mm_bump,
      );
    });

    it("FAIL: Send message with 500+ characters", async () => {
      const message_content = 'x'.repeat(501);
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [message1_pkey, ] = getMessageAddress(dm_pkey, 3, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.sendMessage(message_content, null).accountsStrict(
          {
            author: alice.publicKey,
            parent: dm_pkey,
            messageMetadata: mm_pkey,
            message: message1_pkey,
            channelMember: null,
            replyToMessage: null,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "MessageContentTooLong");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Send message with 500+ characters should fail");
    });

    it("FAIL: Send message reply with inexistent original message", async () => {
      const message_content = "Let's try this!";
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [message1_pkey, ] = getMessageAddress(dm_pkey, 3, program.programId);
      const [unknown_message_pkey, ] = getMessageAddress(dm_pkey, 10, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.sendMessage(message_content, 10).accountsStrict(
          {
            author: alice.publicKey,
            parent: dm_pkey,
            messageMetadata: mm_pkey,
            message: message1_pkey,
            channelMember: null,
            replyToMessage: unknown_message_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([alice]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "AccountNotInitialized");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Send message with 500+ characters should fail");
    });

    it("FAIL: Send message in channel without permissions", async () => {
      const message_content = "How are the sales?";
      const channel_name = "Sales";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member1_pkey, ] = getChannelMembersAddress(channel_pkey, charlie.publicKey, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(channel_pkey, program.programId);
      const [message1_pkey, ] = getMessageAddress(channel_pkey, 0, program.programId);

      let should_fail = false;
      try {
        await program.methods.sendMessage(message_content, null).accountsStrict(
          {
            author: charlie.publicKey,
            parent: channel_pkey,
            messageMetadata: mm_pkey,
            message: message1_pkey,
            channelMember: channel_member1_pkey,
            replyToMessage: null,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([charlie]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "AccountNotInitialized");
        should_fail = true;
      }
    });

    it("FAIL: Send message in unowned DM", async () => {
      const message_content = "Let's try this!";
      const [first, second] = sortPubkeys(alice.publicKey, bob.publicKey);
      const [dm_pkey, ] = getDMThreadAddress(first, second, program.programId);
      const [message1_pkey, ] = getMessageAddress(dm_pkey, 3, program.programId);
      const [mm_pkey, ] = getMessageMetadataAddress(dm_pkey, program.programId);
      
      let should_fail = false;
      try {
        await program.methods.sendMessage(message_content, 10).accountsStrict(
          {
            author: charlie.publicKey,
            parent: dm_pkey,
            messageMetadata: mm_pkey,
            message: message1_pkey,
            channelMember: null,
            replyToMessage: null,
            systemProgram: anchor.web3.SystemProgram.programId,
          }
        ).signers([charlie]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InsufficientPermissions");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Send message with 500+ characters should fail");
    });
  });

  describe("React To Message", async () => {
    it("React to message successfully", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(channel_pkey, program.programId);
      const [message1_pkey, message1_bump] = getMessageAddress(channel_pkey, 0, program.programId);
      const emoji1 = "\u2764\ufe0f"
      const emoji2 = "\u{1F60E}";

      await program.methods.reactToMessage(emoji1 + emoji2, 0).accountsStrict(
        {
          author: bob.publicKey,
          parent: channel_pkey,
          messageMetadata: mm_pkey,
          message: message1_pkey,
          channelMember: channel_member_pkey,
        }
      ).signers([bob]).rpc({ commitment: "confirmed" });

      await checkMessageMetadata(
        program,
        mm_pkey,
        0,
        emoji1 + emoji2,
        mm_bump,
      );
    });

    it("FAIL: React to message with too many emojis", async () => {
      const channel_name = "Engineering";
      const [channel_pkey, ] = getChannelAddress(channel_name, program.programId);
      const [channel_member_pkey, ] = getChannelMembersAddress(channel_pkey, bob.publicKey, program.programId);
      const [mm_pkey, mm_bump] = getMessageMetadataAddress(channel_pkey, program.programId);
      const [message1_pkey, message1_bump] = getMessageAddress(channel_pkey, 0, program.programId);
      const emoji1 = "\u2764\ufe0f".repeat(6);

      let should_fail = false;
      try {
        await program.methods.reactToMessage(emoji1, 0).accountsStrict(
          {
            author: bob.publicKey,
            parent: channel_pkey,
            messageMetadata: mm_pkey,
            message: message1_pkey,
            channelMember: channel_member_pkey,
          }
        ).signers([bob]).rpc({ commitment: "confirmed" });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, "InvalidEmoji");
        should_fail = true;
      }
      assert.strictEqual(should_fail, true, "Send message with 500+ characters should fail");
    });
  });
});


async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), "confirmed");
}

async function getCurrentTimestamp() {
  return anchor.getProvider().connection.getBlockTime(await anchor.getProvider().connection.getSlot());
}

function getUserProfileAddress(user: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(USER_SEED),
      user.toBuffer(),
    ], programID);
}

function getChannelAddress(channel_name: string, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(CHANNEL_SEED),
      anchor.utils.bytes.utf8.encode(channel_name),
    ], programID);
}

function getChannelMembersAddress(channel: PublicKey, user: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(MEMBER_SEED),
      channel.toBuffer(),
      user.toBuffer(),
    ], programID);
}

function getDMThreadAddress(first: PublicKey, second: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(DM_SEED),
      first.toBuffer(),
      second.toBuffer(),
    ], programID);
}

function getMessageAddress(parent: PublicKey, counter: number, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(MESSAGE_SEED),
      parent.toBuffer(),
      new anchor.BN(counter).toArrayLike(Buffer, "be", 4),
    ], programID);
}

function getMessageMetadataAddress(channel_or_dm_thread: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode(MC_SEED),
      channel_or_dm_thread.toBuffer(),
    ], programID);
}

async function checkUser(
  program: anchor.Program<Solchat>,
  user: PublicKey,
  authority?: PublicKey,
  username?: string,
  joined_channels?: number,
  bump?: number,
) {
  let userData = await program.account.userProfile.fetch(user);

  if (authority) {
    assert.strictEqual(userData.authority.toString(), authority.toString(), `User authority should be ${authority.toString()} but was ${userData.authority.toString()}`);
  }
  if (username) {
    assert.strictEqual(userData.username.toString(), username.toString(), `Username should be ${username.toString()} but was ${userData.username.toString()}`);
  }
  if (joined_channels || joined_channels == 0) {
    assert.strictEqual(userData.joinedChannels.toString(), new anchor.BN(joined_channels).toString(), `Joined channels should be ${joined_channels} but was ${userData.joinedChannels.toString()}`);
  }
  if (bump) {
    assert.strictEqual(userData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${userData.bump}`);
  }
}

async function checkChannel(
  program: anchor.Program<Solchat>,
  channel: PublicKey,
  authority?: PublicKey,
  name?: string,
  is_private?: boolean,
  member_count?: number,
  bump?: number,
) {
  let channelData = await program.account.channel.fetch(channel);

  if (authority) {
    assert.strictEqual(channelData.authority.toString(), authority.toString(), `Channel authority should be ${authority.toString()} but was ${channelData.authority.toString()}`);
  }
  if (name) {
    assert.strictEqual(channelData.name.toString(), name.toString(), `Channel name should be ${name.toString()} but was ${channelData.name.toString()}`);
  }
  if (is_private) {
    assert.strictEqual(channelData.isPrivate.toString(), is_private.toString(), `Channel is_private should be ${is_private.toString()} but was ${channelData.isPrivate.toString()}`);
  }
  if (member_count || member_count == 0) {
    assert.strictEqual(channelData.memberCount.toString(), new anchor.BN(member_count).toString(), `Member count should be ${member_count} but was ${channelData.memberCount.toString()}`);
  }
  if (bump) {
    assert.strictEqual(channelData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${channelData.bump}`);
  }
}

async function checkChannelMembers(
  program: anchor.Program<Solchat>,
  channel_members: PublicKey,
  channel?: PublicKey,
  user?: PublicKey,
  permissions?: string,
  joined_at?: number,
  bump?: number,
) {
  let channelMemberData = await program.account.channelMember.fetch(channel_members);

  if (channel) {
    assert.strictEqual(channelMemberData.channel.toString(), channel.toString(), `Associated channel should be ${channel.toString()} but was ${channelMemberData.channel.toString()}`);
  }
  if (user) {
    assert.strictEqual(channelMemberData.user.toString(), user.toString(), `Channel member should be ${user.toString()} but was ${channelMemberData.user.toString()}`);
  }
  if (permissions) {
    assert.strictEqual(Object.keys(channelMemberData.permissions)[0].toLowerCase(), permissions.toLowerCase(), `Channel member permission should be ${permissions.toLowerCase()} but was ${Object.keys(channelMemberData.permissions)[0].toLowerCase()}`);
  }
  if (joined_at) {
    assert.strictEqual(channelMemberData.joinedAt.toString(), new anchor.BN(joined_at).toString(), `Channel member joining date should be ${joined_at} but was ${channelMemberData.joinedAt.toString()}`);
  }
  if (bump) {
    assert.strictEqual(channelMemberData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${channelMemberData.bump}`);
  }
}

async function checkDMThread(
  program: anchor.Program<Solchat>,
  dm_thread: PublicKey,
  user_a?: PublicKey,
  user_b?: PublicKey,
  bump?: number,
) {
  let dmThreadData = await program.account.dmThread.fetch(dm_thread);

  if (user_a) {
    assert.strictEqual(dmThreadData.userA.toString(), user_a.toString(), `User A should be ${user_a.toString()} but was ${dmThreadData.userA.toString()}`);
  }
  if (user_b) {
    assert.strictEqual(dmThreadData.userB.toString(), user_b.toString(), `User B should be ${user_b.toString()} but was ${dmThreadData.userB.toString()}`);
  }
  if (bump) {
    assert.strictEqual(dmThreadData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${dmThreadData.bump}`);
  }
}

async function checkMessage(
  program: anchor.Program<Solchat>,
  message: PublicKey,
  author?: PublicKey,
  parent?: PublicKey,
  content?: string,
  timestamp?: number,
  reply_to?: PublicKey,
  bump?: number,
) {
  let messageData = await program.account.message.fetch(message);

  if (author) {
    assert.strictEqual(messageData.author.toString(), author.toString(), `Message author should be ${author.toString()} but was ${messageData.author.toString()}`);
  }
  if (parent) {
    assert.strictEqual(messageData.parent.toString(), parent.toString(), `Message parent should be ${parent.toString()} but was ${messageData.parent.toString()}`);
  }
  if (content) {
    assert.strictEqual(messageData.content.toString(), content.toString(), `Message content should be ${content.toString()} but was ${messageData.content.toString()}`);
  }
  if (timestamp) {
    assert.strictEqual(messageData.timestamp.toString(), new anchor.BN(timestamp).toString(), `Message timestamp should be ${timestamp} but was ${messageData.timestamp.toString()}`);
  }
  if (reply_to) {
    assert.strictEqual(messageData.replyTo.toString(), reply_to.toString(), `Reply message should be ${reply_to.toString()} but was ${messageData.replyTo.toString()}`);
  }
  if (bump) {
    assert.strictEqual(messageData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${messageData.bump}`);
  }
}

async function checkMessageMetadata(
  program: anchor.Program<Solchat>,
  message_metadata: PublicKey,
  count?: number,
  emoji?: string,
  bump?: number,
) {
  let messageMetadataData = await program.account.messageMetadata.fetch(message_metadata);

  if (count) {
    assert.strictEqual(messageMetadataData.count.toString(), new anchor.BN(count).toString(), `Message counter should be ${count} but was ${messageMetadataData.count.toString()}`);
  }
  if (emoji) {
    assert.strictEqual(messageMetadataData.emoji.toString(), emoji.toString(), `Message reaction should be ${emoji.toString()} but was ${messageMetadataData.emoji.toString()}`);
  }
  if (bump) {
    assert.strictEqual(messageMetadataData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${messageMetadataData.bump}`);
  }
}

// TODO
async function checkReaction(
  program: anchor.Program<Solchat>,
  dm_thread: PublicKey,
  user_a?: PublicKey,
  user_b?: PublicKey,
  bump?: number,
) {
  let dmThreadData = await program.account.dmThread.fetch(dm_thread);

  if (user_a) {
    assert.strictEqual(dmThreadData.userA.toString(), user_a.toString(), `User A should be ${user_a.toString()} but was ${dmThreadData.userA.toString()}`);
  }
  if (user_b) {
    assert.strictEqual(dmThreadData.userB.toString(), user_b.toString(), `User B should be ${user_b.toString()} but was ${dmThreadData.userB.toString()}`);
  }
  if (bump) {
    assert.strictEqual(dmThreadData.bump.toString(), bump.toString(), `Bump should be ${bump} but was ${dmThreadData.bump}`);
  }
}

function sortPubkeys(a: PublicKey, b: PublicKey) {
  if (Buffer.compare(a.toBuffer(), b.toBuffer()) < 0) {
    return [a, b];
  }
  return [b, a];
}
