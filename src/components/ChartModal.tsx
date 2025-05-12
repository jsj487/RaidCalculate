import React from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from "recharts";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1e1e1e;
  color: white;
  width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #444;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const StatSummary = styled.div`
  display: flex;
  justify-content: space-around;
  background: #2a2a2a;
  padding: 12px 0;
`;

const StatItem = styled.div`
  text-align: center;
  font-size: 14px;
`;

const ChartWrapper = styled.div`
  display: flex;
  padding: 20px;
  gap: 16px;
`;

const Table = styled.table`
  border-collapse: collapse;
  color: white;
  width: 450px;
  font-size: 12px;
`;

const Th = styled.th`
  border-bottom: 1px solid #444;
  padding: 8px;
  text-align: left;
`;

const Td = styled.td`
  border-bottom: 1px solid #333;
  padding: 6px 8px;
`;

interface Stat {
  Date: string;
  AvgPrice: number;
  TradeCount: number;
}

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  icon: string;
  bundle: number;
  stats: Stat[];
}

const ChartModal: React.FC<ChartModalProps> = ({
  open,
  onClose,
  itemName,
  icon,
  bundle,
  stats,
}) => {
  if (!open) return null;

  const today = stats[0]?.AvgPrice ?? 0;
  const max = Math.max(...stats.map((s) => s.AvgPrice));
  const min = Math.min(...stats.map((s) => s.AvgPrice));

  return (
    <>
      <Overlay onClick={onClose} />
      <Modal>
        <Header>
          <Title>📈 {itemName} 시세 확인</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <div style={{ display: "flex", alignItems: "center", padding: "16px" }}>
          <img
            src={icon}
            alt={itemName}
            style={{ width: 48, height: 48, marginRight: 16 }}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{itemName}</div>
            {bundle > 1 && (
              <div style={{ fontSize: 12, color: "#aaa" }}>
                [{bundle}개 단위 판매]
              </div>
            )}
          </div>
        </div>

        <StatSummary>
          <StatItem>
            <div>오늘 평균가</div>
            <div>{today} G</div>
          </StatItem>
          <StatItem>
            <div>7일 최고가</div>
            <div>{max} G</div>
          </StatItem>
          <StatItem>
            <div>7일 최저가</div>
            <div>{min} G</div>
          </StatItem>
        </StatSummary>

        <ChartWrapper>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats}>
              <XAxis dataKey="Date" tick={{ fill: "white", fontSize: 10 }} />
              <YAxis tick={{ fill: "white", fontSize: 10 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="AvgPrice"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

          <Table>
            <thead>
              <tr>
                <Th>날짜</Th>
                <Th>평균가</Th>
                <Th>판매 수량</Th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s, i) => (
                <tr key={i}>
                  <Td>{s.Date}</Td>
                  <Td>{s.AvgPrice}</Td>
                  <Td>{s.TradeCount.toLocaleString()}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ChartWrapper>
      </Modal>
    </>
  );
};

export default ChartModal;
