const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// CORS 설정
app.use(cors());

// .env 파일에서 API 키 가져오기
const API_KEY = process.env.REACT_APP_API_KEY;

app.get("/api/characters", async (req, res) => {
  const characterName = req.query.name;
  const apiUrl = `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
    characterName
  )}/siblings`;
  const headers = {
    Authorization: API_KEY,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    // 기본 캐릭터 정보 가져오기
    const characterResponse = await axios.get(apiUrl, { headers });
    const characters = characterResponse.data;

    // 각 캐릭터에 대해 프로필 정보 가져오기
    const updatedCharacters = await Promise.all(
      characters.map(async (character) => {
        try {
          const profileUrl = `https://developer-lostark.game.onstove.com/characters/${encodeURIComponent(
            character.CharacterName
          )}/profiles`;
          const profileResponse = await axios.get(profileUrl, { headers });
          character.CharacterImage = profileResponse.data.CharacterImage; // 이미지 추가
        } catch (error) {
          character.CharacterImage = null;
        }
        return character;
      })
    );

    res.status(200).json(updatedCharacters);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
