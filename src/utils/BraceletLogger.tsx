import { db } from "./FireBase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { BaseEffects, CombatStats, SpecialOptions } from "./BaraceletOptions"; // ✅ 추가

type GeneratedOption = {
  parts: (string | { value: string; grade: string })[];
  locked: boolean;
};

export const logBraceletResult = async (options: GeneratedOption[]) => {
  const categorized = {
    "기본 효과": [] as { template: string; grade: string; value: string }[],
    "전투 특성": [] as { template: string; grade: string; value: string }[],
    "특수 효과": [] as { template: string; grade: string; value: string }[],
  };

  // 템플릿 목록 만들기 (VALUE 포맷으로)
  const baseTemplates = BaseEffects.map((b) => `${b.type}VALUE`);
  const combatTemplates = CombatStats.map((c) => `${c.type}VALUE`);
  const specialTemplates = SpecialOptions.map((s) =>
    s.template.replace(/(\d+(~\d+)?%?)/g, "VALUE")
  );

  for (const opt of options) {
    const template = opt.parts
      .map((p) => (typeof p === "string" ? p : "VALUE"))
      .join("");

    const value = opt.parts
      .filter(
        (p): p is { value: string; grade: string } => typeof p !== "string"
      )
      .map((p) => p.value)
      .join(" ");

    const grade =
      opt.parts.find(
        (p): p is { value: string; grade: string } => typeof p !== "string"
      )?.grade ?? "하옵";

    let category: keyof typeof categorized = "특수 효과";
    if (baseTemplates.includes(template)) category = "기본 효과";
    else if (combatTemplates.includes(template)) category = "전투 특성";

    categorized[category].push({ template, grade, value }); // ✅ value 포함
  }

  await addDoc(collection(db, "bracelet_logs"), {
    createdAt: Timestamp.now(),
    options: categorized,
  });
};
