
require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        error: "Barcha ma'lumotlarni kiriting"
      });
    }

    const text = `
🎓 BILIMDON O'QUV MARKAZI

👤 Ism va familiya: ${name}
📞 Telefon: ${phone}
💬 Xabar: ${message}
    `;

    const telegram = await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: process.env.CHAT_ID,
          text: text
        })
      }
    );

    const result = await telegram.json();

    if (!telegram.ok || !result.ok) {
      console.error(result);
      return res.status(500).json({
        error: "Telegram xabarni yubora olmadi"
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server xatoligi"
    });
  }
});

app.listen(3000, () => {
  console.log("Bilimdon server ishlayapti!");
});
require("dotenv").config();