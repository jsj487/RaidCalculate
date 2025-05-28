// BraceletLogTable.tsx

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/SupabaseClient";

type CompressedLog = {
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

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("bracelet_logs_compressed")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setLogs(data);
      }
    };

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
        (payload) => {
          const newLog = payload.new as CompressedLog;
          setLogs((prev) => [newLog, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("bracelet_logs_compressed")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("🔥 Supabase error:", error.message);
      }

      console.log("✅ Supabase logs data:", data);
      setLogs(data || []);
    };

    fetchLogs();
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
