const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; // 배포 환경에서 사용할 포트
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
          Authorization: `Bearer ${LOST_ARK_API_KEY}`,
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
                Authorization: `Bearer ${LOST_ARK_API_KEY}`,
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

// 정적 파일 제공 (React 빌드 결과물)
app.use(express.static(path.join(__dirname, "../build")));

// React의 라우팅을 처리 (SPA 지원)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
