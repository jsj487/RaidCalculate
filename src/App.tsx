import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

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

export default function App() {
  const [search, setSearch] = useState("");
  const [characters, setCharacters] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      setCharacters(response.data); // API 응답 데이터를 상태에 저장
    } catch (err) {
      setError("캐릭터 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
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

      <div>
        {characters.map((char, index) => (
          <CharacterCard key={index}>
            <h2>{char.CharacterName}</h2>
            <p>레벨: {char.CharacterLevel}</p>
            <p>클래스: {char.CharacterClassName}</p>
            <p>아이템 레벨: {char.ItemAvgLevel || "정보 없음"}</p>
          </CharacterCard>
        ))}
      </div>
    </Container>
  );
}
