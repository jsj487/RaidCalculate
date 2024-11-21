import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";
const classImageMap: { [key: string]: string } = {
  기상술사: "/img/bg_detail_aeromancer.jpg",
  아르카나: "/img/bg_detail_arcana.jpg",
  도화가: "/img/bg_detail_artist.jpg",
  바드: "/img/bg_detail_bard.jpg",
  배틀마스터: "/img/bg_detail_bard.jpg",
  버서커: "/img/bg_detail_berserker.jpg",
  블레이드: "/img/bg_detail_blade.jpg",
  블래스터: "/img/bg_detail_blaster.jpg",
  브레이커: "/img/bg_detail_breaker.jpg",
  데모닉: "/img/bg_detail_demonic.jpg",
  디스트로이어: "/img/bg_detail_destroyer.jpg",
  데빌헌터: "/img/bg_detail_devilhunter.jpg",
  건슬링어: "/img/bg_detail_gunslinger.jpg",
  호크아이: "/img/bg_detail_hawkeye.jpg",
  홀리나이트: "/img/bg_detail_holyknight.jpg",
  인파이터: "/img/bg_detail_infighter.jpg",
  창술사: "/img/bg_detail_리퍼.jpg",
  스카우터: "/img/bg_detail_scouter.jpg",
  슬레이어: "/img/bg_detail_slayer.jpg",
  소서리스: "/img/bg_detail_sorceress.jpg",
  소울이터: "/img/bg_detail_souleater.jpg",
  기공사: "/img/bg_detail_soulmaster.jpg",
  스트라이커: "/img/bg_detail_striker.jpg",
  서머너: "/img/bg_detail_summoner.jpg",
  워로드: "/img/bg_detail_warlord.jpg",
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 16px;
  padding: 16px;
  background: #f0f0f0;
`;

const SearchBox = styled.div`
  margin-top: 50px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const CharacterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, 1fr)
  ); /* 가로 크기에 맞춰 자동 조정 */
  gap: 16px; /* 캐릭터 간의 간격 */
  width: 100%; /* 부모 컨테이너에 맞춤 */
  justify-items: center; /* 각 캐릭터를 가운데 정렬 */
  margin-top: 16px; /* 상단 여백 추가 */
`;

const CharacterCard = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  width: 300px;
  text-align: center;
`;

const ErrorText = styled.p`
  color: red;
  margin-top: 10px;
`;

const StyledImage = styled.img`
  width: 75%; /* 가로 크기를 카드의 너비에 맞춤 */
  height: 300px; /* 고정된 세로 크기 */
  object-fit: cover; /* 이미지 비율 유지하면서 카드에 맞게 조정 */
  border-radius: 8px; /* 기존 스타일 유지 */
  margin-bottom: 16px; /* 카드와의 간격 */
`;

export default function App() {
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null); // 선택된 서버
  const [servers, setServers] = useState<string[]>([]); // 서버 목록

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("캐릭터 이름을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/characters/siblings",
        {
          params: { name: search },
        }
      );

      console.log("API 응답 데이터:", response.data);

      // 서버 목록 추출
      const serverList = Array.from(
        new Set(
          response.data.map((char: any) => char.ServerName)
        ) as Set<string>
      );
      setServers(serverList);

      setSelectedServer(null); // 서버 선택 초기화

      // 캐릭터 데이터 변환 및 저장
      const sortedCharacters = response.data
        .map((char: any) => {
          const cleanLevel = parseFloat(
            char.ItemAvgLevel.replace(/,/g, "").trim()
          );
          return {
            ...char,
            ItemAvgLevel: cleanLevel,
          };
        })
        .sort((a: any, b: any) => b.ItemAvgLevel - a.ItemAvgLevel);

      setCharacters(sortedCharacters); // 캐릭터 데이터 저장
    } catch (err) {
      setError("캐릭터 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleServerSelect = (server: string) => {
    setSelectedServer(server); // 서버 선택 상태 업데이트
  };

  return (
    <Container>
      <SearchBox>
        <h1>Lost Ark 캐릭터 검색</h1>
        <Input
          type="text"
          placeholder="캐릭터 이름 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>검색</Button>
        {loading && <p>검색 중...</p>}
        {error && <ErrorText>{error}</ErrorText>}
      </SearchBox>

      {/* 서버 선택 UI */}
      {servers.length > 0 && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <h3>서버 선택:</h3>
          {servers.map((server) => (
            <Button
              key={server}
              onClick={() => handleServerSelect(server)}
              style={{
                margin: "8px",
                backgroundColor:
                  selectedServer === server ? "#0056b3" : "#007bff",
              }}
            >
              {server}
            </Button>
          ))}
        </div>
      )}

      {/* 캐릭터 카드 컨테이너 */}
      {selectedServer && (
        <CharacterContainer>
          {characters
            .filter((char) => char.ServerName === selectedServer)
            .map((char, index) => (
              <CharacterCard key={index}>
                <StyledImage
                  src={
                    char.CharacterImage ||
                    classImageMap[char.CharacterClassName] ||
                    "/img/default-character.png"
                  }
                  alt={char.CharacterName || "기본 이미지"}
                />
                <h2>{char.CharacterName}</h2>
                <p>레벨: {char.CharacterLevel}</p>
                <p>클래스: {char.CharacterClassName}</p>
                <p>아이템 레벨: {char.ItemAvgLevel || "정보 없음"}</p>
              </CharacterCard>
            ))}
        </CharacterContainer>
      )}
    </Container>
  );
}
