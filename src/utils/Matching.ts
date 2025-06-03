export type SubCharacter = {
  class: string;
  name: string;
  image: string;
};

export type MatchingUser = {
  nickname: string;
  main_class: string;
  server: string;
  character_image_main: string;
  sub_characters: SubCharacter[];
};

export type MatchedPairState = {
  selfRole: "userA" | "userB";
  opponent: MatchingUser;
  status: {
    myStatus: "pending" | "accepted" | "rejected";
    otherStatus: "pending" | "accepted" | "rejected";
  };
  matchId: number;
};
