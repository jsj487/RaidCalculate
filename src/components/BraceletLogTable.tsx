import React, { useEffect, useState } from "react";
import { db } from "../utils/FireBase";
import { collection, onSnapshot } from "firebase/firestore";

type BraceletLog = {
  timestamp: string;
  options: {
    template: string;
    values: string[];
    grade: string;
  }[];
};

const BraceletLogTable = () => {
  const [logs, setLogs] = useState<BraceletLog[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "braceletLogs"),
      (snapshot) => {
        const fetched: BraceletLog[] = snapshot.docs.map(
          (doc) => doc.data() as BraceletLog
        );
        setLogs(fetched);
      }
    );

    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  return (
    <div>
      <h2>팔찌 옵션 등장 로그</h2>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            {log.options.map((opt, i) => (
              <div key={i}>
                {opt.template.replace(
                  /VALUE\d*/g,
                  (_, j) => opt.values[j] || ""
                )}{" "}
                ({opt.grade})
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
