import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import CharacterDetailModal from "../components/CharacterDetailModal";
import fetchCharacterData from "../components/CharacterDetailModal";

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

const MatchButton = styled.button<{ isMatching: boolean }>`
  padding: 20px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  background-color: ${(props) => (props.isMatching ? "#aa3333" : "#0077cc")};
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isMatching ? "#992222" : "#005fa3")};
  }
`;

const JewelFriend = () => {
  const [mainSearch, setMainSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchedMainCharacter, setMatchedMainCharacter] = useState<any>(null);
  const [matchedSubCharacter, setMatchedSubCharacter] = useState<any>(null);
  const [mainCharacter, setMainCharacter] = useState<any>(null);
  const [subCharacter, setSubCharacter] = useState<any>(null);
  const [mainJewels, setMainJewels] = useState<any[]>([]);
  const [selectedCharacterName, setSelectedCharacterName] = useState<
    string | null
  >(null);

  const fetchCharacter = async (
    nickname: string,
    setCharacter: (char: any) => void,
    setJewels?: (jewels: any[]) => void,
    setProfile?: (profile: any) => void
  ) => {
    console.log("🔍 캐릭터 검색 요청:", nickname);

    try {
      const res = await axios.get(`${BASE_URL}/characters/siblings`, {
        params: { name: nickname },
      });

      const matchedChar = res.data.find(
        (char: any) => char.CharacterName === nickname
      );

      if (!matchedChar) {
        alert("닉네임과 일치하는 캐릭터를 찾을 수 없습니다.");
        return;
      }

      setCharacter(matchedChar);

      if (setJewels) {
        const jewels = await fetchEquippedGems(matchedChar.CharacterName);
        setJewels(jewels);
      }

      if (setProfile) {
        const profile = await fetchCharacterData(
          matchedChar.CharacterName,
          "profiles"
        );
        setProfile(profile);
      }
    } catch (err) {
      console.error("❌ 캐릭터 검색 실패", err);
    }
  };

  const handleMatch = async () => {
    if (!mainCharacter || !subCharacter) {
      alert("본캐와 부캐 정보를 모두 입력하세요.");
      return;
    }

    const myData = {
      nickname: mainCharacter.CharacterName,
      subnickname: subCharacter.CharacterName,
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

      setMatchedMainCharacter({
        CharacterName: matchedData.nickname,
        CharacterClassName: matchedData.mainClass,
        ServerName: matchedData.server,
        CharacterImage:
          !matchedData.characterImageMain ||
          matchedData.characterImageMain === "null"
            ? "/img/default-character.png"
            : matchedData.characterImageMain,
      });

      setMatchedSubCharacter({
        CharacterName: matchedData.subnickname,
        CharacterClassName: matchedData.subClass,
        ServerName: matchedData.server,
        CharacterImage:
          !matchedData.characterImageSub ||
          matchedData.characterImageSub === "null"
            ? "/img/default-character.png"
            : matchedData.characterImageSub,
      });

      console.log("매칭된 닉네임:", matchedData.nickname);

      // 3. 매칭된 상대, 나 둘 다 queue에서 삭제
      await deleteDoc(matchedDoc.ref);
    } else {
      // 4. 매칭 안 됨 → 대기열에 나 등록
      await addDoc(queueRef, {
        ...myData,
        characterImageMain: mainCharacter.CharacterImage,
        characterImageSub: subCharacter.CharacterImage,
      });
      setIsMatching(true); // 매칭 등록 후 상태 전환
    }
  };

  const handleCancelMatch = async () => {
    if (!mainCharacter) return;

    const q = query(
      collection(db, "jewelMatchingQueue"),
      where("nickname", "==", mainCharacter.CharacterName)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    setMatchedMainCharacter(null);
    setMatchedSubCharacter(null);
    setIsMatching(false);
  };

  const fetchEquippedGems = async (nickname: string): Promise<any[]> => {
    console.log("🔍 보석 API 요청 대상 닉네임:", nickname); // ✅ 여기

    if (!nickname) {
      console.warn("❌ 닉네임이 유효하지 않습니다:", nickname);
      return [];
    }

    try {
      const res = await axios.get(`${BASE_URL}/characters/gems`, {
        params: { name: nickname }, // 서버에 전달될 name 쿼리
      });

      console.log("💎 보석 API 응답:", res.data); // ✅ 응답 확인

      if (Array.isArray(res.data.Gems)) {
        return res.data.Gems;
      } else {
        console.warn("❗️Gems 데이터가 배열이 아님:", res.data);
        return [];
      }
    } catch (err) {
      console.error("보석 정보 실패", err);
      return [];
    }
  };

  useEffect(() => {
    const handleUnload = async () => {
      if (isMatching) {
        const q = query(
          collection(db, "jewelMatchingQueue"),
          where("nickname", "==", mainCharacter?.CharacterName)
        );
        const snap = await getDocs(q);
        snap.forEach((doc) => deleteDoc(doc.ref));
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [isMatching, mainCharacter]);

  function setProfile(profile: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Container>
      <Wrapper>
        {/* 상단 검색 */}
        <TopSearchRow>
          <SearchBar
            ismainpage={true}
            search={mainSearch}
            setSearch={setMainSearch}
            handleSearch={() =>
              fetchCharacter(
                mainSearch,
                setMainCharacter,
                setMainJewels,
                setProfile
              )
            }
            placeholder="본캐 닉네임 입력"
          />

          <SearchBar
            ismainpage={true}
            search={subSearch}
            setSearch={setSubSearch}
            handleSearch={() => fetchCharacter(subSearch, setSubCharacter)}
            placeholder="부캐 닉네임 입력"
          />
        </TopSearchRow>
        {/* 캐릭터 정보 + 매칭 버튼 */}
        <MatchLayout>
          {/* 본캐 */}
          <CharacterColumn
            onClick={() => {
              if (mainCharacter) {
                setSelectedCharacterName(mainCharacter.CharacterName);
              }
            }}
            style={{
              cursor: mainCharacter ? "pointer" : "default",
              opacity: mainCharacter ? 1 : 0.5,
            }}
          >
            {mainCharacter ? (
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

          {/* 부캐 */}
          <CharacterColumn
            onClick={() => {
              if (subCharacter) {
                setSelectedCharacterName(subCharacter.CharacterName);
              }
            }}
            style={{
              cursor: subCharacter ? "pointer" : "default",
              opacity: subCharacter ? 1 : 0.5,
            }}
          >
            {subCharacter ? (
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

          {/* 매칭 버튼 */}
          <MatchButton
            onClick={isMatching ? handleCancelMatch : handleMatch}
            isMatching={isMatching}
          >
            {isMatching ? "매칭 취소" : "매칭 찾기"}
          </MatchButton>
          {/* 상대 본캐 자리 (매칭 성공 시 표시) */}
          <CharacterColumn
            onClick={() => {
              if (matchedMainCharacter) {
                setSelectedCharacterName(matchedMainCharacter.CharacterName);
              }
            }}
            style={{
              cursor: matchedMainCharacter ? "pointer" : "default",
              opacity: matchedMainCharacter ? 1 : 0.5,
            }}
          >
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
          <CharacterColumn
            onClick={() => {
              if (matchedSubCharacter) {
                setSelectedCharacterName(matchedSubCharacter.CharacterName);
              }
            }}
            style={{
              cursor: matchedSubCharacter ? "pointer" : "default",
              opacity: matchedSubCharacter ? 1 : 0.5,
            }}
          >
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

      {selectedCharacterName && (
        <CharacterDetailModal
          characterName={selectedCharacterName}
          onClose={() => setSelectedCharacterName(null)}
        />
      )}
    </Container>
  );
};

export default JewelFriend;
