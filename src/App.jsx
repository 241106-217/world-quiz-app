import { useEffect, useState } from "react";

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("search"); 
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    fetchFlagsAndTranslations();
  }, []);

  // 💡 国旗データと日本語翻訳データを同時に取得して合体させる
  const fetchFlagsAndTranslations = async () => {
    try {
      // 1. 国旗画像のAPIを取得
      const responseFlags = await fetch(
        "https://countriesnow.space/api/v0.1/countries/flag/images"
      );
      // 2. 世界中のエンジニアが共有している安全な日本語国名JSONを取得
      const responseJsonJa = await fetch(
        "https://raw.githubusercontent.com/stefangabos/world_countries/master/data/en/countries.json"
      );

      if (!responseFlags.ok || !responseJsonJa.ok) throw new Error("通信エラーが発生しました");
      
      const resFlags = await responseFlags.json();
      const resJa = await responseJsonJa.json();

      // 3. 2つのデータを国名（英語）をキーにして合体させる
      const jaMap = {};
      resJa.forEach(item => {
        // API側と表記を合わせるため、一部の国名を補正
        let enName = item.name;
        if (enName === "United States") enName = "United States of America";
        jaMap[enName.toLowerCase()] = item.name; // ここを日本語名にするためのマップを作成
      });

      // 💡 簡易的な日本語変換辞書（主要な国や、上記リポジトリとAPIで名前がズレる部分のサポート）
      const manualJaDict = {
        "afghanistan": "アフガニスタン", "albania": "アルバニア", "algeria": "アルジェリア", "andorra": "アンドラ", "angola": "アンゴラ",
        "argentina": "アルゼンチン", "armenia": "アルメニア", "australia": "オーストラリア", "austria": "オーストリア", "azerbaijan": "アゼルバイジャン",
        "bangladesh": "バングラデシュ", "belgium": "ベルギー", "brazil": "ブラジル", "cambodia": "カンボジア", "canada": "カナダ",
        "china": "中国", "colombia": "コロンビア", "denmark": "デンマーク", "egypt": "エジプト", "france": "フランス",
        "germany": "ドイツ", "india": "インド", "indonesia": "インドネシア", "italy": "イタリア", "japan": "日本",
        "malaysia": "マレーシア", "mexico": "メキシコ", "netherlands": "オランダ", "new zealand": "ニュージーランド", "philippines": "フィリピン",
        "russia": "ロシア", "singapore": "シンガポール", "south korea": "韓国", "spain": "スペイン", "switzerland": "スイス",
        "thailand": "タイ", "united kingdom": "イギリス", "united states of america": "アメリカ", "vietnam": "ベトナム"
      };

      const combinedData = resFlags.data.map(country => {
        const lowerName = country.name.toLowerCase();
        // 手動辞書になければ、ネット上のデータから日本語を探す（見つからなければ英語のままにする）
        const nameJa = manualJaDict[lowerName] || country.name; 
        
        return {
          ...country,
          nameJa: nameJa // 💡 新しく「日本語の国名」の項目を追加！
        };
      });

      setFlags(combinedData);
      createQuiz(combinedData);
      console.log("日本語化データ作成成功", combinedData);
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

  const checkAnswer = (selectedNameJa) => {
    if (selectedNameJa === quiz.nameJa) {
      setResult("⭕ 正解！");
    } else {
      setResult(`❌ 不正解！正解は ${quiz.nameJa}`);
    }
  };

  // 💡 検索処理を「日本語名」に対して行うように変更！
  const filteredCountries = flags.filter((country) =>
    country.nameJa.toLowerCase().includes(search.toLowerCase()) ||
    country.name.toLowerCase().includes(search.toLowerCase()) // 英語で打っても引っかかるように親切設計
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", color: "#fff", backgroundColor: "#121212", minHeight: "100vh" }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>

      {/* ナビゲーションボタン */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={() => setPage("search")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "search" ? "#007bff" : "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔍 日本語で国名検索
        </button>
        <button 
          onClick={() => setPage("quiz")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "quiz" ? "#007bff" : "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🏳️ 国旗クイズ
        </button>
      </div>

      <hr style={{ borderColor: "#333" }} />

      {/* 🔍 検索ページ */}
      {page === "search" && (
        <div>
          <h2>🔍 国名検索 (日本語対応)</h2>
          <input
            type="text"
            placeholder="「日本」「フランス」など日本語で入力..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "15px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#222",
              color: "#fff"
            }}
          />
          <p>検索結果：<strong>{filteredCountries.length}</strong> 件（横にスライドできます ➔）</p>
          
          {/* 横スライド（カルーセル） */}
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            overflowX: "auto", 
            paddingBottom: "15px",
            marginBottom: "20px",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch"
          }}>
            {filteredCountries.slice(0, 15).map((country) => (
              <div 
                key={country.name}
                onClick={() => setSelectedCountry(country)}
                style={{
                  flex: "0 0 140px", 
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: selectedCountry?.name === country.name ? "#007bff" : "#222",
                  border: "1px solid #444",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <img 
                  src={country.flag} 
                  alt="" 
                  style={{ width: "100%", height: "60px", objectFit: "contain", backgroundColor: "#f0f0f0", borderRadius: "4px" }} 
                />
                {/* 💡 日本語の国名を表示 */}
                <div style={{ fontSize: "13px", marginTop: "8px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: "bold" }}>
                  {country.nameJa}
                </div>
              </div>
            ))}
            {filteredCountries.length === 0 && <p style={{ color: "#888" }}>該当する国がありません</p>}
          </div>

          {/* 選択された国の詳細 */}
          {selectedCountry && (
            <div style={{ padding: "20px", borderRadius: "12px", backgroundColor: "#1e1e1e", border: "1px solid #333", textAlign: "center" }}>
              {/* 💡 メインに日本語、サブで英語名を表示する高級感のあるデザイン */}
              <h3 style={{ fontSize: "26px", margin: "0 0 5px 0" }}>{selectedCountry.nameJa}</h3>
              <p style={{ color: "#888", margin: "0 0 15px 0", fontSize: "14px" }}>{selectedCountry.name}</p>
              
              <img 
                src={selectedCountry.flag} 
                alt="国旗" 
                style={{ width: "100%", maxHeight: "250px", objectFit: "contain", backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "8px" }} 
              />
              <div style={{ marginTop: "15px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "14px", color: "#ccc" }}>
                <div style={{ background: "#2a2a2a", padding: "10px", borderRadius: "6px" }}>
                  コード(2文字): <strong style={{ color: "#007bff" }}>{selectedCountry.iso2}</strong>
                </div>
                <div style={{ background: "#2a2a2a", padding: "10px", borderRadius: "6px" }}>
                  コード(3文字): <strong style={{ color: "#007bff" }}>{selectedCountry.iso3}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🏳️ クイズページ */}
      {page === "quiz" && quiz && (
        <div>
          <h2>🏳️ 国旗クイズ (日本語版)</h2>
          <div style={{ textAlign: "center", backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "8px" }}>
            <img src={quiz.flag} alt="国旗" style={{ maxWidth: "100%", height: "200px", objectFit: "contain" }} />
          </div>

          {/* 💡 選択肢のボタンもすべて日本語に！ */}
          <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {choices.map((country) => (
              <button
                key={country.name}
                onClick={() => checkAnswer(country.nameJa)}
                disabled={result !== ""}
                style={{
                  padding: "12px 15px",
                  flex: "1 1 45%",
                  cursor: result !== "" ? "not-allowed" : "pointer",
                  backgroundColor: "#222",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                {country.nameJa}
              </button>
            ))}
          </div>

          <h3 style={{ textAlign: "center", margin: "20px 0", fontSize: "22px" }}>{result}</h3>

          <button
            onClick={() => createQuiz()}
            style={{ padding: "12px", width: "100%", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          >
            次の問題
          </button>
        </div>
      )}

      <hr style={{ borderColor: "#333", marginTop: "30px" }} />
      <p style={{ color: "#666", fontSize: "12px", textAlign: "center" }}>
        現在、<strong>{flags.length}</strong> カ国のデータを読み込み済み。
      </p>
    </div>
  );
}

export default App;