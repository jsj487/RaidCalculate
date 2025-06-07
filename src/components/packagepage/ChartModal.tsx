import React from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const Modal = styled.div`
  background: #1e1e1e;
  color: white;
  padding: 24px;
  width: 1000px;
  max-width: 90vw;
  position: absolute;
  top: 20%; // 필요시 조절
  left: 50%;
  transform: translate(-50%, 0); // 위로 안 움직이도록 y는 0
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.7);
`;

const Header = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
`;

const Icon = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Bundle = styled.div`
  font-size: 14px;
  color: #aaa;
`;

const CloseButton = styled.button`
  background: #444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  float: right;
`;

const StatChart = ({ stats }: { stats: Stat[] }) => {
  const data = stats.map((s) => ({
    date: s.Date.slice(5), // MM-DD
    avg: s.AvgPrice,
    count: s.TradeCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#444" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" stroke="#3a8" />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#fa0"
          tickFormatter={(value) => value.toLocaleString()}
          width={100}
        />
        <Tooltip />
        <Legend />

        <Bar
          yAxisId="right"
          dataKey="count"
          name="판매 건수"
          fill="#fa0"
          barSize={20}
        />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="avg"
          name="평균 거래가"
          stroke="#3cf"
          strokeWidth={2}
          dot={{ r: 4, fill: "#3cf", stroke: "#1ad", strokeWidth: 1.5 }}
          activeDot={{ r: 5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const ChartModal: React.FC<ChartModalProps> = ({
  open,
  onClose,
  itemName,
  icon,
  bundle,
  stats,
}) => {
  if (!open) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Icon src={icon} alt={itemName} />
          <StatInfo>
            <Title>{itemName}</Title>
            {bundle > 1 && <Bundle>[{bundle}개 단위 판매]</Bundle>}
          </StatInfo>
        </Header>

        <StatChart stats={stats} />

        <CloseButton onClick={onClose}>닫기</CloseButton>
      </Modal>
    </Overlay>
  );
};

export default ChartModal;
