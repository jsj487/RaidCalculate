// types/Matching.ts
export type MatchingUser = {
  nickname: string;
  subnickname: string;
  main_class: string;
  sub_class: string;
  server: string;
  character_image_main?: string;
  character_image_sub?: string;
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
