import { supabase } from "../../utils/SupabaseClient";
import { AllOptions } from "../../utils/BaraceletOptions";

type GeneratedOption = {
  parts: (string | { value: string; grade: string })[];
  locked: boolean;
};

export const logBraceletResult = async (options: GeneratedOption[]) => {
  const normalizeTemplate = (template: string) =>
    template.replace(/\s+/g, "").replace(/VALUE/g, "#").trim();

  const templateToCategoryMap = new Map(
    AllOptions.map((o) => [normalizeTemplate(o.template), o.category])
  );

  // ✅ 잠금된 옵션은 로그에서 제외
  const unlockedOptions = options.filter((opt) => !opt.locked);

  const draw_result = unlockedOptions
    .map((opt) => {
      const values = opt.parts.filter((p) => typeof p !== "string") as {
        value: string;
        grade?: string;
      }[];

      const rawTemplate = opt.parts
        .map((p) => (typeof p === "string" ? p : "VALUE"))
        .join("")
        .trim();

      const normalizedKey = normalizeTemplate(rawTemplate);

      let category: string | undefined;

      // ✅ VALUE가 2개 이상이면 특수 효과로 간주
      if (values.length >= 2) {
        category = "특수 효과";
      } else {
        category = templateToCategoryMap.get(normalizedKey);
      }

      if (!category) {
        console.warn("⚠ 카테고리 매칭 실패:", normalizedKey);
        return null;
      }

      return {
        category,
        template: rawTemplate,
        value: values.map((v) => v.value).join(" "),
        grade: values[0]?.grade, // 첫 번째 값의 grade만 사용
      };
    })
    .filter(Boolean) as {
    category: string;
    template: string;
    value: string;
    grade?: string;
  }[];

  // ✅ 잠기지 않은 옵션만 기록
  await supabase.from("bracelet_logs_compressed").insert({ draw_result });

  const expandedLogs = draw_result.map((r) => ({
    category: r.category,
    template: r.template,
    value: r.value,
    grade: r.grade,
  }));

  await supabase.from("bracelet_logs").insert(expandedLogs);
};
