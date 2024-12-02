const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; // 배포 환경에서 사용할 포트
const LOST_ARK_API_KEY = process.env.LOST_ARK_API_KEY;

// 캐릭터 검색 API 라우트
app.get("/api/characters/siblings", async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Character name is required" });
  }

  try {
    const siblingsResponse = await axios.get(
      `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
        name
      )}/siblings`,
      {
        headers: {
          Authorization: `Bearer ${LOST_ARK_API_KEY}`,
        },
      }
    );

    const siblings = siblingsResponse.data;

    const detailedSiblings = await Promise.all(
      siblings.map(async (char) => {
        try {
          const profileResponse = await axios.get(
            `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(
              char.CharacterName
            )}/profiles`,
            {
              headers: {
                Authorization: `Bearer ${LOST_ARK_API_KEY}`,
              },
            }
          );

          return {
            ...char,
            CharacterImage: profileResponse.data?.CharacterImage || null,
          };
        } catch (err) {
          console.error(
            `Error fetching profile for ${char.CharacterName}:`,
            err.response?.data || err.message
          );
          return { ...char, CharacterImage: null };
        }
      })
    );

    res.json(detailedSiblings);
  } catch (error) {
    console.error("Error fetching character siblings:", error.message);
    res.status(500).json({ error: "Failed to fetch character data" });
  }
});

// 정적 파일 제공 (React 빌드 결과물)
const buildPath = path.join(__dirname, "../build");
app.use(express.static(buildPath));
console.log("Serving static files from:", buildPath);

// React의 라우팅을 처리 (SPA 지원)
app.get("*", (req, res) => {
  const indexPath = path.join(buildPath, "index.html");
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Error serving the application.");
    }
  });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
