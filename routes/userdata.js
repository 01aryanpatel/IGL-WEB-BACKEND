const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Load correct models & schemas
const { PlayerInfo, PlayerDataSchema } = require("../schema");

// ======================================
// GET /userdata?id={uid}
// ======================================
router.get("/", async (req, res) => {
  try {
    const uid = req.query.id;

    if (!uid) {
      return res.status(400).json({ msg: "UID required" });
    }

    // 1️⃣ Find player inside PlayerInfo collection
    const info = await PlayerInfo.findOne({ uid });

    if (!info) {
      return res.status(404).json({ msg: "Player not found in playerInfo" });
    }

    // 2️⃣ Guild DB Name = currentGuildId field
    const guildDBName = info.currentGuildId;

    if (!guildDBName || guildDBName.trim() === "") {
      return res.status(404).json({ msg: "Player is not inside any guild" });
    }

    // 3️⃣ Connect to guild DB dynamically
    const guildDB = mongoose.connection.useDb(guildDBName);

    // 4️⃣ Load playerdata model inside that DB
    const PlayerData = guildDB.model("playerdata", PlayerDataSchema, "playerdata");

    // 5️⃣ Find actual player data inside that DB
    const playerData = await PlayerData.findOne({ uid });

    if (!playerData) {
      return res.status(404).json({
        msg: "playerdata not found inside guild DB",
        guild: guildDBName
      });
    }

    // 6️⃣ Return Combined Response
    return res.status(200).json({
      playerInfo: info,
      playerData: playerData
    });

  } catch (err) {
    console.error("USERDATA ERROR:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
