import { useEffect, useState } from "react";

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("search"); 

  // 💡 検索ページで「今選択されている国」を保存するステート（最初は何も選択されていないので null）
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/flag/images"
      );
      if (!response.ok) throw new Error("通信エラーが発生しました");
      
      const data = await response.json();
      setFlags(data.data);
      createQuiz(data.data);
      console.log("データ取得成功", data.data);
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const createQuiz = (flagData = flags) => {
    if (flagData.length < 4) return;
    const correctCountry = flagData[Math.floor(Math.random() * flagData.length)];
    const wrongCountries = shuffle(
      flagData.filter((country) => country.name !== correctCountry.name)
    ).slice(0, 3);
    const allChoices = shuffle([correctCountry, ...wrongCountries]);

    setQuiz(correctCountry);
    setChoices(allChoices);
    setResult("");
  };

  const checkAnswer = (selectedName) => {
    if (selectedName === quiz.name) {
      setResult("⭕ 正解！");
    } else {
      setResult(`❌ 不正解！正解は ${quiz.name}`);
    }
  };

  const filteredCountries = flags.filter((country) =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>

      {/* ナビゲーションボタン */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={() => setPage("search")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "search" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔍 国名検索ページ
        </button>
        <button 
          onClick={() => setPage("quiz")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "quiz" ? "#007bff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🏳️ 国旗クイズページ
        </button>
      </div>

      <hr />

      {/* 🔍 検索ページ */}
      {page === "search" && (
        <div>
          <h2>🔍 国名検索</h2>
          <input
            type="text"
            placeholder="国名を入力"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "10px",
            }}
          />
          <p>検索結果：<strong>{filteredCountries.length}</strong> 件</p>
          
          {/* 💡 左右（または上下）に並べるためのレイアウト */}
          <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
            
            {/* 左側：国名の一覧リスト */}
            <ul style={{ flex: 1, margin: 0, paddingLeft: "20px", cursor: "pointer" }}>
              {filteredCountries.slice(0, 10).map((country) => (
                <li 
                  key={country.name} 
                  onClick={() => setSelectedCountry(country)} // 💡 クリックしたらその国をセット
                  style={{ 
                    padding: "5px 0", 
                    color: selectedCountry?.name === country.name ? "#007bff" : "inherit",
                    fontWeight: selectedCountry?.name === country.name ? "bold" : "normal"
                  }}
                >
                  {country.name}
                </li>
              ))}
            </ul>

            {/* 右側：選択された国の詳細情報カード */}
            <div style={{ flex: 1, padding: "15px", border: "1px solid #ccc", borderRadius: "8px", minHeight: "200px", backgroundColor: "#1e1e1e" }}>
              {selectedCountry ? (
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>{selectedCountry.name}</h3>
                  <img 
                    src={selectedCountry.flag} 
                    alt={`${selectedCountry.name}の国旗`} 
                    style={{ maxWidth: "100%", height: "100px", objectFit: "contain", backgroundColor: "#f0f0f0", padding: "5px", borderRadius: "4px" }} 
                  />
                  <p style={{ fontSize: "14px", color: "#aaa", marginTop: "10px" }}>
                    ISOコード (2文字): <strong>{selectedCountry.iso2}</strong><br />
                    ISOコード (3文字): <strong>{selectedCountry.iso3}</strong>
                  </p>
                </div>
              ) : (
                <p style={{ color: "#888", textAlign: "center", marginTop: "60px" }}>
                  左のリストから<br />国名を選択してください
                </p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 🏳️ クイズページ */}
      {page === "quiz" && quiz && (
        <div>
          <h2>🏳️ 国旗クイズ</h2>
          <div style={{ textAlign: "center", backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "8px" }}>
            <img src={quiz.flag} alt="国旗" style={{ maxWidth: "100%", height: "200px", objectFit: "contain" }} />
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {choices.map((country) => (
              <button
                key={country.name}
                onClick={() => checkAnswer(country.name)}
                disabled={result !== ""}
                style={{
                  padding: "10px 15px",
                  flex: "1 1 45%",
                  cursor: result !== "" ? "not-allowed" : "pointer",
                }}
              >
                {country.name}
              </button>
            ))}
          </div>

          <h3 style={{ textAlign: "center", margin: "20px 0" }}>{result}</h3>

          <button
            onClick={() => createQuiz()}
            style={{ padding: "10px", width: "100%" }}
          >
            次の問題
          </button>
        </div>
      )}

      <hr />
      <p style={{ color: "#666", fontSize: "14px" }}>
        現在、<strong>{flags.length}</strong> カ国のデータを読み込み済み。
      </p>
    </div>
  );
}

export default App;