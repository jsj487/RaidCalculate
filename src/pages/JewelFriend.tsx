import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { FaUserPlus } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";

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
  padding-top: 80px;
  padding-bottom: 60px;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px; // CharacterColumn과 동일하게 맞춤
  gap: 10px;
`;

const CharacterInputRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;

  & > div:not(:last-child) {
    margin-right: 80px;
  }
`;

const AddColumn = styled.div`
  width: 200px;
  height: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #888;
  background-color: #1e1e1e;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

  &:hover {
    border-color: #aaa;
    background-color: #2a2a2a;
  }

  svg {
    width: 48px;
    height: 48px;
    fill: #ccc;
  }
`;

const PlusIcon = styled(FaUserPlus)`
  font-size: 48px;
  color: #aaa;

  &:hover {
    color: #777;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: #ff4d4d;
    border-color: #ffa0a0;
    color: white;
  }
`;

const MatchLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center; /* 요거 핵심! */
  gap: 60px;
`;

// const CharacterColumn = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 200px;
//   height: 340px;
//   background-color: #e2e2e2;
//   border-radius: 12px;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
//   padding: 16px;
//   gap: 16px;
// `;

const CharacterColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
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
  display: flex;
  align-items: center;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
`;

const ScrollableBox = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px; /* 내용 잘림 방지용 */

  /* 스크롤바 커스터마이징 (Chrome, Edge, Safari) */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #222;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
    border: 2px solid #222; /* 트랙과 자연스럽게 연결 */
  }

  /* Firefox용 스크롤바 */
  scrollbar-width: thin;
  scrollbar-color: #666 #222;
`;

type PendingMatchedCharacters = {
  main: {
    CharacterName: string;
    CharacterClassName: string;
    ServerName: string;
    CharacterImage: string;
  };
  sub: {
    CharacterName: string;
    CharacterClassName: string;
    ServerName: string;
    CharacterImage: string;
  };
};

const JewelFriend = () => {
  const [mainSearch, setMainSearch] = useState("");
  const [subSearch, setSubSearch] = useState("");
  const [matchedPair, setMatchedPair] = useState<MatchedPairState | null>(null);
  const [myUserInfo, setMyUserInfo] = useState<MatchingUser | null>(null);
  const [matchingStatus, setMatchingStatus] = useState<
    "idle" | "queued" | "waiting" | "completed"
  >("idle");
  const [matchedMainCharacter, setMatchedMainCharacter] = useState<any>(null);
  const [matchedSubCharacter, setMatchedSubCharacter] = useState<any>(null);
  const [mainCharacter, setMainCharacter] = useState<any>(null);
  const [subCharacterList, setSubCharacterList] = useState<any[]>([]);
  const [mainJewels, setMainJewels] = useState<any[]>([]);
  const [subJewels, setSubJewels] = useState<any[]>([]);
  const [subSearchList, setSubSearchList] = useState<string[]>([""]);
  const [selectedCharacterName, setSelectedCharacterName] = useState<
    string | null
  >(null);

  const [pendingMatchedCharacters, setPendingMatchedCharacters] =
    useState<PendingMatchedCharacters | null>(null);

  const [loading, setLoading] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [queueList, setQueueList] = useState<Record<string, any[]>>({});
  const [queueData, setQueueData] = useState<MatchingUser[]>([]);
  const [myMatchedCharacter, setMyMatchedCharacter] =
    useState<CharacterData | null>(null); // 내 부캐 중 매
  const deletedMatchIdRef = useRef<string | null>(null);
  const myUserInfoRef = useRef<MatchingUser | null>(null);

  const fetchCharacter = async (
    nickname: string,
    setCharacter: (char: any) => void,
    setJewels?: (jewels: any[]) => void,
    setProfile?: (profile: any) => void
  ) => {
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
    if (!mainCharacter || subCharacterList.length === 0) return;

    const myData = {
      nickname: mainCharacter.CharacterName,
      main_class: mainCharacter.CharacterClassName,
      server: mainCharacter.ServerName,
      character_image_main: mainCharacter.CharacterImage,
      sub_characters: subCharacterList.map((c) => ({
        class: c.CharacterClassName,
        name: c.CharacterName,
        image: c.CharacterImage,
      })),
    };

    // ✅ 먼저 내 정보 상태 세팅 (insert 전에 반드시 실행)
    setMyUserInfo({
      nickname: myData.nickname,
      main_class: myData.main_class,
      server: myData.server,
      character_image_main: myData.character_image_main,
      sub_characters: myData.sub_characters,
    });

    myUserInfoRef.current = myData; // ✅ useRef도 즉시 업데이트

    // ✅ 엇갈린 조건으로 대기열 조회
    const subClassConditions = myData.sub_characters
      .map((c: any) => `main_class.eq.${c.class}`)
      .join(",");

    const myMainAsJson = JSON.stringify([{ class: myData.main_class }]);

    const { data: queueData, error: queueError } = await supabase
      .from("jewel_matching_queue")
      .select("*")
      .eq("server", myData.server)
      .or(
        [
          subClassConditions, // 상대의 main_class가 내 부캐 중 하나
          `sub_characters.cs.${myMainAsJson}`, // 상대의 부캐 목록에 내 main_class 포함
        ].join(",")
      )
      .limit(1);

    if (queueError) {
      console.error("❌ 매칭 쿼리 실패:", queueError);
      return;
    }

    if (queueData && queueData.length > 0) {
      // ✅ 매칭 성공
      const matchedData = queueData[0];

      const matchedClass = matchedData.main_class;

      const matchedSubChar = myData.sub_characters.find(
        (c) => c.class === matchedClass
      );

      await supabase
        .from("jewel_matching_queue")
        .delete()
        .eq("id", matchedData.id);

      const myMatchedSubChar = myData.sub_characters.find(
        (c) => c.class === matchedData.main_class
      );

      console.log("🔍 내 매칭된 부캐 class:", myMatchedSubChar?.class);

      const myMatchedCharData = subCharacterList.find(
        (c) => c.CharacterClassName === myMatchedSubChar?.class
      );

      console.log("🔍 내 부캐 중 실제 일치 캐릭터:", myMatchedCharData);

      if (myMatchedCharData) {
        setSubCharacterList([myMatchedCharData]);
        setSubSearchList([myMatchedCharData.CharacterName]);
      }

      const theirMatchedSubChar = matchedData.sub_characters.find(
        (c: any) => c.class === myData.main_class
      );

      await supabase.from("jewel_matched_pairs").insert({
        user_a: {
          ...myData,
          sub_class: myMatchedSubChar?.class,
          subnickname: myMatchedSubChar?.name,
          character_image_sub: myMatchedSubChar?.image,
        },
        user_b: {
          ...matchedData,
          sub_class: theirMatchedSubChar?.class,
          subnickname: theirMatchedSubChar?.name,
          character_image_sub: theirMatchedSubChar?.image,
        },
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
      const { error: insertError } = await supabase
        .from("jewel_matching_queue")
        .insert(myData);

      if (insertError) {
        console.error("❌ 대기열 등록 실패:", insertError);
      } else {
        setMatchingStatus("queued");
      }
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
    if (!nickname) {
      console.warn("❌ 닉네임이 유효하지 않습니다:", nickname);
      return [];
    }

    try {
      const res = await axios.get(`${BASE_URL}/characters/gems`, {
        params: { name: nickname }, // 서버에 전달될 name 쿼리
      });

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

    const { data, error } = await supabase.rpc("update_match_status", {
      match_id: matchedPair.matchId,
      key,
      value: "accepted",
    });

    const result = await supabase
      .from("jewel_matched_pairs")
      .select("*")
      .eq("id", matchedPair.matchId);

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
    const newPair = payload.new;
    if (!newPair?.user_a || !newPair?.user_b || !newPair?.status) return;

    if (deletedMatchIdRef.current === newPair.id) return;

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

    const me = myUserInfoRef.current;
    if (!me) return;

    // ✅ subnickname 없이, nickname + server + main_class만으로 매칭 판별
    const isUserA =
      a.nickname === me.nickname &&
      a.server === me.server &&
      a.main_class === me.main_class;
    const isUserB =
      b.nickname === me.nickname &&
      b.server === me.server &&
      b.main_class === me.main_class;

    if (!isUserA && !isUserB) return;

    const selfRole = isUserA ? "userA" : "userB";
    const opponent = isUserA ? b : a;

    const status = {
      myStatus: selfRole === "userA" ? rawStatus.userA : rawStatus.userB,
      otherStatus: selfRole === "userA" ? rawStatus.userB : rawStatus.userA,
    };

    if (status.otherStatus === "rejected") {
      alert("상대방이 거절하였습니다.");
      setMatchedPair(null);
      setMatchingStatus("idle");
      return;
    }

    if (rawStatus.userA === "accepted" && rawStatus.userB === "accepted") {
      const subChar = opponent.sub_characters?.find(
        (c: any) => c.class === opponent.sub_class
      ) ?? {
        name: opponent.subnickname,
        class: opponent.sub_class,
        image: opponent.character_image_sub,
      };

      setMatchedMainCharacter({
        CharacterName: opponent.nickname,
        CharacterClassName: opponent.main_class,
        ServerName: opponent.server,
        CharacterImage:
          opponent.character_image_main ?? "/img/default-character.png",
      });

      setMatchedSubCharacter({
        CharacterName: subChar?.name ?? "",
        CharacterClassName: subChar?.class ?? opponent.sub_class,
        ServerName: opponent.server,
        CharacterImage: subChar?.image ?? "/img/default-character.png",
      });

      setMatchedPair(null);
      setMatchingStatus("completed");
      return;
    }

    setMatchedPair({
      selfRole,
      opponent,
      status,
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
      a.server === me.server &&
      a.main_class === me.main_class;
    const isUserB =
      b.nickname === me.nickname &&
      b.server === me.server &&
      b.main_class === me.main_class;

    if (!isUserA && !isUserB) return;

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
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 백그라운드 async 요청은 보장되지 않지만 트리거는 할 수 있음
      cleanupBeforeUnload();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  //로컬에 닉네임 저장
  useEffect(() => {
    const savedMain = localStorage.getItem("mainSearch");
    if (savedMain) setMainSearch(savedMain);

    const savedSubs: string[] = [];
    for (let i = 0; i < 5; i++) {
      const saved = localStorage.getItem(`subSearch${i}`);
      if (saved) savedSubs.push(saved);
    }
    if (savedSubs.length) setSubSearchList(savedSubs);
  }, []);

  const fetchMatchingQueue = async () => {
    const { data, error } = await supabase
      .from("jewel_matching_queue")
      .select("*");

    if (error) {
      console.error("대기열 조회 실패:", error.message);
      return;
    }

    // 서버별로 그룹화
    const grouped = data.reduce((acc: Record<string, any[]>, curr) => {
      const server = curr.server || "기타";
      if (!acc[server]) acc[server] = [];
      acc[server].push(curr);
      return acc;
    }, {});

    setQueueList(grouped);
  };

  const shouldShowModal =
    matchedPair &&
    matchedPair.status.myStatus !== "rejected" &&
    (matchedPair.status.myStatus === "pending" ||
      (matchedPair.status.myStatus === "accepted" &&
        matchedPair.status.otherStatus === "pending"));

  const isWaitingForOther =
    matchedPair?.status.myStatus === "accepted" &&
    matchedPair?.status.otherStatus === "pending";

  useEffect(() => {
    const fetchQueue = async () => {
      const { data, error } = await supabase
        .from("jewel_matching_queue")
        .select("*");

      if (!error && data) {
        setQueueData(data as MatchingUser[]);
      }
    };

    fetchQueue();
  }, []);

  return (
    <Container>
      <Helmet>
        <title>보석 깐부 찾기 - ArkLator</title>
        <meta name="description" content="로스트아크 보석 품앗이 상대 찾기" />
      </Helmet>

      <Wrapper>
        {matchingStatus === "completed" &&
        matchedMainCharacter &&
        matchedSubCharacter ? (
          <MatchLayout>
            {/* 캐릭터 정보 + 매칭 버튼 */}
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
                    <div className="nickname">
                      {mainCharacter.CharacterName}
                    </div>
                    <div className="server">
                      서버: {mainCharacter.ServerName}
                    </div>
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
            {subCharacterList.length > 0 ? (
              subCharacterList.map((subChar) => (
                <CharacterColumn
                  key={subChar.CharacterName}
                  onClick={() =>
                    setSelectedCharacterName(subChar.CharacterName)
                  }
                  style={{
                    cursor: "pointer",
                    opacity: 1,
                  }}
                >
                  <CharacterImage
                    src={
                      subChar.CharacterImage !== "null"
                        ? subChar.CharacterImage
                        : "/img/default-character.png"
                    }
                  />
                  <InfoBox>
                    <div className="nickname">{subChar.CharacterName}</div>
                    <div className="server">서버: {subChar.ServerName}</div>
                    <div className="job">
                      직업: {subChar.CharacterClassName}
                    </div>
                  </InfoBox>
                </CharacterColumn>
              ))
            ) : (
              <CharacterColumn style={{ opacity: 0.5 }}>
                <CharacterImagePlaceholder />
                <InfoBox>
                  <div className="nickname">-</div>
                  <div className="server">서버: -</div>
                  <div className="job">직업: -</div>
                </InfoBox>
              </CharacterColumn>
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
        ) : (
          // ✅ 매칭 전 화면
          <>
            <CharacterInputRow>
              {/* 본캐 */}
              <SearchWrapper>
                <SearchBar
                  ismainpage
                  search={mainSearch}
                  setSearch={setMainSearch}
                  handleSearch={() => {
                    if (!mainSearch.trim()) return;
                    fetchCharacter(
                      mainSearch,
                      setMainCharacter,
                      setMainJewels,
                      setProfile
                    );
                  }}
                  width="192px"
                  placeholder="본캐 닉네임 입력"
                />
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
                        <div className="nickname">
                          {mainCharacter.CharacterName}
                        </div>
                        <div className="server">
                          서버: {mainCharacter.ServerName}
                        </div>
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
              </SearchWrapper>

              {/* 부캐들 */}
              {subSearchList.map((search, index) => (
                <SearchWrapper key={index}>
                  <SearchBar
                    ismainpage
                    search={search}
                    setSearch={(value) => {
                      const updated = [...subSearchList];
                      updated[index] = value;
                      setSubSearchList(updated);
                    }}
                    handleSearch={() => {
                      if (!search.trim()) return;
                      fetchCharacter(
                        search,
                        (char) => {
                          setSubCharacterList((prev) => {
                            const updated = [...prev];
                            updated[index] = char;
                            return updated;
                          });
                        },
                        setSubJewels,
                        setProfile
                      );
                    }}
                    width="192px"
                    placeholder={`부캐 닉네임 ${index + 1} 입력`}
                  />

                  <CharacterColumn
                    onClick={() => {
                      if (subCharacterList[index]) {
                        setSelectedCharacterName(
                          subCharacterList[index].CharacterName
                        );
                      }
                    }}
                    style={{
                      cursor: subCharacterList[index] ? "pointer" : "default",
                      opacity: subCharacterList[index] ? 1 : 0.5,
                    }}
                  >
                    {/* 삭제 버튼 */}
                    {subSearchList.length > 1 && (
                      <RemoveButton
                        onClick={() => {
                          const updatedSearch = [...subSearchList];
                          const updatedChars = [...subCharacterList];
                          updatedSearch.splice(index, 1);
                          updatedChars.splice(index, 1);
                          setSubSearchList(updatedSearch);
                          setSubCharacterList(updatedChars);
                        }}
                      >
                        <FaTrashAlt size={14} />
                      </RemoveButton>
                    )}
                    {subCharacterList[index] ? (
                      <>
                        <CharacterImage
                          src={
                            subCharacterList[index].CharacterImage !== "null"
                              ? subCharacterList[index].CharacterImage
                              : "/img/default-character.png"
                          }
                        />
                        <InfoBox>
                          <div className="nickname">
                            {subCharacterList[index].CharacterName}
                          </div>
                          <div className="server">
                            서버: {subCharacterList[index].ServerName}
                          </div>
                          <div className="job">
                            직업: {subCharacterList[index].CharacterClassName}
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
                </SearchWrapper>
              ))}

              {/* 부캐 추가 카드 */}
              {subSearchList.length < 5 && (
                <AddColumn
                  onClick={() => setSubSearchList((prev) => [...prev, ""])}
                >
                  <PlusIcon />
                </AddColumn>
              )}
            </CharacterInputRow>
          </>
        )}

        <ButtonGroup>
          {/*매칭 완료 상태 버튼 */}
          {matchingStatus === "completed" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "white",
                  marginRight: "16px",
                }}
              >
                매칭 완료
              </div>

              <StyledMatchButton onClick={handleCancelMatch}>
                매칭 취소
              </StyledMatchButton>
            </>
          ) : matchingStatus === "queued" ? (
            <StyledMatchButton onClick={handleCancelMatch}>
              <img
                src="/img/Loading_icon.gif"
                alt="로딩 중"
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  verticalAlign: "middle",
                }}
              />
              매칭 취소
            </StyledMatchButton>
          ) : (
            <StyledMatchButton onClick={handleMatch}>
              매칭 찾기
            </StyledMatchButton>
          )}

          <StyledMatchButton
            onClick={async () => {
              await fetchMatchingQueue();
              setIsQueueModalOpen(true);
            }}
          >
            현재 매칭 대기열 보기
          </StyledMatchButton>
        </ButtonGroup>
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

      {isQueueModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsQueueModalOpen(false)} // 모달 닫기용 핸들러
        >
          <div
            style={{
              backgroundColor: "#222",
              padding: "20px",
              borderRadius: "10px",
              maxHeight: "80vh",
              overflowY: "auto",
              width: "700px",
            }}
            onClick={(e) => e.stopPropagation()} // 내부 클릭시 모달 닫히지 않도록
          >
            <h2 style={{ color: "white", marginBottom: "20px" }}>
              현재 매칭 대기열 (서버별)
            </h2>

            {Object.keys(queueList).length === 0 ? (
              <p style={{ color: "#ccc" }}>대기 중인 유저가 없습니다.</p>
            ) : (
              Object.entries(queueList).map(([server, users]) => (
                <div key={server} style={{ marginBottom: "32px" }}>
                  <h3 style={{ marginBottom: "12px", color: "#ffcc00" }}>
                    {server}
                  </h3>
                  <ScrollableBox>
                    <table
                      style={{
                        width: "100%",
                        tableLayout: "fixed",
                        borderCollapse: "collapse",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      <thead>
                        <tr>
                          <th
                            style={{
                              width: "30%",
                              padding: "8px",
                              textAlign: "left",
                              borderBottom: "1px solid #555",
                            }}
                          >
                            닉네임
                          </th>
                          <th
                            style={{
                              width: "25%",
                              padding: "8px",
                              textAlign: "center",
                              borderBottom: "1px solid #555",
                            }}
                          >
                            본캐
                          </th>
                          <th
                            style={{
                              width: "45%",
                              padding: "8px",
                              textAlign: "center",
                              borderBottom: "1px solid #555",
                            }}
                          >
                            부캐들
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, i) => (
                          <tr key={i}>
                            <td
                              style={{
                                padding: "8px",
                                wordBreak: "break-word",
                              }}
                            >
                              {user.nickname}
                            </td>
                            <td style={{ padding: "8px", textAlign: "center" }}>
                              {user.main_class}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                textAlign: "center",
                                wordBreak: "break-word",
                              }}
                            >
                              {Array.isArray(user.sub_characters)
                                ? user.sub_characters
                                    .map((c: any) => c.class)
                                    .join(", ")
                                : ""}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </ScrollableBox>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

export default JewelFriend;
