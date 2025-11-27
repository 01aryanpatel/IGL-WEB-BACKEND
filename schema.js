const mongoose = require('mongoose');

// CONFIG Schema
const ConfigSchema = new mongoose.Schema({
  // 🔹 Server Info
  serverId: String,
  serverName: String,
  serverAccess: { type: String, default: 'member' },
  access: { type: String, default: 'online' },

  // 🔹 Guild Info
  guildId: String,
  guildName: String,
  guildRegion: String,
  guildEmail: String,
  guildVerificationCode: String,
  guildApplicationChannelID: { type: String },
  applyGuildJoin: { type: String, enum: ['ON', 'OFF'], default: 'OFF' },

  // 🔹 Roles & Permissions
  roleId: String,
  officerId: String,
  ownerId: String,

  // 🔹 Channels
  botCmdChannelId: String,
  alertChannelId: String,
  guildChannelId: String,
  playerChannelId: String,
  playerQueriesChannelId: { type: String },

  // 🔹 Player Defaults
  perDayPoints: String,
  pointsSystemMode: { type: String },
  playerBRRank: { type: String },
  playerCSRank: { type: String },
  playerLevel: { type: String },

  // 🔹 User Info
  userId: String,
  userName: String,
  displayName: String,
  gameUid: String,
}, { timestamps: true });


// PLAYER DATA Schema (per-guild DB)
const PlayerDataSchema = new mongoose.Schema({
  srNo: Number,
  uid: String,
  playerName: String,
  joinDate: String,
  method: String,
  rank: String,
  status: String,
  defaultSync: String,
  reason: String,
  leaveDate: String,
  kickedScore: String,
  kickedStatus: String,
  lastTotalPoints: String,
  currentTotalPoints: String,
  thisWeekWarTotalPoints: String,
  lastWeekWarTotalPoints: String,
  points: String,
  pointsWar: String,
  requestForTemporaryBreak: String,
  changeName: String,
  guildmatesFriend: String,
  totalDays: String,
  minPoints: String,
  pointsLimit: String,
  verificationStatus: String,
}, { timestamps: true });

// GUILD POINTS Schema (per-guild DB)
const GuildPointSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  points: { type: Number, required: true }
}, { timestamps: true });

// PASS Schema
const PassSchema = new mongoose.Schema({
  userId: String,
  uid: String,
  password: String,
  email: String,
  otp: String,
  time: String,
  status: String,
  newPassword: String,
  forgotStatus: String,
  purpose: String,
  oldUserId: String,
}, { timestamps: true });

// PLAYER INFO Schema (global)
const PlayerInfoSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  playerName: { type: String },
  guildJoin: { type: Number, default: 1 },
  pastGuild: { type: String, default: '' },
  currentGuildId: { type: String, default: '' },
  totalGuildsBan: { type: Number, default: 0 },
  banIGL: { type: Boolean, default: false },
  reason: { type: String, default: '' },
  date: { type: Date, default: null },
}, { timestamps: true });

// LOGIN Schema (new)
const LoginSchema = new mongoose.Schema({
  discordUserId: { type: String, required: true },
  uid: { type: String, required: true },
  playername: { type: String, required: true },
  otp: { type: String, required: true },
  serverId: { type: String, required:true},
  loginStatus: {
    type: String,
    enum: ['LOGGED_IN', 'LOGGED_OUT', 'PENDING'],
    default: 'PENDING'
  },
  access: { type: Boolean, default: false },
  logoutInfo: { type: String, default: null },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

//Guild Inbox Schema
// schema.js
const InboxSchema = new mongoose.Schema({
  requestServerID:{type:String, required:true},
  discordUserID: { type: String, required: true },
  playerID: { type: String, required: true },
  requestType: {type:String, required: true},
  message: { type: String, required: true },
  requestDate: { type: Date, default: Date.now },
  requestTo: { type: String, required: true },
  requestStatus: {
    type: String,
    enum: ['PENDING', 'REJECT', 'UNDER REVIEW', 'APPROVED'],
    default: 'PENDING'
  },
  requestProcessBy: { type: String, default: null },
  responseDate: { type: Date, default: null },
  responseReason: { type: String, default: null },
  requestID: { type: String, required: true },
  messageID:{type:String, requried:true},
});

const GuildRecruitmentSchema = new mongoose.Schema({
  messageID: { type: String, required: true }, // Discord message ID (for editing/updating later)
  
  mode: {
    type: String,
    enum: ['SOLO', 'DUO', 'TRIO', 'SQUAD'],
    required: true
  },

  uids: { type: [String], default: [] }, // Array of player UIDs
  
  userId: { type: String, required: true },  // Discord user ID (request creator)
  serverId: { type: String, required: true }, // Discord server ID

  requestId: { type: String, required: true }, // format: serverid-userid-timestamp

  date: { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ['PENDING', 'REJECT', 'APPROVED'],
    default: 'PENDING'
  }
});





// Export
module.exports = {
  PlayerDataSchema,
  GuildPointSchema,
  GuildRecruitmentSchema,
  GuildInboxSchema: InboxSchema, 
  Config: mongoose.model('Config', ConfigSchema, 'config'),
  Pass: mongoose.model('Pass', PassSchema, 'pass'),
  PlayerInfo: mongoose.model('PlayerInfo', PlayerInfoSchema, 'playerInfo'),
  Login: mongoose.model('Login', LoginSchema, 'logins')
};

