import { db } from "./FireBase"; // 또는 경로에 맞게 수정
import { collection, addDoc, Timestamp } from "firebase/firestore";

type GeneratedOption = {
  parts: (string | { value: string; grade: string })[];
  locked: boolean;
};

export async function logBraceletResult(generated: GeneratedOption[]) {
  const dataToSave = {
    timestamp: Timestamp.now(),
    options: generated.map((opt) => {
      const values = opt.parts
        .filter(
          (p): p is { value: string; grade: string } => typeof p !== "string"
        )
        .map((v) => v.value);

      const grade = opt.parts.find(
        (p): p is { value: string; grade: string } => typeof p !== "string"
      )?.grade;

      return {
        template: opt.parts
          .map((p) => (typeof p === "string" ? p : "VALUE"))
          .join(""),
        value: values,
        grade: grade || "하옵",
      };
    }),
  };

  await addDoc(collection(db, "bracelet_logs"), dataToSave);
}
