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

// 공휴일 프록시 API
app.get("/api/publicholidays/:year/:country", async (req, res) => {
  const { year, country } = req.params;

  try {
    console.log(
      `요청 URL: https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`
    );

    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    console.log("API 응답 상태 코드:", response.status);
    console.log("API 응답 데이터:", response.data);

    res.json(response.data); // 정상 응답
  } catch (error) {
    console.error("API 요청 실패:", error.message);
    if (error.response) {
    }
    res.status(500).json({ error: "Failed to fetch public holidays" });
  }
});

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

// React의 라우팅을 처리 (SPA 지원)
app.get("*", (req, res) => {
  const indexPath = path.join(buildPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error serving index.html:", err);
      res.status(500).send("Error serving the application.");
    }
  });
});

app.post("/api/participants/update", async (req, res) => {
  const { eventId, participants } = req.body;

  if (!eventId || !Array.isArray(participants)) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    // Firestore에서 해당 이벤트 문서 가져오기
    const eventRef = db.collection("schedules").doc(eventId);
    const eventSnapshot = await eventRef.get();

    if (!eventSnapshot.exists) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Firestore에 참가자 목록 업데이트
    await eventRef.update({
      participants: participants,
    });

    res.json({ success: true, message: "Participants updated successfully" });
  } catch (error) {
    console.error("Error updating participants:", error);
    res.status(500).json({ error: "Failed to update participants" });
  }
});

// 서버 실행
app.listen(PORT, () => {});
