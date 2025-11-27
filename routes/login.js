// login/login.js
const express = require("express");
const router = express.Router();
const { Pass } = require("../schema");   // pass collection
const { sendMail } = require("../utils/sendmail"); // email sender

// Generate 6 digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ======================================
// SEND OTP — POST /login
// ======================================
router.post("/", async (req, res) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ msg: "UID required" });
    }

    // FIND UID IN PASS COLLECTION
    const user = await Pass.findOne({ uid: uid });

    if (!user) {
      return res.status(404).json({ msg: "UID not found" });
    }

    // GENERATE NEW OTP
    const otp = generateOTP();

    // UPDATE OTP IN PASS COLLECTION
    user.otp = otp;
    user.time = new Date().toISOString();
    await user.save();

    console.log("OTP generated:", otp);

    // SEND MAIL
    await sendMail({
      to: user.email,
      subject: "Your IGL Login OTP",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP for login is:</p><h2>${otp}</h2>`
    });

    return res.status(200).json({ msg: "OTP sent successfully" });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});


// login/login.js

// OTP VERIFY — POST /login/verify
router.post("/verify", async (req, res) => {
  try {
    const { uid, otp } = req.body;

    if (!uid || !otp) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const user = await Pass.findOne({ uid: uid });

    if (!user) {
      return res.status(404).json({ msg: "UID not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ msg: "Invalid OTP" });
    }

    // Success!
    return res.status(200).json({ msg: "OTP verified" });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
