import { supabase } from "./SupabaseClient";

import { BaseEffects, CombatStats, SpecialOptions } from "./BaraceletOptions";

type GeneratedOption = {
  parts: (string | { value: string; grade: string })[];
  locked: boolean;
};

// export const logBraceletResult = async (options: GeneratedOption[]) => {
//   const categorized = {
//     "기본 효과": [] as { template: string; grade: string; value: string }[],
//     "전투 특성": [] as { template: string; grade: string; value: string }[],
//     "특수 효과": [] as { template: string; grade: string; value: string }[],
//   };

//   // 템플릿 목록 만들기 (VALUE 포맷으로)
//   const baseTemplates = BaseEffects.map((b) => `${b.type}VALUE`);
//   const combatTemplates = CombatStats.map((c) => `${c.type}VALUE`);
//   const specialTemplates = SpecialOptions.map((s) =>
//     s.template.replace(/(\d+(~\d+)?%?)/g, "VALUE")
//   );

//   for (const opt of options) {
//     const template = opt.parts
//       .map((p) => (typeof p === "string" ? p : "VALUE"))
//       .join("");

//     const value = opt.parts
//       .filter(
//         (p): p is { value: string; grade: string } => typeof p !== "string"
//       )
//       .map((p) => p.value)
//       .join(" ");

//     const grade =
//       opt.parts.find(
//         (p): p is { value: string; grade: string } => typeof p !== "string"
//       )?.grade ?? "하옵";

//     let category: keyof typeof categorized = "특수 효과";
//     if (baseTemplates.includes(template)) category = "기본 효과";
//     else if (combatTemplates.includes(template)) category = "전투 특성";

//     categorized[category].push({ template, grade, value });
//   }

//   // Supabase에 삽입
//   for (const category of Object.keys(categorized)) {
//     const entries = categorized[category as keyof typeof categorized];
//     for (const entry of entries) {
//       const compressedData = options.map((entry) => ({
//         category: entry.category,
//         template: entry.template,
//         grade: entry.grade,
//         value: entry.value,
//       }));

//       await supabase.from("bracelet_logs_compressed").insert({
//         draw_result: compressedData,
//       });
//     }
//   }
// };

export const logBraceletResult = async (options: GeneratedOption[]) => {
  const draw_result = options.map((opt) => {
    const template = opt.parts
      .map((p) => (typeof p === "string" ? p : "VALUE"))
      .join("");
    const values = opt.parts
      .filter((p) => typeof p !== "string")
      .map((p) => (p as { value: string }).value);
    const grade = (
      opt.parts.find((p) => typeof p !== "string") as { grade: string }
    )?.grade;

    return {
      category:
        template.includes("피해") || template.includes("효과")
          ? "특수 효과"
          : "기본 효과",
      template,
      value: values.join(" "),
      grade,
    };
  });

  // 👉 통계용 테이블 insert
  const expandedLogs = draw_result.map((r) => ({
    category: r.category,
    template: r.template,
    value: r.value,
    grade: r.grade,
  }));

  await supabase.from("bracelet_logs_compressed").insert({ draw_result });
  await supabase.from("bracelet_logs").insert(expandedLogs); // ← 이 줄이 추가돼야 함
};
