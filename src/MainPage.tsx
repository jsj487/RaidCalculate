import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f0f0f0;
`;

const SearchBox = styled.div`
  margin-top: 50px;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  background: rgba(255, 255, 255, 0.9);
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

const ServerList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const ServerButton = styled(Button)<{ selected: boolean }>`
  background: ${(props) => (props.selected ? "#0056b3" : "#007bff")};
`;

const CharacterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const CharacterCard = styled.div`
  width: 200px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const CharacterName = styled.h3`
  font-size: 16px;
  margin-top: 10px;
`;

const CharacterBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const ImageBox = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 8px;
  background-image: url("/img/gold.png"); /* 이미지 경로 */
  background-size: contain; /* 비율 유지하며 박스 크기에 맞춤 */
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-position: center; /* 이미지 중앙 정렬 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BoxContent = styled.div`
  font-size: 14px;
  color: #333;
`;

export default function MainPage() {
  const [search, setSearch] = useState("");
  const [servers, setServers] = useState<string[]>([]);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/characters/siblings",
        { params: { name: search } }
      );

      type CharacterData = {
        ServerName: string;
        CharacterName: string;
        CharacterClassName: string;
        CharacterLevel: number;
        ItemAvgLevel: string;
        CharacterImage?: string;
      };

      const serverList = Array.from(
        new Set(
          (response.data as CharacterData[]).map((char) => char.ServerName)
        )
      );
      setServers(serverList);
      setCharacters(response.data);
      setSelectedServer(null);
    } catch (err) {
      setError("캐릭터 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleServerSelect = (server: string) => {
    setSelectedServer(server);
  };

  const filteredCharacters = characters
    .filter((char) => char.ServerName === selectedServer)
    .sort(
      (a, b) =>
        parseFloat(b.ItemAvgLevel.replace(/,/g, "")) -
        parseFloat(a.ItemAvgLevel.replace(/,/g, "")) // ItemAvgLevel 기준 내림차순
    )
    .slice(0, 6); // 상위 6개 추출

  return (
    <Container>
      <SearchBox>
        <h1>Lost Ark 캐릭터 검색</h1>
        <Input
          type="text"
          placeholder="닉네임 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>검색</Button>
        {loading && <p>검색 중...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </SearchBox>
      {servers.length > 0 && (
        <ServerList>
          {servers.map((server) => (
            <ServerButton
              key={server}
              selected={selectedServer === server}
              onClick={() => handleServerSelect(server)}
            >
              {server}
            </ServerButton>
          ))}
        </ServerList>
      )}
      {selectedServer && (
        <CharacterRow>
          {filteredCharacters.map((char, index) => (
            <CharacterCard key={index}>
              <CharacterImage
                src={char.CharacterImage || "/img/default-character.png"}
                alt={char.CharacterName}
              />
              <CharacterName>{char.CharacterName}</CharacterName>
              <p>아이템 레벨: {char.ItemAvgLevel}</p>
              <p>전투 레벨: {char.CharacterLevel}</p>
              <p>클래스: {char.CharacterClassName}</p>
              {/* 박스 추가 */}
              <CharacterBox>
                <ImageBox /> {/* 왼쪽 이미지 박스 */}
                <BoxContent>박스 내용</BoxContent>
              </CharacterBox>
            </CharacterCard>
          ))}
        </CharacterRow>
      )}
    </Container>
  );
}
