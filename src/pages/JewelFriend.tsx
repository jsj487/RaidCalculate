import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { db } from "../utils/FireBase"; // 너의 FireBase.tsx에 정의된 Firebase 인스턴스
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://raidcalculate.onrender.com/api"
    : "http://localhost:5000/api";

const Container = styled.div`
  padding: 40px;
  color: white;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* 추가적으로 콘텐츠 높이에 따라 적당히 여백 줄 수도 있음 */
  padding-top: 60px;
  padding-bottom: 60px;
`;

const TopSearchRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 40px;
`;

const MatchLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center; /* 요거 핵심! */
  gap: 60px;
`;

const CharacterColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  height: 340px;
  background-color: #e2e2e2;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 16px;
  gap: 16px;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 8px;
  background-color: black;
`;

const InfoBox = styled.div`
  text-align: center;
  font-size: 14px;
  width: 100%;
  padding: 8px 0px;
  background: #1e1e1e;
  border-radius: 8px;

  .nickname {
    font-size: 16px;
    font-weight: bold;
    color: #ffcc00;
    margin-bottom: 8px;
  }

  .server {
    color: #ccc;
  }

  .job {
    color: #66ccff;
  }

  div {
    margin: 4px 0;
  }
`;

const CharacterImagePlaceholder = styled.div`
  width: 100%;
  height: 250px;
  background-color: #444;
  border-radius: 8px;
`;

const MatchButton = styled.button`
  padding: 20px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  background-color: #0077cc;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005fa3;
  }
`;

const JewelFriend = () => {
  const [mainSearch, setMainSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [matchedMainCharacter, setMatchedMainCharacter] = useState<any>(null);
  const [matchedSubCharacter, setMatchedSubCharacter] = useState<any>(null);
  const [mainCharacter, setMainCharacter] = useState<any>(null);
  const [subCharacter, setSubCharacter] = useState<any>(null);

  const fetchCharacter = async (
    nickname: string,
    setCharacter: (char: any) => void
  ) => {
    try {
      const res = await axios.get(`${BASE_URL}/characters/siblings`, {
        params: { name: nickname },
      });

      const data = res.data;
      if (!Array.isArray(data) || data.length === 0) {
        alert("검색 결과가 없습니다.");
        return;
      }

      const matchedChar = data.find(
        (char: any) => char.CharacterName === nickname
      );

      if (!matchedChar) {
        alert("입력한 닉네임과 일치하는 캐릭터를 찾을 수 없습니다.");
        return;
      }

      setCharacter(matchedChar);
    } catch (err) {
      console.error(err);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const handleMatch = async () => {
    if (!mainCharacter || !subCharacter) {
      alert("본캐와 부캐 정보를 모두 입력하세요.");
      return;
    }

    const myData = {
      nickname: mainCharacter.CharacterName,
      mainClass: mainCharacter.CharacterClassName,
      subClass: subCharacter.CharacterClassName,
      server: mainCharacter.ServerName,
      timestamp: serverTimestamp(),
    };

    const queueRef = collection(db, "jewelMatchingQueue");

    // 1. 반대 조건을 가진 유저 탐색
    const q = query(
      queueRef,
      where("server", "==", myData.server),
      where("mainClass", "==", myData.subClass),
      where("subClass", "==", myData.mainClass)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // 2. 매칭 성공 시, 상대 정보 가져오기
      const matchedDoc = snapshot.docs[0];
      const matchedData = matchedDoc.data();

      // 상태에 저장
      setMatchedMainCharacter({
        CharacterName: matchedData.nickname,
        CharacterClassName: matchedData.mainClass,
        ServerName: matchedData.server,
        CharacterImage: "/img/default-character.png", // 실제 이미지가 없을 수도 있으니 기본 이미지
      });

      setMatchedSubCharacter({
        CharacterName: matchedData.nickname + "의 부캐",
        CharacterClassName: matchedData.subClass,
        ServerName: matchedData.server,
        CharacterImage: "/img/default-character.png",
      });

      // 3. 매칭된 상대, 나 둘 다 queue에서 삭제
      await deleteDoc(matchedDoc.ref);
    } else {
      // 4. 매칭 안 됨 → 대기열에 나 등록
      await addDoc(queueRef, myData);
      alert("매칭 대기열에 등록되었습니다. 잠시 후 다시 시도해보세요.");
    }
  };

  return (
    <Container>
      <Wrapper>
        {/* 상단 검색 */}
        <TopSearchRow>
          <SearchBar
            ismainpage={true}
            search={mainSearch}
            setSearch={setMainSearch}
            handleSearch={() => fetchCharacter(mainSearch, setMainCharacter)}
          />
          <SearchBar
            ismainpage={true}
            search={subSearch}
            setSearch={setSubSearch}
            handleSearch={() => fetchCharacter(subSearch, setSubCharacter)}
          />
        </TopSearchRow>

        {/* 캐릭터 정보 + 매칭 버튼 */}
        <MatchLayout>
          {/* 본캐 */}
          <CharacterColumn>
            {mainCharacter && (
              <>
                <CharacterImage
                  src={
                    mainCharacter.CharacterImage !== "null"
                      ? mainCharacter.CharacterImage
                      : "/img/default-character.png"
                  }
                />
                <InfoBox>
                  <div className="nickname">{mainCharacter.CharacterName}</div>
                  <div className="server">서버: {mainCharacter.ServerName}</div>
                  <div className="job">
                    직업: {mainCharacter.CharacterClassName}
                  </div>
                </InfoBox>
              </>
            )}
          </CharacterColumn>

          {/* 부캐 */}
          <CharacterColumn>
            {subCharacter && (
              <>
                <CharacterImage
                  src={
                    subCharacter.CharacterImage !== "null"
                      ? subCharacter.CharacterImage
                      : "/img/default-character.png"
                  }
                />
                <InfoBox>
                  <div className="nickname">{subCharacter.CharacterName}</div>
                  <div className="server">서버: {subCharacter.ServerName}</div>
                  <div className="job">
                    직업: {subCharacter.CharacterClassName}
                  </div>
                </InfoBox>
              </>
            )}
          </CharacterColumn>

          {/* 매칭 버튼 */}
          <MatchButton onClick={handleMatch}>매칭</MatchButton>

          {/* 상대 본캐 자리 (매칭 성공 시 표시) */}
          <CharacterColumn>
            {matchedMainCharacter ? (
              <>
                <CharacterImage src={matchedMainCharacter.CharacterImage} />
                <InfoBox>
                  <div className="nickname">
                    {matchedMainCharacter.CharacterName}
                  </div>
                  <div className="server">
                    서버: {matchedMainCharacter.ServerName}
                  </div>
                  <div className="job">
                    직업: {matchedMainCharacter.CharacterClassName}
                  </div>
                </InfoBox>
              </>
            ) : (
              <>
                <CharacterImagePlaceholder />
                <InfoBox>
                  <div className="nickname">-</div>
                  <div className="server">서버: -</div>
                  <div className="job">직업: -</div>
                </InfoBox>
              </>
            )}
          </CharacterColumn>

          {/* 상대 부캐 자리 */}
          <CharacterColumn>
            {matchedSubCharacter ? (
              <>
                <CharacterImage src={matchedSubCharacter.CharacterImage} />
                <InfoBox>
                  <div className="nickname">
                    {matchedSubCharacter.CharacterName}
                  </div>
                  <div className="server">
                    서버: {matchedSubCharacter.ServerName}
                  </div>
                  <div className="job">
                    직업: {matchedSubCharacter.CharacterClassName}
                  </div>
                </InfoBox>
              </>
            ) : (
              <>
                <CharacterImagePlaceholder />
                <InfoBox>
                  <div className="nickname">-</div>
                  <div className="server">서버: -</div>
                  <div className="job">직업: -</div>
                </InfoBox>
              </>
            )}
          </CharacterColumn>
        </MatchLayout>
      </Wrapper>
    </Container>
  );
};

export default JewelFriend;
