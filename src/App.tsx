import { useState } from "react";
import axios from "axios";

export default function SimpleCharacterSearch() {
  const [search, setSearch] = useState("");
  const [characterInfo, setCharacterInfo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Express 서버로 요청 보내기
      const response = await axios.get(`http://localhost:5000/api/characters`, {
        params: { name: search },
      });

      const data = response.data;
      console.log("API 응답 데이터:", data);

      setCharacterInfo(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-wrap justify-center items-start gap-4 p-4 bg-cover bg-center">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-lg mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center">캐릭터 검색</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="캐릭터 이름 입력"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="sr-only">검색</span>
          </button>
        </form>

        {loading && <p className="mt-4 text-center">검색 중...</p>}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </div>

      {characterInfo && characterInfo.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          {characterInfo.map((char: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 w-60">
              {char.CharacterImage && (
                <img
                  src={char.CharacterImage}
                  alt={char.CharacterName}
                  className="w-full h-40 object-cover rounded-t-md mb-2"
                />
              )}
              <div className="p-2">
                <h3 className="text-lg font-semibold text-center mb-2">
                  {char.CharacterName}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>레벨:</strong> {char.CharacterLevel}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>클래스:</strong> {char.CharacterClassName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>아이템 레벨:</strong> {char.ItemMaxLevel}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
