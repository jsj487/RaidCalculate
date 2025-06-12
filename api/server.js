const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const admin = require("firebase-admin");

const PORT = process.env.PORT || 5000; // 배포 환경에서 사용할 포트
const LOST_ARK_API_KEY = process.env.LOST_ARK_API_KEY;

// 공휴일 프록시 API
app.get("/api/publicholidays/:year/:country", async (req, res) => {
  const { year, country } = req.params;

  try {
    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

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

// 캐릭터 착용 장비 정보 (보석 포함) 가져오기
app.get("/api/characters/gems", async (req, res) => {
  const { name } = req.query;

  if (!name) {
    console.warn("name 쿼리 누락됨");
    return res.status(400).json({ error: "Character name is required" });
  }

  try {
    const response = await axios.get(
      `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(
        name
      )}/gems`,
      {
        headers: {
          Authorization: `Bearer ${LOST_ARK_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("로스트아크 API 요청 실패:", error.message);
    res.status(500).json({ error: "Failed to fetch character gems" });
  }
});

app.get("/api/characters/:endpoint", async (req, res) => {
  const { name } = req.query;
  const { endpoint } = req.params;

  if (!name) {
    return res.status(400).json({ error: "Character name is required" });
  }

  const validEndpoints = [
    "arkpassive",
    "combat-skills",
    "engravings",
    "profiles",
  ];

  if (!validEndpoints.includes(endpoint)) {
    return res.status(400).json({ error: "Invalid endpoint" });
  }

  try {
    const response = await axios.get(
      `https://developer-lostark.game.onstove.com/armories/characters/${encodeURIComponent(
        name
      )}/${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${LOST_ARK_API_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("API 요청 실패:", error.message);
    res.status(500).json({ error: "Failed to fetch character data" });
  }
});

// 경매장 아이템 검색 API
app.post("/api/market/items", async (req, res) => {
  try {
    const response = await axios.post(
      "https://developer-lostark.game.onstove.com/markets/items",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "로스트아크 API 호출 오류:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getMarketPriceByNameViaPost(name, categoryCode = 90000) {
  try {
    const response = await axios.post(
      "https://developer-lostark.game.onstove.com/markets/items",
      {
        Sort: "GRADE",
        CategoryCode: categoryCode,
        ItemName: name,
        PageNo: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const item = response.data.Items?.[0];
    if (!item) throw new Error("No item found");

    return {
      name: item.Name,
      currentMinPrice: item.CurrentMinPrice,
      recentPrice: item.RecentPrice,
      yDayAvgPrice: item.YDayAvgPrice,
      Icon: item.Icon,
    };
  } catch (err) {
    console.error(`[POST ERROR] ${name}`, err.message);
    return {
      name,
      currentMinPrice: null,
      error: true,
      message: err.message,
    };
  }
}

app.get("/api/market/items/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `https://developer-lostark.game.onstove.com/markets/items/${id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "단일 아이템 시세 조회 실패:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch market item details" });
  }
});

// 경매장 옵션 정보 가져오기
app.get("/api/market/options", async (req, res) => {
  try {
    const response = await axios.get(
      "https://developer-lostark.game.onstove.com/markets/options",
      {
        headers: {
          Authorization: `Bearer ${process.env.LOST_ARK_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "경매장 옵션 요청 오류:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch market options" });
  }
});

app.post("/api/craft-calc", async (req, res) => {
  const { materials, fee = 0, outputCount = 10 } = req.body;

  if (!Array.isArray(materials) || materials.length === 0) {
    return res
      .status(400)
      .json({ error: true, message: "materials가 필요합니다." });
  }

  const prices = [];

  for (const m of materials) {
    const result = await getMarketPriceByNameViaPost(m.name, m.categoryCode);
    if (result?.currentMinPrice) {
      const unitPrice = result.currentMinPrice / 100;
      const total = unitPrice * m.amount;

      prices.push({
        name: m.name,
        amount: m.amount,
        unitPrice,
        total,
        icon: result.Icon || null,
        currentMinPrice: result.currentMinPrice,
      });
    }
  }

  const materialCost = prices.reduce((sum, p) => sum + p.total, 0);
  const totalCost = materialCost + parseFloat(fee);
  const unitCost = totalCost / outputCount;

  // 제작 결과물 가격 (이건 추후 동적으로 바꾸어도 됨)
  const resultItem = "아비도스 융화 재료";
  const fusionPriceResult = await getMarketPriceByNameViaPost(
    resultItem,
    50010
  );

  const marketPrice = fusionPriceResult?.currentMinPrice ?? 0;
  const recentPrice = fusionPriceResult?.recentPrice ?? 0;
  const ydayAvgPrice = fusionPriceResult?.yDayAvgPrice ?? 0;

  // 수수료 반영: 올림 처리
  const feeOnSale = Math.ceil(marketPrice * 0.05);
  const netSalePrice = marketPrice - feeOnSale;

  const saleProfit = netSalePrice - unitCost;
  const useProfit = marketPrice - unitCost; // 직접 사용은 수수료 없음

  // 손익
  const profitPerUnit = netSalePrice - unitCost;
  const roi = unitCost > 0 ? (profitPerUnit / unitCost) * 100 : 0;

  res.json({
    totalCost: Math.round(totalCost),
    unitCost: Math.round(unitCost),
    marketPrice,
    recentPrice,
    ydayAvgPrice,
    profitPerUnit: Math.round(profitPerUnit),
    roi: Math.round(roi * 10) / 10,
    saleProfit: Math.round(saleProfit),
    useProfit: Math.round(useProfit),
    materials: prices,
  });
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

const serviceAccount = require("./serviceAccountKey.json"); // 서비스 계정 키 추가

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

app.post("/api/participants/update", async (req, res) => {
  const { scheduleId, eventId, participants } = req.body;

  if (!scheduleId || !eventId || !Array.isArray(participants)) {
    console.error("❌ Invalid request data:", req.body);
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const scheduleRef = db.collection("schedules").doc(scheduleId);
    const scheduleSnap = await scheduleRef.get();

    if (!scheduleSnap.exists) {
      console.error(`❌ Schedule ${scheduleId} not found.`);
      return res.status(404).json({ error: "Schedule not found" });
    }

    const scheduleData = scheduleSnap.data();

    if (!scheduleData.events || !Array.isArray(scheduleData.events)) {
      console.error(`❌ No events found in schedule ${scheduleId}`);
      return res.status(404).json({ error: "No events found in schedule" });
    }

    // 🔹 `eventId`를 이용하여 특정 이벤트 찾기
    const updatedEvents = scheduleData.events.map((event) => {
      if (String(event.eventId) === String(eventId)) {
        return { ...event, participants };
      }
      return event;
    });

    // 🔹 Firestore에 전체 `events` 배열을 다시 설정
    await scheduleRef.set({ events: updatedEvents }, { merge: true });

    res.json({ success: true, message: "Participants updated successfully" });
  } catch (error) {
    console.error("❌ Error updating participants in Firestore:", error);
    res.status(500).json({ error: "Failed to update participants" });
  }
});

// 서버 실행
app.listen(PORT, () => {});
