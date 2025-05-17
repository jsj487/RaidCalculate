import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

// 공통 스타일
const BaseInputStyle = `
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background-color: white;
  color: black;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const Label = styled.label`
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
`;

const Input = styled.input`
  ${BaseInputStyle}
`;

const Select = styled.select`
  ${BaseInputStyle}
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
`;

const ResultBox = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #333;
  border-radius: 8px;
`;

const ResultLine = styled.p`
  font-size: 18px;
  margin: 10px 0;
`;

const Auction = () => {
  const [price, setPrice] = useState<string>("");
  const [memberCount, setMemberCount] = useState<number>(8);

  const parsedPrice = Number(price || 0); // 계산 시 안전하게 처리

  const getUseBid = () =>
    Math.floor((parsedPrice * (memberCount - 1)) / memberCount);

  const getSaleBid = (value: number, memberCount: number): number => {
    if (value <= 0 || memberCount <= 1) return 0;

    const netGold = value * 0.95;
    const breakEven = netGold * ((memberCount - 1) / memberCount);
    const recommendedBid = breakEven / 1.1;

    return Math.floor(recommendedBid);
  };

  const getPerPersonShare = (bid: number, memberCount: number): number => {
    if (memberCount <= 1) return 0;
    return Math.floor(bid / (memberCount - 1)); // ✅ 입찰자를 제외한 인원
  };

  const useBid = getUseBid(); // 사용 시 입찰가
  const saleBid = getSaleBid(parsedPrice, memberCount); // 판매 시 입찰가

  const perShareUse = getPerPersonShare(useBid, memberCount); // 사용 시 기준 분배금
  const perShareSale = getPerPersonShare(saleBid, memberCount); // 판매 시 기준 분배금

  return (
    <Container>
      <Title>경매 입찰 계산기</Title>

      <InputGroup>
        <Label>경매 아이템 가격 (골드)</Label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </InputGroup>

      <InputGroup>
        <Label>레이드 인원 수</Label>
        <Select
          value={memberCount}
          onChange={(e) => setMemberCount(Number(e.target.value))}
        >
          <option value={4}>4인</option>
          <option value={8}>8인</option>
          <option value={16}>16인</option>
        </Select>
      </InputGroup>

      <ResultBox>
        <ResultLine>
          사용 시 입찰가: {getUseBid().toLocaleString()} G
          <span style={{ color: "#888", fontSize: "14px" }}>
            (1인당 분배금: {perShareUse.toLocaleString()} G)
          </span>
        </ResultLine>
        <ResultLine>
          판매 시 입찰가:{" "}
          {getSaleBid(Number(price), memberCount).toLocaleString()} G
          <span style={{ color: "#888", fontSize: "14px" }}>
            (1인당 분배금: {perShareSale.toLocaleString()} G)
          </span>
        </ResultLine>
      </ResultBox>
    </Container>
  );
};

export default Auction;
