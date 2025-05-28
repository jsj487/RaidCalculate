import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const channel = supabase
  .channel("realtime:bracelet_logs")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "bracelet_logs",
    },
    (payload) => {
      console.log("새로운 팔찌 로그가 추가됨:", payload.new);
    }
  )
  .subscribe();
