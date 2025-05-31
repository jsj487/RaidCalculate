import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import CharacterDetailModal from "../components/CharacterDetailModal";
import fetchCharacterData from "../components/CharacterDetailModal";
import type { MatchedPairState, MatchingUser } from "../utils/Matching";

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
  const [matchedPair, setMatchedPair] = useState<MatchedPairState | null>(null);
  const [myUserInfo, setMyUserInfo] = useState<MatchingUser | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<
    "idle" | "queued" | "matched" | "waiting" | "completed"
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

  const deletedMatchIdRef = useRef<string | null>(null);
  const myUserInfoRef = useRef<MatchingUser | null>(null);

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

  //매칭 성공 시 기존 queue에서 삭제 + jewelMatchedPairs 생성
  const handleMatch = async () => {
    if (!mainCharacter || !subCharacter) return;

    const normalize = (str: string) => str.trim();

    const myData = {
      nickname: mainCharacter.CharacterName,
      subnickname: subCharacter.CharacterName,
      main_class: normalize(mainCharacter.CharacterClassName),
      sub_class: normalize(subCharacter.CharacterClassName),
      server: normalize(mainCharacter.ServerName),
      character_image_main: mainCharacter.CharacterImage,
      character_image_sub: subCharacter.CharacterImage,
    };

    // ✅ 먼저 내 정보 상태 세팅 (insert 전에 반드시 실행)
    setMyUserInfo(myData);
    myUserInfoRef.current = myData; // ✅ useRef도 즉시 업데이트

    // ✅ 엇갈린 조건으로 대기열 조회
    const { data: queueData, error: queueError } = await supabase
      .from("jewel_matching_queue")
      .select("*")
      .eq("server", myData.server)
      .eq("main_class", myData.sub_class)
      .eq("sub_class", myData.main_class)
      .limit(1);

    if (queueError) {
      console.error("❌ 매칭 쿼리 실패:", queueError);
      return;
    }

    if (queueData && queueData.length > 0) {
      // ✅ 매칭 성공
      const matchedData = queueData[0];
      console.log("✅ 매칭 성공:", matchedData);

      await supabase
        .from("jewel_matching_queue")
        .delete()
        .eq("id", matchedData.id);

      await supabase.from("jewel_matched_pairs").insert({
        user_a: myData,
        user_b: matchedData,
        status: {
          userA: "pending",
          userB: "pending",
        },
      });

      setPendingMatchedCharacters({
        main: {
          CharacterName: matchedData.nickname,
          CharacterClassName: matchedData.main_class,
          ServerName: matchedData.server,
          CharacterImage:
            matchedData.character_image_main ?? "/img/default-character.png",
        },
        sub: {
          CharacterName: matchedData.subnickname,
          CharacterClassName: matchedData.sub_class,
          ServerName: matchedData.server,
          CharacterImage:
            matchedData.character_image_sub ?? "/img/default-character.png",
        },
      });
      setMatchingStatus("waiting");
    } else {
      console.log("ℹ️ 매칭 실패 → 대기열 등록");

      // ✅ 같은 캐릭터가 이미 큐에 있으면 삭제
      await supabase
        .from("jewel_matching_queue")
        .delete()
        .or(
          `nickname.eq.${myData.nickname},subnickname.eq.${myData.nickname},nickname.eq.${myData.subnickname},subnickname.eq.${myData.subnickname}`
        );

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

  function setProfile(profile: any): void {
    throw new Error("Function not implemented.");
  }

  const handleAccept = async () => {
    if (!matchedPair) return;

    const key = matchedPair.selfRole;
    const matchId = matchedPair.matchId;

    console.log("📤 수락 요청 시작", {
      match_id: matchId,
      key,
      value: "accepted",
    });

    const { data, error } = await supabase.rpc("update_match_status", {
      match_id: matchedPair.matchId,
      key,
      value: "accepted",
    });

    console.log("📥 수락 결과", { data, error });

    console.log("matchId 원본:", matchedPair.matchId);
    console.log("typeof matchId:", typeof matchedPair.matchId);

    const result = await supabase
      .from("jewel_matched_pairs")
      .select("*")
      .eq("id", matchedPair.matchId);

    console.log("🧾 상태 확인:", result.data?.[0]?.status);

    if (error) {
      console.error("❌ RPC 실패:", error.message);
      return;
    }

    // 👉 내 UI 상태 업데이트만 반영 (실시간 반영은 handlePairChange에서 함)
    setMatchedPair((prev) =>
      prev
        ? {
            ...prev,
            status: {
              ...prev.status,
              myStatus: "accepted",
            },
          }
        : null
    );
  };

  const handleReject = async () => {
    if (!matchedPair) return;

    const key = matchedPair.selfRole;

    // 1. 상태만 rejected로 바꾸기
    await supabase.rpc("update_match_status", {
      match_id: matchedPair.matchId,
      key,
      value: "rejected",
    });

    // 2. 2초 후 삭제 (상대방이 감지할 시간 확보)
    setTimeout(async () => {
      await supabase
        .from("jewel_matched_pairs")
        .delete()
        .eq("id", matchedPair.matchId);
    }, 2000); // 2초 (1000 = 1초)

    setMatchedPair(null);
    setMatchingStatus("idle");
    setMatchedMainCharacter(null);
    setMatchedSubCharacter(null);
  };

  const handlePairChange = (payload: any) => {
    console.log("📡 [handlePairChange] 호출됨");
    console.log("📡 payload.new:", payload.new);
    console.log("📡 deletedMatchIdRef.current:", deletedMatchIdRef.current);

    const newPair = payload.new;
    if (!newPair?.user_a || !newPair?.user_b || !newPair?.status) {
      console.warn("❌ payload에 필요한 필드가 없음", payload);
      return;
    }

    // ✅ 삭제된 row라면 더 이상 반응하지 않도록 return
    if (deletedMatchIdRef.current && deletedMatchIdRef.current === newPair.id) {
      console.warn("🚫 이미 삭제된 row에 대한 update → 무시됨");
      return;
    }

    const a =
      typeof newPair.user_a === "string"
        ? JSON.parse(newPair.user_a)
        : newPair.user_a;
    const b =
      typeof newPair.user_b === "string"
        ? JSON.parse(newPair.user_b)
        : newPair.user_b;
    const rawStatus =
      typeof newPair.status === "string"
        ? JSON.parse(newPair.status)
        : newPair.status;

    console.log("🧍 내 정보:", myUserInfoRef.current);
    console.log("👤 A:", a.nickname, a.subnickname, a.server);
    console.log("👤 B:", b.nickname, b.subnickname, b.server);

    if (!myUserInfoRef.current) {
      console.warn("⚠️ myUserInfoRef가 없음 (초기화 누락 가능)");
      return;
    }

    const isUserA =
      a.nickname === myUserInfoRef.current.nickname &&
      a.subnickname === myUserInfoRef.current.subnickname &&
      a.server === myUserInfoRef.current.server;

    const isUserB =
      b.nickname === myUserInfoRef.current.nickname &&
      b.subnickname === myUserInfoRef.current.subnickname &&
      b.server === myUserInfoRef.current.server;

    console.log("🔎 isUserA:", isUserA);
    console.log("🔎 isUserB:", isUserB);

    if (!isUserA && !isUserB) {
      console.warn("🚫 내가 포함된 매칭이 아님 → 무시");
      return;
    }

    const selfRole = isUserA ? "userA" : "userB";
    const opponent = isUserA ? b : a;

    const status = {
      myStatus: selfRole === "userA" ? rawStatus.userA : rawStatus.userB,
      otherStatus: selfRole === "userA" ? rawStatus.userB : rawStatus.userA,
    };

    console.log("📊 상태:", status);

    if (status.otherStatus === "rejected") {
      alert("상대방이 거절하였습니다.");
      setMatchedPair(null);
      setMatchingStatus("idle");
      return;
    }

    if (rawStatus.userA === "accepted" && rawStatus.userB === "accepted") {
      console.log("🎉 양측 수락 완료 → 모달 닫고 캐릭터 보여줌");

      const main = {
        CharacterName: opponent.nickname,
        CharacterClassName: opponent.class,
        ServerName: opponent.server,
        CharacterImage:
          opponent.character_image_main ?? "/img/default-character.png",
      };
      const sub = {
        CharacterName: opponent.subnickname,
        CharacterClassName: opponent.sub_class,
        ServerName: opponent.server,
        CharacterImage:
          opponent.character_image_sub ?? "/img/default-character.png",
      };

      setMatchedMainCharacter(main);
      setMatchedSubCharacter(sub);
      setMatchedPair(null);
      setMatchingStatus("completed");
      return; // ✅ 아래 코드 실행 방지
    }

    console.log("🤝 매칭 상대:", opponent.nickname, opponent.subnickname);
    setMatchedPair({
      selfRole,
      opponent,
      status: {
        myStatus: selfRole === "userA" ? rawStatus.userA : rawStatus.userB,
        otherStatus: selfRole === "userA" ? rawStatus.userB : rawStatus.userA,
      },
      matchId: newPair.id,
    });
  };

  const handlePairDeleted = (payload: any) => {
    const oldPair = payload.old;
    if (!oldPair?.user_a || !oldPair?.user_b) return;

    const a =
      typeof oldPair.user_a === "string"
        ? JSON.parse(oldPair.user_a)
        : oldPair.user_a;
    const b =
      typeof oldPair.user_b === "string"
        ? JSON.parse(oldPair.user_b)
        : oldPair.user_b;

    const me = myUserInfoRef.current;
    if (!me) return;

    const isUserA =
      a.nickname === me.nickname &&
      a.subnickname === me.subnickname &&
      a.server === me.server;

    const isUserB =
      b.nickname === me.nickname &&
      b.subnickname === me.subnickname &&
      b.server === me.server;

    if (!isUserA && !isUserB) return;

    // ❗ 이미 사라진 매칭이면 더 이상 반응 안 하도록 방어
    deletedMatchIdRef.current = oldPair.id || null;

    setMatchedPair(null);
    setMatchingStatus("idle");
    setMatchedMainCharacter(null);
    setMatchedSubCharacter(null);

    alert("상대방이 거절했습니다.");
  };

  useEffect(() => {
    const channel = supabase
      .channel("match-pair-watch")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "jewel_matched_pairs",
        },
        handlePairChange
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "jewel_matched_pairs",
        },
        handlePairChange
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "jewel_matched_pairs" },
        (payload) => {
          console.log("❌ DELETE 감지됨", payload);
          handlePairDeleted(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const cleanupBeforeUnload = async () => {
      const savedMain = localStorage.getItem("mainSearch");

      if (!savedMain) return;

      console.log("🧹 페이지 이탈: 매칭 관련 정리 중...");

      // 1. queue에서 내 닉네임 삭제
      await supabase
        .from("jewel_matching_queue")
        .delete()
        .or(`nickname.eq.${savedMain},subnickname.eq.${savedMain}`);

      // 2. matched_pairs에서 내 닉네임 포함된 쌍 삭제
      await supabase
        .from("jewel_matched_pairs")
        .delete()
        .or(
          `user_a->>nickname.eq.${savedMain},user_b->>nickname.eq.${savedMain},user_a->>subnickname.eq.${savedMain},user_b->>subnickname.eq.${savedMain}`
        );

      console.log("매칭 관련 정리 완료");
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 백그라운드 async 요청은 보장되지 않지만 트리거는 할 수 있음
      cleanupBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const savedMain = localStorage.getItem("mainSearch");
    const savedSub = localStorage.getItem("subSearch");

    if (savedMain) setMainSearch(savedMain);
    if (savedSub) setSubSearch(savedSub);
  }, []);

  const shouldShowModal =
    matchedPair &&
    matchedPair.status.myStatus !== "rejected" &&
    (matchedPair.status.myStatus === "pending" ||
      (matchedPair.status.myStatus === "accepted" &&
        matchedPair.status.otherStatus === "pending"));

  const isWaitingForOther =
    matchedPair?.status.myStatus === "accepted" &&
    matchedPair?.status.otherStatus === "pending";

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
          matchedPair={null}
        />
      )}

      {shouldShowModal && (
        <CharacterDetailModal
          characterName={matchedPair.opponent.nickname}
          matchedPair={matchedPair}
          isMatchedView={true}
          waitingForOther={isWaitingForOther}
          loading={loading}
          onAccept={handleAccept}
          onReject={handleReject}
          onClose={() => setMatchedPair(null)}
        />
      )}
    </Container>
  );
};

export default JewelFriend;
