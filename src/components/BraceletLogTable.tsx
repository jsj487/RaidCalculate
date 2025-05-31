// BraceletLogTable.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupabaseClient";

export type CompressedLog = {
  created_at: string;
  draw_result: {
    category: string;
    template: string;
    value: string;
    grade: string;
  }[];
};

const BraceletLogTable = () => {
  const [logs, setLogs] = useState<CompressedLog[]>([]);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("bracelet_logs_compressed")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLogs(data);
    } else {
      console.error("❌ 로그 불러오기 실패:", error?.message);
    }
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel("bracelet-logs")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bracelet_logs_compressed",
        },
        async (payload) => {
          console.log("📥 실시간 이벤트:", payload);
          if (!payload.new) {
            await fetchLogs(); // fallback
          } else {
            setLogs((prev) => [payload.new as CompressedLog, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <div>
      <h2>팔찌 옵션 뽑기 로그</h2>

      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <p>{new Date(log.created_at).toLocaleString()}</p>
            {log.draw_result.map((opt, i) => (
              <div key={i}>
                {opt.template.replace(/VALUE\d*/g, opt.value)} ({opt.grade})
              </div>
            ))}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BraceletLogTable;
