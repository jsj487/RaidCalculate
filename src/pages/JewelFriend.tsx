import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import CharacterDetailModal from "../components/CharacterDetailModal";
import fetchCharacterData from "../components/CharacterDetailModal";
import { Helmet } from "react-helmet";

import { supabase } from "../utils/SupabaseClient";
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

  // const cleanUpPreviousMatches = async (nickname: string) => {
  //   const matchRef = collection(db, "jewelMatchedPairs");

  //   const q1 = query(matchRef, where("userA.nickname", "==", nickname));
  //   const q2 = query(matchRef, where("userB.nickname", "==", nickname));

  //   const snap1 = await getDocs(q1);
  //   const snap2 = await getDocs(q2);

  //   [...snap1.docs, ...snap2.docs].forEach(async (doc) => {
  //     await deleteDoc(doc.ref);
  //   });
  // };

  //매칭 성공 시 기존 queue에서 삭제 + jewelMatchedPairs 생성
  const handleMatch = async () => {
    if (!mainCharacter || !subCharacter) return;

    // 현재 내 정보 구성
    const myData = {
      nickname: mainCharacter.CharacterName,
      subnickname: subCharacter.CharacterName,
      main_class: mainCharacter.CharacterClassName,
      sub_class: subCharacter.CharacterClassName,
      server: mainCharacter.ServerName,
      character_image_main: mainCharacter.CharacterImage,
      character_image_sub: subCharacter.CharacterImage,
    };

    // Supabase: 반대 쌍 찾기 (내 본캐 = 상대 부캐, 내 부캐 = 상대 본캐)
    const { data: queueData, error: queueError } = await supabase
      .from("jewel_matching_queue")
      .select("*")
      .eq("server", myData.server)
      .eq("main_class", myData.sub_class)
      .eq("sub_class", myData.main_class)
      .limit(1);

    if (queueError) {
      console.error("매칭 쿼리 실패", queueError);
      return;
    }

    if (queueData && queueData.length > 0) {
      const matchedData = queueData[0];
      console.log("매칭 대상 있음?", queueData);
      // 대기열에서 제거
      await supabase
        .from("jewel_matching_queue")
        .delete()
        .eq("id", matchedData.id);

      // 매칭된 쌍 생성
      await supabase.from("jewel_matched_pairs").insert({
        user_a: myData,
        user_b: matchedData,
        status: {
          userA: "pending",
          userB: "pending",
        },
      });

      setMatchingStatus("matched");
    } else {
      // 매칭 실패 → 대기열 등록
      await supabase.from("jewel_matching_queue").insert(myData);
      setMatchingStatus("queued");
    }
  };

  const handleCancelMatch = async () => {
    if (!mainCharacter) return;

    const myNickname = mainCharacter.CharacterName;

    // 1. 대기열(jewel_matching_queue)에서 제거
    const { data: queueData, error: queueError } = await supabase
      .from("jewel_matching_queue")
      .delete()
      .eq("nickname", myNickname);

    if (queueError) {
      console.error("❌ 대기열 삭제 실패:", queueError.message);
    }

    // 2. 매칭된 항목(jewel_matched_pairs)에서 userA 또는 userB로 포함된 row 제거
    const { error: pairDeleteError } = await supabase
      .from("jewel_matched_pairs")
      .delete()
      .or(
        `user_a->>nickname.eq.${myNickname},user_b->>nickname.eq.${myNickname}`
      );

    if (pairDeleteError) {
      console.error("❌ 매칭 쌍 삭제 실패:", pairDeleteError.message);
    }

    // 3. 상태 초기화
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

    const myNickname = mainCharacter.CharacterName;

    const channel = supabase
      .channel("jewel-matching-watch")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jewel_matched_pairs",
        },
        async (payload) => {
          const data = payload.new;
          const status = data.status;
          const userA = data.user_a;
          const userB = data.user_b;
          const createdAt = new Date(data.created_at).getTime();
          const now = Date.now();

          const isUserA = userA.nickname === myNickname;
          const isUserB = userB.nickname === myNickname;
          if (!isUserA && !isUserB) return;

          const char = isUserA ? userB : userA;

          // 5분 초과 → 자동 삭제
          if (createdAt && now - createdAt > 5 * 60 * 1000) {
            await supabase
              .from("jewel_matched_pairs")
              .delete()
              .eq("id", data.id);
            return;
          }

          // 초기 상태 → queued로 전환
          if (matchingStatus === "idle") {
            setMatchingStatus("queued");
          }

          // 쌍방 수락
          if (status.userA === "accepted" && status.userB === "accepted") {
            setMatchedMainCharacter({
              CharacterName: char.nickname,
              CharacterClassName: char.mainClass,
              ServerName: char.server,
              CharacterImage:
                char.characterImageMain ?? "/img/default-character.png",
            });
            setMatchedSubCharacter({
              CharacterName: char.subnickname,
              CharacterClassName: char.subClass,
              ServerName: char.server,
              CharacterImage:
                char.characterImageSub ?? "/img/default-character.png",
            });
            setPendingMatchedCharacters(null);
            setMatchingStatus("completed");
            return;
          }

          // 상대방이 거절함
          const rejectedByOther =
            (isUserA && status.userB === "rejected") ||
            (isUserB && status.userA === "rejected");

          if (rejectedByOther) {
            setTimeout(() => {
              alert("상대방이 거절했습니다.");
            }, 100);
            setPendingMatchedCharacters(null);
            setMatchingStatus("idle");
            return;
          }

          // 내가 pending이고, 상대가 거절도 수락도 안 했을 때
          const myStatus = isUserA ? status.userA : status.userB;
          const otherStatus = isUserA ? status.userB : status.userA;
          const waiting =
            otherStatus !== "accepted" && otherStatus !== "rejected";

          if (myStatus === "pending" && !rejectedByOther) {
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
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mainCharacter]);

  //창 닫힘 시 jewelMatchedPairs 정리도 추가
  useEffect(() => {
    const handleUnload = async () => {
      if (!mainCharacter) return;
      const nickname = mainCharacter.CharacterName;

      // 1. 매칭된 쌍 중 내가 들어간 것 제거 (userA 또는 userB)
      const { error: pairDeleteError } = await supabase
        .from("jewel_matched_pairs")
        .delete()
        .or(
          `user_a->>nickname.eq.${nickname},user_b->>nickname.eq.${nickname}`
        );

      if (pairDeleteError) {
        console.error("jewel_matched_pairs 삭제 실패", pairDeleteError.message);
      }

      // 2. 대기열 제거
      const { error: queueDeleteError } = await supabase
        .from("jewel_matching_queue")
        .delete()
        .eq("nickname", nickname);

      if (queueDeleteError) {
        console.error(
          "jewel_matching_queue 삭제 실패",
          queueDeleteError.message
        );
      }
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
      <Helmet>
        <title>보석 깐부 찾기 - ArkLator</title>
        <meta name="description" content="로스트아크 보석 품앗이 상대 찾기" />
      </Helmet>
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

            const myNickname = mainCharacter.CharacterName;

            // 1. 매칭된 문서 중 내가 포함된 것 조회
            const { data, error } = await supabase
              .from("jewel_matched_pairs")
              .select("*")
              .or(
                `user_a->>nickname.eq.${myNickname},user_b->>nickname.eq.${myNickname}`
              );

            if (error) {
              console.error("❌ 매칭 조회 실패", error.message);
              setLoading(false);
              return;
            }

            // 2. 각 row에 대해 상태 갱신
            if (data) {
              for (const row of data) {
                const isUserA = row.user_a.nickname === myNickname;
                const updatedStatus = {
                  ...row.status,
                  [isUserA ? "userA" : "userB"]: "accepted",
                };

                await supabase
                  .from("jewel_matched_pairs")
                  .update({ status: updatedStatus })
                  .eq("id", row.id);
              }
            }

            setLoading(false);
          }}
          onReject={async () => {
            if (!mainCharacter) return;

            const myNickname = mainCharacter.CharacterName;

            // 1. 내가 포함된 매칭 쌍 조회
            const { data, error } = await supabase
              .from("jewel_matched_pairs")
              .select("*")
              .or(
                `user_a->>nickname.eq.${myNickname},user_b->>nickname.eq.${myNickname}`
              );

            if (error) {
              console.error("매칭 조회 실패", error.message);
              return;
            }

            // 2. 상태를 'rejected'로 갱신
            if (data) {
              for (const row of data) {
                const isUserA = row.user_a.nickname === myNickname;
                const updatedStatus = {
                  ...row.status,
                  [isUserA ? "userA" : "userB"]: "rejected",
                };

                await supabase
                  .from("jewel_matched_pairs")
                  .update({ status: updatedStatus })
                  .eq("id", row.id);
              }
            }

            // 3. UI 상태 초기화
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
