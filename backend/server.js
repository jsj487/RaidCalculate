const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000; // 백엔드 서버 포트
const LOST_ARK_API_KEY = process.env.LOST_ARK_API_KEY;

// 캐릭터 검색 API 라우트
app.get("/api/characters/siblings", async (req, res) => {
  const { name } = req.query; // 프론트엔드에서 전달된 캐릭터 이름
  if (!name) {
    return res.status(400).json({ error: "Character name is required" });
  }

  try {
    const response = await axios.get(
      `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
        name
      )}/siblings`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data); // 응답 데이터를 프론트엔드로 전달
  } catch (error) {
    console.error(
      "Error fetching character data:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch character data" });
  }
});

console.log("LOST_ARK_API_KEY:", process.env.LOST_ARK_API_KEY);

// 백엔드 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
