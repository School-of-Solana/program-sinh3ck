/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/solchat.json`.
 */
export type Solchat = {
  "address": "8QH6X6khHZZi1wmgbgzsKg6LBWEb2nij1m923UiViTY4",
  "metadata": {
    "name": "solchat",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "changeChannelSettings",
      "discriminator": [
        51,
        33,
        5,
        116,
        154,
        144,
        72,
        121
      ],
      "accounts": [
        {
          "name": "channelAuthority",
          "signer": true
        },
        {
          "name": "channel",
          "writable": true
        },
        {
          "name": "channelMember",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "channelAuthority"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "isPrivate",
          "type": "bool"
        }
      ]
    },
    {
      "name": "changeUserChannelPermissions",
      "discriminator": [
        161,
        232,
        65,
        97,
        119,
        214,
        199,
        206
      ],
      "accounts": [
        {
          "name": "channelAuthority",
          "signer": true
        },
        {
          "name": "userAuthority"
        },
        {
          "name": "channel"
        },
        {
          "name": "channelMemberSigner",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "channelAuthority"
              }
            ]
          }
        },
        {
          "name": "channelMemberUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "permission",
          "type": {
            "defined": {
              "name": "channelPermission"
            }
          }
        }
      ]
    },
    {
      "name": "createChannel",
      "discriminator": [
        37,
        105,
        253,
        99,
        87,
        46,
        223,
        20
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "channel",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  67,
                  72,
                  65,
                  78,
                  78,
                  69,
                  76
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "channelMembers",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "messageMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  67
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "isPrivate",
          "type": "bool"
        }
      ]
    },
    {
      "name": "createDm",
      "discriminator": [
        46,
        5,
        70,
        190,
        39,
        119,
        37,
        200
      ],
      "accounts": [
        {
          "name": "userA",
          "writable": true,
          "signer": true
        },
        {
          "name": "userB"
        },
        {
          "name": "userAProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "userA"
              }
            ]
          }
        },
        {
          "name": "userBProfile",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "userB"
              }
            ]
          }
        },
        {
          "name": "dmThread",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  68,
                  77
                ]
              },
              {
                "kind": "arg",
                "path": "first"
              },
              {
                "kind": "arg",
                "path": "second"
              }
            ]
          }
        },
        {
          "name": "messageMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  67
                ]
              },
              {
                "kind": "account",
                "path": "dmThread"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "first",
          "type": "pubkey"
        },
        {
          "name": "second",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createUser",
      "discriminator": [
        108,
        227,
        130,
        130,
        252,
        109,
        75,
        218
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "userProfile",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "exitChannel",
      "discriminator": [
        239,
        116,
        36,
        147,
        137,
        0,
        107,
        233
      ],
      "accounts": [
        {
          "name": "userAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "channel",
          "writable": true
        },
        {
          "name": "channelMember",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "inviteToChannel",
      "discriminator": [
        203,
        52,
        194,
        48,
        173,
        5,
        43,
        235
      ],
      "accounts": [
        {
          "name": "channelAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAuthority"
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "channel",
          "writable": true
        },
        {
          "name": "channelMemberSigner",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "channelAuthority"
              }
            ]
          }
        },
        {
          "name": "channelMemberUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "permission",
          "type": {
            "defined": {
              "name": "channelPermission"
            }
          }
        }
      ]
    },
    {
      "name": "joinChannel",
      "discriminator": [
        124,
        39,
        115,
        89,
        217,
        26,
        38,
        29
      ],
      "accounts": [
        {
          "name": "userAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "channel",
          "writable": true
        },
        {
          "name": "channelMember",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "reactToMessage",
      "discriminator": [
        221,
        59,
        73,
        208,
        243,
        164,
        247,
        43
      ],
      "accounts": [
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "parent"
        },
        {
          "name": "messageMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  67
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              }
            ]
          }
        },
        {
          "name": "message",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  83,
                  83,
                  65,
                  71,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              },
              {
                "kind": "arg",
                "path": "messageid"
              }
            ]
          }
        },
        {
          "name": "channelMember",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "emoji",
          "type": "string"
        },
        {
          "name": "messageid",
          "type": "u32"
        }
      ]
    },
    {
      "name": "removeFromChannel",
      "discriminator": [
        100,
        246,
        150,
        228,
        225,
        2,
        145,
        22
      ],
      "accounts": [
        {
          "name": "channelAuthority",
          "writable": true,
          "signer": true
        },
        {
          "name": "userAuthority"
        },
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  85,
                  83,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "channel",
          "writable": true
        },
        {
          "name": "channelMemberSigner",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "channelAuthority"
              }
            ]
          }
        },
        {
          "name": "channelMemberUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "channel"
              },
              {
                "kind": "account",
                "path": "userAuthority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "sendMessage",
      "discriminator": [
        57,
        40,
        34,
        178,
        189,
        10,
        65,
        26
      ],
      "accounts": [
        {
          "name": "author",
          "writable": true,
          "signer": true
        },
        {
          "name": "parent"
        },
        {
          "name": "messageMetadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  67
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              }
            ]
          }
        },
        {
          "name": "message",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  83,
                  83,
                  65,
                  71,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              },
              {
                "kind": "account",
                "path": "message_metadata.count",
                "account": "messageMetadata"
              }
            ]
          }
        },
        {
          "name": "channelMember",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  77,
                  66,
                  69,
                  82
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              },
              {
                "kind": "account",
                "path": "author"
              }
            ]
          }
        },
        {
          "name": "replyToMessage",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  95,
                  77,
                  69,
                  83,
                  83,
                  65,
                  71,
                  69
                ]
              },
              {
                "kind": "account",
                "path": "parent"
              },
              {
                "kind": "arg",
                "path": "replytomessageid"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "messageContent",
          "type": "string"
        },
        {
          "name": "replytomessageid",
          "type": {
            "option": "u32"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "channel",
      "discriminator": [
        49,
        159,
        99,
        106,
        220,
        87,
        219,
        88
      ]
    },
    {
      "name": "channelMember",
      "discriminator": [
        165,
        1,
        218,
        177,
        114,
        130,
        205,
        10
      ]
    },
    {
      "name": "dmThread",
      "discriminator": [
        154,
        208,
        143,
        70,
        54,
        23,
        136,
        140
      ]
    },
    {
      "name": "message",
      "discriminator": [
        110,
        151,
        23,
        110,
        198,
        6,
        125,
        181
      ]
    },
    {
      "name": "messageMetadata",
      "discriminator": [
        99,
        170,
        51,
        219,
        112,
        22,
        245,
        83
      ]
    },
    {
      "name": "userProfile",
      "discriminator": [
        32,
        37,
        119,
        205,
        179,
        180,
        13,
        194
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "usernameTooLong",
      "msg": "Username too long"
    },
    {
      "code": 6001,
      "name": "channelNameTooLong",
      "msg": "Channel name too long"
    },
    {
      "code": 6002,
      "name": "insufficientPermissions",
      "msg": "Insufficient Permissions"
    },
    {
      "code": 6003,
      "name": "cannotJoinPrivateChannel",
      "msg": "Cannot join private channel"
    },
    {
      "code": 6004,
      "name": "cannotChangeOwnPermissions",
      "msg": "Cannot change own permissions"
    },
    {
      "code": 6005,
      "name": "cannotDmYourself",
      "msg": "Cannot DM yourself"
    },
    {
      "code": 6006,
      "name": "signerNotInPair",
      "msg": "Signer not in provided pair"
    },
    {
      "code": 6007,
      "name": "invalidPairOrdering",
      "msg": "Invalid pair ordering"
    },
    {
      "code": 6008,
      "name": "invalidChannelOrDmThread",
      "msg": "Invalid channel or DM thread"
    },
    {
      "code": 6009,
      "name": "channelMemberAccountNotProvided",
      "msg": "Channel member account not provided"
    },
    {
      "code": 6010,
      "name": "messageContentTooLong",
      "msg": "Message content too long"
    },
    {
      "code": 6011,
      "name": "replyToMessageIdRequired",
      "msg": "Reply to message ID required"
    },
    {
      "code": 6012,
      "name": "invalidEmoji",
      "msg": "Invalid Emoji"
    },
    {
      "code": 6013,
      "name": "tooManyReactions",
      "msg": "Too many reactions"
    }
  ],
  "types": [
    {
      "name": "channel",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "isPrivate",
            "type": "bool"
          },
          {
            "name": "memberCount",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "channelMember",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "channel",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "channelPermission"
              }
            }
          },
          {
            "name": "joinedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "channelPermission",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "admin"
          },
          {
            "name": "addMember"
          },
          {
            "name": "removeMember"
          },
          {
            "name": "changeSettings"
          },
          {
            "name": "reader"
          }
        ]
      }
    },
    {
      "name": "dmThread",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userA",
            "type": "pubkey"
          },
          {
            "name": "userB",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "message",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "pubkey"
          },
          {
            "name": "parent",
            "type": "pubkey"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "replyTo",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "messageMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u32"
          },
          {
            "name": "emoji",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "joinedChannels",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
