// ✅ FILE: utils/sendMail.js
const fetch = require("node-fetch");

/**
 * Send mail via external API (like your Vercel mail sender)
 * @param {Object} mailData - mail details
 * @param {string} mailData.to - recipient email
 * @param {string} mailData.subject - email subject
 * @param {string} mailData.text - plain text
 * @param {string} mailData.html - html content
 * @returns {Promise<Object>} - response from API
 */
async function sendMail(mailData) {
  const API_URL = "https://igl-mail-sender-v1.vercel.app/sendmail"; // 🔁 your Vercel API endpoint
  const API_KEY = "alukachalu"; // 🔒 optional authentication key

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(mailData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Unknown error while sending mail");
    }

    console.log("✅ Mail sent:", data);
    return data;
  } catch (err) {
    console.error("❌ Mail send failed:", err.message);
    throw err;
  }
}

module.exports = { sendMail };
