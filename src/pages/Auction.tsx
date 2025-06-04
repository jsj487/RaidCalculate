import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); // 헤더/푸터 여백 고려 시
  padding: 40px 20px;
  background-color: #1e1e1e;
`;

const Container = styled.div`
  max-width: 600px;
  color: #ddd;
  width: 100%;
  background-color: #1a1a1a;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 32px;
  font-size: 24px;
  font-weight: bold;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ccc;
`;

const BaseInput = `
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #2a2a2a;
  color: #ddd;
  box-sizing: border-box;

  &:focus {
    border-color: #666;
    outline: none;
  }
`;

const Input = styled.input`
  ${BaseInput}
`;

const Select = styled.select`
  ${BaseInput}
`;

const ResultBox = styled.div`
  margin-top: 40px;
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
`;

const ResultLine = styled.p`
  font-size: 17px;
  margin-bottom: 16px;

  span {
    color: #888;
    font-size: 14px;
    margin-left: 12px;
  }
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
    <PageWrapper>
      <Container>
        <Helmet>
          <title>경매 계산기 - ArkLator</title>
          <meta name="description" content="로스트아크 골드 수익 계산기" />
        </Helmet>

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
    </PageWrapper>
  );
};

export default Auction;
