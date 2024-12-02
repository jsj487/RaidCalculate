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
    // 형제 캐릭터 데이터 가져오기
    const siblingsResponse = await axios.get(
      `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
        name
      )}/siblings`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
        },
      }
    );

    const siblings = siblingsResponse.data;

    // 각 캐릭터의 프로필 이미지 가져오기
    const detailedSiblings = await Promise.all(
      siblings.map(async (char) => {
        try {
          const profileResponse = await axios.get(
            `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(
              char.CharacterName
            )}/profiles`,
            {
              headers: {
                Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
              },
            }
          );

          // 응답 데이터가 null인지 확인
          return {
            ...char,
            CharacterImage: profileResponse.data?.CharacterImage || null, // 기본값 null
          };
        } catch (err) {
          console.error(
            `Error fetching profile for ${char.CharacterName}:`,
            err.response?.data || err.message
          );
          return {
            ...char,
            CharacterImage: null, // 실패한 경우 기본값 설정
          };
        }
      })
    );

    res.json(detailedSiblings); // 프론트엔드로 데이터 전달
  } catch (error) {
    console.error("Error fetching character siblings:", error.message);
    res.status(500).json({ error: "Failed to fetch character data" });
  }
});

console.log("LOST_ARK_API_KEY:", process.env.LOST_ARK_API_KEY);

// 백엔드 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
