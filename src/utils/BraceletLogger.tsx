import { supabase } from "./SupabaseClient";
import { AllOptions } from "./BaraceletOptions";

type GeneratedOption = {
  parts: (string | { value: string; grade: string })[]; // 문자열 또는 { value, grade } 형태
  locked: boolean;
};

export const logBraceletResult = async (options: GeneratedOption[]) => {
  const draw_result = options.map((opt) => {
    // "치명 VALUE" 또는 "VALUE 체력" 등 parts → 실제 template 형태로 재조립
    const template = opt.parts
      .map((p) => (typeof p === "string" ? p : "VALUE"))
      .join("")
      .trim();

    // 수치 값 (예: "85~90")
    const values = opt.parts
      .filter((p) => typeof p !== "string")
      .map((p) => (p as { value: string }).value);

    // 등급 정보 (특수 효과만 존재함)
    const grade = (
      opt.parts.find((p) => typeof p !== "string") as { grade?: string }
    )?.grade;

    // 템플릿에서 VALUE 제거하여 비교용 텍스트 생성
    const cleanTemplate = template
      .replace("VALUE", "")
      .replace(/\s+/g, "")
      .trim();

    // AllOptions에서 템플릿 매칭
    const matched = AllOptions.find(
      (o) =>
        o.template.replace("VALUE", "").replace(/\s+/g, "").trim() ===
        cleanTemplate
    );

    return {
      category: matched?.category ?? "기타",
      template,
      value: values.join(" "), // 예: "85~90"
      grade,
    };
  });

  const expandedLogs = draw_result.map((r) => ({
    category: r.category,
    template: r.template,
    value: r.value,
    grade: r.grade,
  }));

  // 통합 로그 저장
  await supabase.from("bracelet_logs_compressed").insert({ draw_result });

  // 상세 로그 저장
  await supabase.from("bracelet_logs").insert(expandedLogs);
};
