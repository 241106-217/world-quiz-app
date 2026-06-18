import { useEffect, useState } from "react";

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");
  
  // 💡 どちらのページを表示するか管理するステート（初期値は検索ページ）
  const [page, setPage] = useState("search"); 

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

  const checkAnswer = (selectedCountry) => {
    if (selectedCountry === quiz.name) {
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

      {/* 💡 ページを切り替えるためのナビゲーションボタン */}
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

      {/* 💡 検索ページ（page === "search" の時だけ表示） */}
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
          <ul>
            {filteredCountries.slice(0, 10).map((country) => (
              <li key={country.name}>{country.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 💡 クイズページ（page === "quiz" の時だけ表示） */}
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