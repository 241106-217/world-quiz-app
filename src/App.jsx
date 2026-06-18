import { useEffect, useState } from "react";

// 💡 国名日本語化辞書（データ軽量化のため主要な国を一部抜粋・必要に応じて追加可能）
const countryTranslation = {
  "afghanistan": "アフガニスタン", "albania": "アルバニア", "algeria": "アルジェリア", "andorra": "アンドラ", "angola": "アンゴラ",
  "argentina": "アルゼンチン", "armenia": "アルメニア", "australia": "オーストラリア", "austria": "オーストリア", "azerbaijan": "アゼルバイジャン",
  "bahamas": "バハマ", "bahrain": "バーレーン", "bangladesh": "バングラデシュ", "belarus": "ベラルーシ", "belgium": "ベルギー",
  "bhutan": "ブータン", "bolivia": "ボリビア", "brazil": "ブラジル", "bulgaria": "ブルガリア", "cambodia": "カンボジア",
  "cameroon": "カメルーン", "canada": "カナダ", "chile": "チリ", "china": "中国", "colombia": "コロンビア",
  "costa rica": "コスタリカ", "croatia": "クロアチア", "cuba": "キューバ", "cyprus": "キプロス", "czech republic": "チェコ",
  "denmark": "デンマーク", "ecuador": "エクアドル", "egypt": "エジプト", "estonia": "エストニア", "ethiopia": "エチオピア",
  "fiji": "フィジー", "finland": "フィンランド", "france": "フランス", "georgia": "ジョージア", "germany": "ドイツ",
  "greece": "ギリシャ", "haiti": "ハイチ", "honduras": "ホンジュラス", "hong kong": "香港", "hungary": "ハンガリー",
  "iceland": "アイスランド", "india": "インド", "indonesia": "インドネシア", "iran": "イラン", "iraq": "イラク",
  "ireland": "アイルランド", "israel": "イスラエル", "italy": "イタリア", "jamaica": "ジャマイカ", "japan": "日本",
  "jordan": "ヨルダン", "kazakhstan": "カザフスタン", "kenya": "ケニア", "kuwait": "クウェート", "laos": "ラオス",
  "latvia": "ラトビア", "lebanon": "レバノン", "luxembourg": "ルクセンブルク", "madagascar": "マダガスカル", "malaysia": "マレーシア",
  "maldives": "モルディブ", "mexico": "メキシコ", "monaco": "モナコ", "mongolia": "モンゴル", "morocco": "モロッコ",
  "myanmar": "ミャンマー", "nepal": "ネパール", "netherlands": "オランダ", "new zealand": "ニュージーランド", "norway": "ノルウェー",
  "oman": "オマーン", "pakistan": "パキスタン", "palau": "パラオ", "panama": "パナマ", "paraguay": "パラグアイ",
  "peru": "ペルー", "philippines": "フィリピン", "poland": "ポーランド", "portugal": "ポルトガル", "qatar": "カタール",
  "romania": "ルーマニア", "russia": "ロシア", "saudi arabia": "サウジアラビア", "senegal": "セネガル", "serbia": "セルビア",
  "singapore": "シンガポール", "slovakia": "スロバキア", "slovenia": "スロベニア", "south africa": "南アフリカ", "south korea": "韓国",
  "spain": "スペイン", "sri lanka": "スリランカ", "sudan": "スーダン", "sweden": "スウェーデン", "switzerland": "スイス",
  "taiwan": "台湾", "thailand": "タイ", "turkey": "トルコ", "ukraine": "ウクライナ", "united arab emirates": "アラブ首長国連邦",
  "united kingdom": "イギリス", "united states of america": "アメリカ", "united states": "アメリカ", "uruguay": "ウルグアイ",
  "uzbekistan": "ウズベキスタン", "vatican": "バチカン", "venezuela": "ベネズエラ", "vietnam": "ベトナム", "zambia": "ザンビア", "zimbabwe": "ジンバブエ"
};

const getJapaneseName = (englishName) => {
  if (!englishName) return "不明な国";
  const lower = englishName.toLowerCase().trim();
  return countryTranslation[lower] || englishName; 
};

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizMode, setQuizMode] = useState("country"); // 💡 country(国名当て), capital(首都当て), flag(国旗当て)
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [page, setPage] = useState("quiz"); // 💡 初期ページをクイズに
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  // 💡 コレクション（正解した国の英語名を保存する配列）
  const [unlockedCountries, setUnlockedCountries] = useState(() => {
    const saved = localStorage.getItem("unlocked_flags");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchAllCountryData();
  }, []);

  const fetchAllCountryData = async () => {
    try {
      setIsLoading(true);
      const [flagRes, capitalRes, populationRes] = await Promise.all([
        fetch("https://countriesnow.space/api/v0.1/countries/flag/images"),
        fetch("https://countriesnow.space/api/v0.1/countries/capital"),
        fetch("https://countriesnow.space/api/v0.1/countries/population")
      ]);

      const flagData = await flagRes.json();
      const capitalData = await capitalRes.json();
      const populationData = await populationRes.json();

      // 辞書にある国だけに絞り込んでデータを綺麗にする
      const combined = flagData.data
        .filter(c => countryTranslation[c.name.toLowerCase().trim()])
        .map(country => {
          const lowerName = country.name.toLowerCase().trim();
          const capObj = capitalData.data.find(c => c.name.toLowerCase().trim() === lowerName);
          const capital = capObj && capObj.capital ? capObj.capital : "データなし";

          const popObj = populationData.data.find(c => c.country.toLowerCase().trim() === lowerName);
          let population = "データなし";
          if (popObj && popObj.populationCounts && popObj.populationCounts.length > 0) {
            const latestPop = popObj.populationCounts[popObj.populationCounts.length - 1];
            population = `${latestPop.value.toLocaleString()} 人 (${latestPop.year}年)`;
          }

          return {
            ...country,
            nameJa: getJapaneseName(country.name),
            capital: capital,
            population: population
          };
        });

      setFlags(combined);
      createQuiz(combined);
      setIsLoading(false);
    } catch (error) {
      console.error("データ取得エラー:", error);
      setIsLoading(false);
    }
  };

  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

  const createQuiz = (flagData = flags) => {
    if (flagData.length < 4) return;
    const correctCountry = flagData[Math.floor(Math.random() * flagData.length)];
    const wrongCountries = shuffle(
      flagData.filter((country) => country.name !== correctCountry.name)
    ).slice(0, 3);
    
    // 💡 ランダムでクイズモードを決定
    const modes = ["country", "capital", "flag"];
    const chosenMode = modes[Math.floor(Math.random() * modes.length)];
    setQuizMode(chosenMode);

    setQuiz(correctCountry);
    setChoices(shuffle([correctCountry, ...wrongCountries]));
    setResult("");
    setHasAnswered(false);
  };

  const checkAnswer = (selectedCountry) => {
    setHasAnswered(true);
    if (selectedCountry.name === quiz.name) {
      setResult("⭕ 正解！ 国旗コレクションに登録されました！");
      // 💡 コレクションへの追加＆保存
      if (!unlockedCountries.includes(quiz.name)) {
        const updated = [...unlockedCountries, quiz.name];
        setUnlockedCountries(updated);
        localStorage.setItem("unlocked_flags", JSON.stringify(updated));
      }
    } else {
      setResult(`❌ 不正解！正解は 「${quiz.nameJa}」 (首都: ${quiz.capital}) でした`);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212", color: "#fff" }}>
        <h2>🌍 クイズとコレクションを準備中...</h2>
      </div>
    );
  }

  // 図鑑のコンプリート率計算
  const completionRate = flags.length > 0 ? Math.round((unlockedCountries.length / flags.length) * 100) : 0;

  return (
    <div className="quiz-container" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", color: "#fff", backgroundColor: "#121212", minHeight: "100vh", boxSizing: "border-box" }}>
      <h1 className="app-title" style={{ fontSize: "28px", textAlign: "center", margin: "10px 0" }}>🌍 万国クイズ ＆ コレクション</h1>

      {/* タブメニュー */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setPage("quiz")} style={{ flex: 1, padding: "12px", backgroundColor: page === "quiz" ? "#007bff" : "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          🏳️ クイズに挑戦
        </button>
        <button onClick={() => setPage("collection")} style={{ flex: 1, padding: "12px", backgroundColor: page === "collection" ? "#007bff" : "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
          🏅 図鑑 ({unlockedCountries.length}国)
        </button>
      </div>

      <hr style={{ borderColor: "#333", marginBottom: "20px" }} />

      {/* 🏳️ クイズページ */}
      {page === "quiz" && quiz && (
        <div>
          {/* クイズの問題文の動的切り替え */}
          {quizMode === "country" && <h2 style={{ textAlign: "center", color: "#007bff" }}>❓ この国旗の【国名】はどこ？</h2>}
          {quizMode === "capital" && <h2 style={{ textAlign: "center", color: "#ffc107" }}>❓ この国旗の国の【首都】はどこ？</h2>}
          {quizMode === "flag" && <h2 style={{ textAlign: "center", color: "#28a745" }}>❓ 「{quiz.nameJa}」 の国旗はどれ？</h2>}

          {/* 問題の提示部分 */}
          <div style={{ textAlign: "center", backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            {quizMode === "flag" ? (
              <div style={{ color: "#333", fontSize: "24px", fontWeight: "bold", padding: "20px 0" }}>
                🏛️ 首都: {quiz.capital}<br/>
                👥 人口: {quiz.population}
              </div>
            ) : (
              <img src={quiz.flag} alt="国旗" style={{ maxWidth: "100%", height: "160px", objectFit: "contain" }} />
            )}
          </div>

          {/* 選択肢ボタン */}
          <div className="choices-grid" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {choices.map((country) => {
              const isCorrectChoice = country.name === quiz.name;
              return (
                <button
                  key={country.name}
                  className="choice-button"
                  onClick={() => checkAnswer(country)}
                  disabled={hasAnswered}
                  style={{
                    padding: "14px 10px",
                    flex: "1 1 45%",
                    cursor: hasAnswered ? "not-allowed" : "pointer",
                    backgroundColor: "#222",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: "6px",
                    fontSize: "15px",
                    fontWeight: "bold",
                    opacity: hasAnswered && !isCorrectChoice ? 0.3 : 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {/* 💡 国旗当てモードならボタンの中身を画像にする、それ以外はテキスト */}
                  {quizMode === "flag" ? (
                    <img src={country.flag} alt="選択肢" style={{ height: "50px", maxWidth: "100%", objectFit: "contain" }} />
                  ) : quizMode === "capital" ? (
                    `${country.capital} (${country.nameJa})`
                  ) : (
                    country.nameJa
                  )}
                </button>
              );
            })}
          </div>

          {/* 解説カード */}
          {hasAnswered && (
            <div style={{ marginTop: "25px", padding: "20px", borderRadius: "10px", backgroundColor: "#1e1e1e", border: "2px solid #007bff", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 15px 0", color: result.includes("⭕") ? "#28a745" : "#dc3545" }}>{result}</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                {quizMode === "flag" && (
                  <div style={{ textAlign: "center", background: "#fff", padding: "10px", borderRadius: "6px" }}>
                    <img src={quiz.flag} alt="正解" style={{ height: "100px", objectFit: "contain" }} />
                  </div>
                )}
                <div style={{ background: "#2a2a2a", padding: "10px 15px", borderRadius: "6px", display: "flex" }}>
                  <span style={{ color: "#aaa" }}>🌍 国名:</span>
                  <strong style={{ marginLeft: "auto" }}>{quiz.nameJa}</strong>
                </div>
                <div style={{ background: "#2a2a2a", padding: "10px 15px", borderRadius: "6px", display: "flex" }}>
                  <span style={{ color: "#aaa" }}>🏛️ 首都:</span>
                  <strong style={{ marginLeft: "auto", color: "#ffc107" }}>{quiz.capital}</strong>
                </div>
                <div style={{ background: "#2a2a2a", padding: "10px 15px", borderRadius: "6px", display: "flex" }}>
                  <span style={{ color: "#aaa" }}>👥 人口:</span>
                  <strong style={{ marginLeft: "auto", color: "#28a745" }}>{quiz.population}</strong>
                </div>
              </div>

              <button onClick={() => createQuiz()} style={{ marginTop: "20px", padding: "14px", width: "100%", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
                次 の 問 題 ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🏅 コレクションページ */}
      {page === "collection" && (
        <div>
          <div style={{ backgroundColor: "#1e1e1e", padding: "15px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 5px 0" }}>🏳️ 国旗図鑑コンプリート率</h3>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#ffc107" }}>{completionRate}% <span style={{ fontSize: "16px", color: "#aaa" }}>({unlockedCountries.length} / {flags.length} カ国)</span></div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "#333", borderRadius: "4px", marginTop: "10px", overflow: "hidden" }}>
              <div style={{ width: `${completionRate}%`, height: "100%", backgroundColor: "#ffc107", transition: "width 0.5s" }}></div>
            </div>
          </div>

          <div className="collection-grid">
            {flags.map((country) => {
              const isUnlocked = unlockedCountries.includes(country.name);
              return (
                <div
                  key={country.name}
                  onClick={() => isUnlocked && setSelectedCountry(country)}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    backgroundColor: selectedCountry?.name === country.name ? "#007bff" : "#222",
                    border: "1px solid #444",
                    textAlign: "center",
                    cursor: isUnlocked ? "pointer" : "not-allowed",
                  }}
                >
                  <img 
                    src={country.flag} 
                    alt="" 
                    className={isUnlocked ? "" : "locked-flag"}
                    style={{ width: "100%", height: "45px", objectFit: "contain", backgroundColor: isUnlocked ? "#f0f0f0" : "#111", borderRadius: "4px" }} 
                  />
                  <div style={{ fontSize: "11px", marginTop: "6px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: isUnlocked ? "#fff" : "#555" }}>
                    {isUnlocked ? country.nameJa : "？？？"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* コレクション詳細モーダル風表示 */}
          {selectedCountry && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", zIndex: 1000 }} onClick={() => setSelectedCountry(null)}>
              <div style={{ backgroundColor: "#1e1e1e", padding: "20px", borderRadius: "12px", width: "100%", maxWidth: "400px", border: "1px solid #444" }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: "24px", margin: "0 0 5px 0", textAlign: "center" }}>{selectedCountry.nameJa}</h3>
                <img src={selectedCountry.flag} alt="" style={{ width: "100%", maxHeight: "150px", objectFit: "contain", backgroundColor: "#f0f0f0", padding: "5px", borderRadius: "6px", margin: "15px 0" }} />
                <p><strong>🏛️ 首都:</strong> {selectedCountry.capital}</p>
                <p><strong>👥 人口:</strong> {selectedCountry.population}</p>
                <button onClick={() => setSelectedCountry(null)} style={{ width: "100%", padding: "10px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginTop: "10px" }}>閉じる</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;