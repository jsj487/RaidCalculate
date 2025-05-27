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
  onSnapshot,
  updateDoc,
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

const StyledMatchButton = styled.button`
  background-color: #2c2c2c;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 30px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgb(83, 83, 83);
  }
`;

const JewelFriend = () => {
  const [mainSearch, setMainSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [matchingStatus, setMatchingStatus] = useState<
    "idle" | "queued" | "matched" | "completed"
  >("idle");
  const [matchedMainCharacter, setMatchedMainCharacter] = useState<any>(null);
  const [matchedSubCharacter, setMatchedSubCharacter] = useState<any>(null);
  const [mainCharacter, setMainCharacter] = useState<any>(null);
  const [subCharacter, setSubCharacter] = useState<any>(null);
  const [mainJewels, setMainJewels] = useState<any[]>([]);
  const [subJewels, setSubJewels] = useState<any[]>([]);
  const [selectedCharacterName, setSelectedCharacterName] = useState<
    string | null
  >(null);
  const [pendingMatchedCharacters, setPendingMatchedCharacters] = useState<{
    main: any;
    sub: any;
    waitingForOther?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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

  const cleanUpPreviousMatches = async (nickname: string) => {
    const matchRef = collection(db, "jewelMatchedPairs");

    const q1 = query(matchRef, where("userA.nickname", "==", nickname));
    const q2 = query(matchRef, where("userB.nickname", "==", nickname));

    const snap1 = await getDocs(q1);
    const snap2 = await getDocs(q2);

    [...snap1.docs, ...snap2.docs].forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  };

  //매칭 성공 시 기존 queue에서 삭제 + jewelMatchedPairs 생성
  const handleMatch = async () => {
    if (!mainCharacter || !subCharacter) return;

    await cleanUpPreviousMatches(mainCharacter.CharacterName);

    const queueRef = collection(db, "jewelMatchingQueue");
    const matchRef = collection(db, "jewelMatchedPairs");

    const myData = {
      nickname: mainCharacter.CharacterName,
      subnickname: subCharacter.CharacterName,
      mainClass: mainCharacter.CharacterClassName,
      subClass: subCharacter.CharacterClassName,
      server: mainCharacter.ServerName,
      characterImageMain: mainCharacter.CharacterImage,
      characterImageSub: subCharacter.CharacterImage,
      timestamp: serverTimestamp(),
    };

    const q = query(
      queueRef,
      where("server", "==", myData.server),
      where("mainClass", "==", myData.subClass),
      where("subClass", "==", myData.mainClass)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const matchedDoc = snapshot.docs[0];
      const matchedData = matchedDoc.data();

      await deleteDoc(matchedDoc.ref);

      await addDoc(matchRef, {
        userA: myData,
        userB: matchedData,
        status: {
          userA: "pending",
          userB: "pending",
        },
        createdAt: serverTimestamp(),
      });
    } else {
      await addDoc(queueRef, myData);
      setMatchingStatus("queued");
    }
  };

  const handleCancelMatch = async () => {
    if (!mainCharacter) return;

    // queue 제거
    const queueRef = collection(db, "jewelMatchingQueue");
    const q = query(
      queueRef,
      where("nickname", "==", mainCharacter.CharacterName)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    // jewelMatchedPairs 제거도 함께!
    const matchRef = collection(db, "jewelMatchedPairs");
    const q1 = query(
      matchRef,
      where("userA.nickname", "==", mainCharacter.CharacterName)
    );
    const q2 = query(
      matchRef,
      where("userB.nickname", "==", mainCharacter.CharacterName)
    );
    const snap1 = await getDocs(q1);
    const snap2 = await getDocs(q2);

    snap1.forEach((doc) => deleteDoc(doc.ref));
    snap2.forEach((doc) => deleteDoc(doc.ref));

    setMatchedMainCharacter(null);
    setMatchedSubCharacter(null);
    setMatchingStatus("idle");
    setPendingMatchedCharacters(null);
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
    if (!mainCharacter) return;

    const matchRef = collection(db, "jewelMatchedPairs");

    const unsubA = onSnapshot(
      query(
        matchRef,
        where("userA.nickname", "==", mainCharacter.CharacterName)
      ),
      (snap) => {
        snap.forEach((doc) => {
          const data = doc.data();
          const char = data.userB;
          const createdAt = data.createdAt?.toDate().getTime();
          const now = Date.now();

          if (
            data.userA.nickname === mainCharacter.CharacterName &&
            matchingStatus === "idle"
          ) {
            setMatchingStatus("queued");
          }

          // 5분 지나면 문서 자동 삭제
          if (createdAt && now - createdAt > 5 * 60 * 1000) {
            deleteDoc(doc.ref);
            return;
          }

          // 쌍방 수락
          if (
            data.status.userA === "accepted" &&
            data.status.userB === "accepted"
          ) {
            const c = data.userB;
            setMatchedMainCharacter({
              CharacterName: c.nickname,
              CharacterClassName: c.mainClass,
              ServerName: c.server,
              CharacterImage:
                c.characterImageMain ?? "/img/default-character.png",
            });
            setMatchedSubCharacter({
              CharacterName: c.subnickname,
              CharacterClassName: c.subClass,
              ServerName: c.server,
              CharacterImage:
                c.characterImageSub ?? "/img/default-character.png",
            });
            setPendingMatchedCharacters(null);
            setMatchingStatus("completed");
          }

          // 상대가 거절했을 경우
          else if (data.status.userB === "rejected") {
            setTimeout(() => {
              alert("상대방이 거절했습니다.");
            }, 100);
            setPendingMatchedCharacters(null);
            setMatchingStatus("idle");
          }

          // 내가 pending 상태이고, 상대가 거절한 게 아닐 때만
          else if (
            data.status.userA === "pending" &&
            data.status.userB !== "rejected"
          ) {
            const waiting =
              data.status.userB !== "accepted" &&
              data.status.userB !== "rejected";

            setPendingMatchedCharacters({
              main: {
                CharacterName: char.nickname,
                CharacterClassName: char.mainClass,
                ServerName: char.server,
                CharacterImage:
                  !char.characterImageMain || char.characterImageMain === "null"
                    ? "/img/default-character.png"
                    : char.characterImageMain,
              },
              sub: {
                CharacterName: char.subnickname,
                CharacterClassName: char.subClass,
                ServerName: char.server,
                CharacterImage:
                  !char.characterImageSub || char.characterImageSub === "null"
                    ? "/img/default-character.png"
                    : char.characterImageSub,
              },
              waitingForOther: waiting,
            });
          }
        });
      }
    );

    const unsubB = onSnapshot(
      query(
        matchRef,
        where("userB.nickname", "==", mainCharacter.CharacterName)
      ),
      (snap) => {
        snap.forEach((doc) => {
          const data = doc.data();
          const char = data.userA;
          const createdAt = data.createdAt?.toDate().getTime();
          const now = Date.now();

          if (
            data.userA.nickname === mainCharacter.CharacterName &&
            matchingStatus === "idle"
          ) {
            setMatchingStatus("queued");
          }

          // 5분 초과 시 자동 삭제
          if (createdAt && now - createdAt > 5 * 60 * 1000) {
            deleteDoc(doc.ref);
            return;
          }

          // 쌍방 수락 완료
          if (
            data.status.userB === "accepted" &&
            data.status.userA === "accepted"
          ) {
            const c = data.userA;
            setMatchedMainCharacter({
              CharacterName: c.nickname,
              CharacterClassName: c.mainClass,
              ServerName: c.server,
              CharacterImage:
                c.characterImageMain ?? "/img/default-character.png",
            });
            setMatchedSubCharacter({
              CharacterName: c.subnickname,
              CharacterClassName: c.subClass,
              ServerName: c.server,
              CharacterImage:
                c.characterImageSub ?? "/img/default-character.png",
            });
            setPendingMatchedCharacters(null);
            setMatchingStatus("completed");
          }

          // 상대가 거절했을 경우
          else if (data.status.userA === "rejected") {
            setTimeout(() => {
              alert("상대방이 거절했습니다.");
            }, 100);
            setPendingMatchedCharacters(null);
            setMatchingStatus("idle");
          }

          // 대기 중 상태 (단, 거절되지 않았을 때만)
          else if (
            data.status.userB === "pending" &&
            data.status.userA !== "rejected"
          ) {
            const waiting =
              data.status.userA !== "accepted" &&
              data.status.userA !== "rejected";

            setPendingMatchedCharacters({
              main: {
                CharacterName: char.nickname,
                CharacterClassName: char.mainClass,
                ServerName: char.server,
                CharacterImage:
                  !char.characterImageMain || char.characterImageMain === "null"
                    ? "/img/default-character.png"
                    : char.characterImageMain,
              },
              sub: {
                CharacterName: char.subnickname,
                CharacterClassName: char.subClass,
                ServerName: char.server,
                CharacterImage:
                  !char.characterImageSub || char.characterImageSub === "null"
                    ? "/img/default-character.png"
                    : char.characterImageSub,
              },
              waitingForOther: waiting,
            });
          }
        });
      }
    );

    return () => {
      unsubA();
      unsubB();
    };
  }, [mainCharacter]);

  //창 닫힘 시 jewelMatchedPairs 정리도 추가
  useEffect(() => {
    const handleUnload = async () => {
      if (!mainCharacter) return;

      // jewelMatchedPairs 문서 삭제
      const matchRef = collection(db, "jewelMatchedPairs");
      const q1 = query(
        matchRef,
        where("userA.nickname", "==", mainCharacter.CharacterName)
      );
      const q2 = query(
        matchRef,
        where("userB.nickname", "==", mainCharacter.CharacterName)
      );
      const snap1 = await getDocs(q1);
      const snap2 = await getDocs(q2);
      snap1.forEach((doc) => deleteDoc(doc.ref));
      snap2.forEach((doc) => deleteDoc(doc.ref));

      // 🔹 jewelMatchingQueue 문서 삭제
      const queueRef = collection(db, "jewelMatchingQueue");
      const q = query(
        queueRef,
        where("nickname", "==", mainCharacter.CharacterName)
      );
      const snap = await getDocs(q);
      snap.forEach((doc) => deleteDoc(doc.ref));
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [mainCharacter]);

  function setProfile(profile: any): void {
    throw new Error("Function not implemented.");
  }

  useEffect(() => {
    const savedMain = localStorage.getItem("mainSearch");
    const savedSub = localStorage.getItem("subSearch");

    if (savedMain) setMainSearch(savedMain);
    if (savedSub) setSubSearch(savedSub);
  }, []);

  return (
    <Container>
      <Wrapper>
        {/* 상단 검색 */}
        <TopSearchRow>
          <SearchBar
            ismainpage={true}
            search={mainSearch}
            setSearch={setMainSearch}
            handleSearch={() => {
              localStorage.setItem("mainSearch", mainSearch);
              fetchCharacter(
                mainSearch,
                setMainCharacter,
                setMainJewels,
                setProfile
              );
            }}
            placeholder="본캐 닉네임 입력"
          />

          <SearchBar
            ismainpage={true}
            search={subSearch}
            setSearch={setSubSearch}
            handleSearch={() => {
              localStorage.setItem("subSearch", subSearch);
              fetchCharacter(
                subSearch,
                setSubCharacter,
                setSubJewels,
                setProfile
              );
            }}
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
          {matchingStatus === "idle" && (
            <StyledMatchButton onClick={handleMatch}>
              매칭 찾기
            </StyledMatchButton>
          )}

          {/* 매칭 중 상태 버튼 */}
          {matchingStatus === "queued" && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  src="/img/Loading_icon.gif"
                  alt="로딩 중"
                  style={{ width: "60px", height: "60px", marginBottom: "8px" }}
                />

                <StyledMatchButton onClick={handleCancelMatch}>
                  매칭 취소
                </StyledMatchButton>
              </div>
            </>
          )}

          {/*매칭 완료 상태 버튼 */}
          {matchingStatus === "completed" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  marginBottom: "10px",
                  fontSize: "20px",
                  fontWeight: "700",
                }}
              >
                매칭 완료
              </div>
              <StyledMatchButton onClick={handleCancelMatch}>
                매칭 취소
              </StyledMatchButton>
            </div>
          )}

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

      {pendingMatchedCharacters && (
        <CharacterDetailModal
          characterName={pendingMatchedCharacters.main?.CharacterName}
          isMatchedView={true}
          waitingForOther={pendingMatchedCharacters.waitingForOther}
          loading={loading}
          onAccept={async () => {
            setLoading(true);

            if (!mainCharacter) return;

            const matchRef = collection(db, "jewelMatchedPairs");

            const q1 = query(
              matchRef,
              where("userA.nickname", "==", mainCharacter.CharacterName)
            );
            const q2 = query(
              matchRef,
              where("userB.nickname", "==", mainCharacter.CharacterName)
            );

            const snap1 = await getDocs(q1);
            const snap2 = await getDocs(q2);

            [...snap1.docs, ...snap2.docs].forEach(async (doc) => {
              const current = doc.data();
              const isUserA =
                current.userA.nickname === mainCharacter.CharacterName;

              const updatedStatus = {
                ...current.status,
                [isUserA ? "userA" : "userB"]: "accepted",
              };

              await updateDoc(doc.ref, { status: updatedStatus });
            });
          }}
          onReject={async () => {
            if (!mainCharacter) return;

            const matchRef = collection(db, "jewelMatchedPairs");

            const q1 = query(
              matchRef,
              where("userA.nickname", "==", mainCharacter.CharacterName)
            );
            const q2 = query(
              matchRef,
              where("userB.nickname", "==", mainCharacter.CharacterName)
            );

            const snap1 = await getDocs(q1);
            const snap2 = await getDocs(q2);

            [...snap1.docs, ...snap2.docs].forEach(async (doc) => {
              const current = doc.data();
              const isUserA =
                current.userA.nickname === mainCharacter.CharacterName;

              const updatedStatus = {
                ...current.status,
                [isUserA ? "userA" : "userB"]: "rejected",
              };

              await updateDoc(doc.ref, { status: updatedStatus });
            });

            setPendingMatchedCharacters(null);
            setMatchingStatus("idle");
          }}
          onClose={() => setPendingMatchedCharacters(null)}
        />
      )}
    </Container>
  );
};

export default JewelFriend;
