import { useEffect, useState } from "react";

// 💡 国名日本語化辞書（検索とクイズで共通使用）
const countryTranslation = {
  "afghanistan": "アフガニスタン", "albania": "アルバニア", "algeria": "アルジェリア", "andorra": "アンドラ", "angola": "アンゴラ",
  "anguilla": "アンギラ", "antigua and barbuda": "アンティグア・バーブーダ", "argentina": "アルゼンチン", "armenia": "アルメニア", "aruba": "アルバ",
  "australia": "オーストラリア", "austria": "オーストリア", "azerbaijan": "アゼルバイジャン", "bahamas": "バハマ", "bahrain": "バーレーン",
  "bangladesh": "バングラデシュ", "barbados": "バルバドス", "belarus": "ベラルーシ", "belgium": "ベルギー", "belize": "ベリーズ",
  "benin": "ベナン", "bermuda": "バミューダ", "bhutan": "ブータン", "bolivia": "ボリビア", "bosnia and herzegovina": "ボスニア・ヘルツェゴビナ", 
  "botswana": "ボツワナ", "brazil": "ブラジル", "british virgin islands": "イギリス領ヴァージン諸島", "brunei": "ブルネイ", "bulgaria": "ブルガリア", 
  "burkina faso": "ブルキナファソ", "burundi": "ブルンジ", "cambodia": "カンボジア", "cameroon": "カメルーン", "canada": "カナダ", 
  "cape verde": "カーボベルデ", "cayman islands": "ケイマン諸島", "central african republic": "中央アフリカ共和国", "chad": "チャド", "chile": "チリ", 
  "china": "中国", "colombia": "コロンビア", "comoros": "コモロ", "congo": "コンゴ共和国", "congo dk": "コンゴ民主共和国", 
  "cook islands": "クック諸島", "costa rica": "コスタリカ", "cote d'ivoire": "コートジボワール", "croatia": "クロアチア", "cuba": "キューバ", 
  "cyprus": "キプロス", "czech republic": "チェコ", "denmark": "デンマーク", "djibouti": "ジブチ", "dominica": "ドミニカ国", 
  "dominican republic": "ドミニカ共和国", "ecuador": "エクアドル", "egypt": "エジプト", "el salvador": "エルサルバドル", "equatorial guinea": "赤道ギニア", 
  "eritrea": "エリトリア", "estonia": "エストニア", "ethiopia": "エチオピア", "falkland islands": "フォークランド諸島", "faroe islands": "フェロー諸島", 
  "fiji": "フィジー", "finland": "フィンランド", "france": "フランス", "french guiana": "仏領ギアナ", "french polynesia": "仏領ポリネシア", 
  "gabon": "ガボン", "gambia": "ガンビア", "georgia": "ジョージア", "germany": "ドイツ", "ghana": "ガーナ", 
  "gibraltar": "ジブラルタル", "greece": "ギリシャ", "greenland": "グリーンランド", "grenada": "グレナダ", "guadeloupe": "グアドループ", 
  "guam": "グアム", "guatemala": "グアテマラ", "guinea": "ギニア", "guinea-bissau": "ギニアビサウ", "guyana": "ガイアナ", 
  "haiti": "ハイチ", "honduras": "ホンジュラス", "hong kong": "香港", "hungary": "ハンガリー", "iceland": "アイスランド", 
  "india": "インド", "indonesia": "インドネシア", "iran": "イラン", "iraq": "イラク", "ireland": "アイルランド", 
  "israel": "イスラエル", "italy": "イタリア", "isle of man": "マン島", "jamaica": "ジャマイカ", "japan": "日本", "jordan": "ヨルダン", 
  "kazakhstan": "カザフスタン", "kenya": "ケニア", "kiribati": "キリバス", "kuwait": "クウェート", "kyrgyzstan": "キルギス", 
  "laos": "ラオス", "latvia": "ラトビア", "lebanon": "レバノン", "lesotho": "レソト", "liberia": "リベリア", 
  "libya": "リビア", "liechtenstein": "リヒテンシュタイン", "lithuania": "リトアニア", "luxembourg": "ルクセンブルク", "macao": "マカオ", 
  "macedonia": "北マケドニア", "madagascar": "マダガスカル", "malawi": "マラウイ", "malaysia": "マレーシア", "maldives": "モルディブ", 
  "mali": "マリ", "malta": "マルタ", "marshall islands": "マーシャル諸島", "martinique": "マルティニーク", "mauritania": "モーリタニア", 
  "mauritius": "モーリシャス", "mexico": "メキシコ", "micronesia": "ミクロネシア", "moldova": "モルドバ", "monaco": "モナコ", 
  "mongolia": "モンゴル", "montserrat": "モントセラト", "morocco": "モロッコ", "mozambique": "モザンビーク", "myanmar": "ミャンマー", 
  "namibia": "ナミビア", "nauru": "ナウル", "nepal": "ネパール", "netherlands": "オランダ", "netherlands antilles": "オランダ領アンティル", 
  "new caledonia": "ニューカレドニア", "new zealand": "ニュージーランド", "nicaragua": "ニカラグア", "niger": "ニジェール", "nigeria": "ナイジェリア", 
  "niue": "ニウエ", "norfolk island": "ノーフォーク島", "north korea": "北朝鮮", "northern mariana islands": "北マリアナ諸島", "norway": "ノルウェー", 
  "oman": "オマーン", "pakistan": "パキスタン", "palau": "パラオ", "palestine": "パレスチナ", "panama": "パナマ", 
  "papua new guinea": "パプアニューギニア", "paraguay": "パラグアイ", "peru": "ペルー", "philippines": "フィリピン", "pitcairn": "ピトケアン諸島", 
  "poland": "ポーランド", "portugal": "ポルトガル", "puerto rico": "プエルトリコ", "qatar": "カタール", "reunion": "レユニオン", 
  "romania": "ルーマニア", "russia": "ロシア", "rwanda": "ルワンダ", "saint helena": "セントヘレナ", "saint kitts and nevis": "セントクリストファー・ネーヴィス", 
  "saint lucia": "セントルシア", "saint pierre and miquelon": "サンピエール島・ミクロン島", "saint vincent and grenadines": "セントビンセント・グレナディーン", "samoa": "サモア", "san marino": "サンマリノ", 
  "sao tome and principe": "サントメ・プリンシペ", "saudi arabia": "サウジアラビア", "senegal": "セネガル", "serbia": "セルビア", "seychelles": "セーシェル", 
  "sierra leone": "シエラレオネ", "singapore": "シンガポール", "slovakia": "スロバキア", "slovenia": "スロベニア", "solomon islands": "ソロモン諸島", 
  "somalia": "ソマリア", "south africa": "南アフリカ", "south georgia": "サウスジョージア・サウスサンドウィッチ諸島", "south korea": "韓国", "south sudan": "南スーダン", 
  "spain": "スペイン", "sri lanka": "スリランカ", "sudan": "スーダン", "suriname": "スリナム", "swaziland": "エスワティニ", 
  "sweden": "スウェーデン", "switzerland": "スイス", "syria": "シリア", "taiwan": "台湾", "tajikistan": "タジキスタン", 
  "tanzania": "タンザニア", "thailand": "タイ", "togo": "トーゴ", "tokelau": "トケラウ", "tonga": "トンガ", 
  "trinidad and tobago": "トリニダード・トバゴ", "tunisia": "チュニジア", "turkey": "トルコ", "turkmenistan": "トルクメニスタン", "turks and caicos islands": "タークス・カイコス諸島", 
  "tuvalu": "ツバル", "uganda": "ウガンダ", "ukraine": "ウクライナ", "united arab emirates": "アラブ首長国連邦", "united kingdom": "イギリス", 
  "united states of america": "アメリカ", "united states": "アメリカ", "uruguay": "ウルグアイ", "uzbekistan": "ウズベキスタン", "vanuatu": "バヌアツ", "vatican": "バチカン", 
  "venezuela": "ベネズエラ", "vietnam": "ベトナム", "wallis and futuna": "ウォリス・フツナ", "western sahara": "西サハラ", "yemen": "イエメン", 
  "zambia": "ザンビア", "zimbabwe": "ジンバブエ"
};

const getJapaneseName = (englishName) => {
  if (!englishName) return "不明な国";
  const lower = englishName.toLowerCase().trim();
  return countryTranslation[lower] || englishName; 
};

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizMode, setQuizMode] = useState("country"); // 💡 country:国名当て, capital:首都当て, flag:国旗当て
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("search"); // 💡 最初は検索ページを表示
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  // 💡 コレクション（正解して解放した国の英語名を保存する配列）
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

      const combined = flagData.data.map(country => {
        const lowerName = country.name.toLowerCase().trim();
        const capObj = capitalData.data.find(c => c.name.toLowerCase().trim() === lowerName);
        const capital = capObj ? capObj.capital : "データなし";

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
      console.error("データの取得に失敗しました:", error);
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
    
    // 💡 クイズの種類をランダムで決定（国名当て、首都当て、国旗当て）
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
      setResult("⭕ 正解！ 図鑑にコレクションされました！");
      
      // 💡 正解した国をコレクションに保存
      if (!unlockedCountries.includes(quiz.name)) {
        const updated = [...unlockedCountries, quiz.name];
        setUnlockedCountries(updated);
        localStorage.setItem("unlocked_flags", JSON.stringify(updated));
      }
    } else {
      setResult(`❌ 不正解！正解は 「${quiz.nameJa}」 でした`);
    }
  };

  const filteredCountries = flags.filter((country) =>
    country.nameJa.toLowerCase().includes(search.toLowerCase()) ||
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  // 図鑑のコンプリート率
  const completionRate = flags.length > 0 ? Math.round((unlockedCountries.length / flags.length) * 100) : 0;

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#121212", color: "#fff" }}>
        <h2>🌍 世界のデータを読み込み中...</h2>
      </div>
    );
  }

  return (
    <div className="quiz-container" style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", color: "#fff", backgroundColor: "#121212", minHeight: "100vh", boxSizing: "border-box" }}>
      <h1 className="app-title" style={{ fontSize: "26px", textAlign: "center", margin: "10px 0" }}>🌍 世界の国々 探索＆クイズゲーム</h1>

      {/* 💡 3つのトップメニュータブ */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "8px" }}>
        <button onClick={() => setPage("search")} style={{ flex: 1, padding: "10px 5px", backgroundColor: page === "search" ? "#007bff" : "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
          🔍 国名検索
        </button>
        <button onClick={() => setPage("quiz")} style={{ flex: 1, padding: "10px 5px", backgroundColor: page === "quiz" ? "#007bff" : "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
          🏳️ クイズ
        </button>
        <button onClick={() => setPage("collection")} style={{ flex: 1, padding: "10px 5px", backgroundColor: page === "collection" ? "#007bff" : "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}>
          🏅 図鑑 ({unlockedCountries.length})
        </button>
      </div>

      <hr style={{ borderColor: "#333", marginBottom: "20px" }} />

      {/* 🔍 1. 検索ページ */}
      {page === "search" && (
        <div>
          <h2>🔍 国名検索 (日本語・人口・首都対応)</h2>
          <input
            type="text"
            placeholder="「日本」「フランス」など入力..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "14px", width: "100%", boxSizing: "border-box", marginBottom: "15px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#222", color: "#fff", fontSize: "16px" }}
          />
          <p style={{ fontSize: "14px" }}>検索結果：<strong>{filteredCountries.length}</strong> 件（横にスライド ➔）</p>
          
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "15px", marginBottom: "20px", scrollBehavior: "smooth" }}>
            {filteredCountries.slice(0, 15).map((country) => (
              <div 
                key={country.name}
                onClick={() => setSelectedCountry(country)}
                style={{ flex: "0 0 130px", padding: "10px", borderRadius: "8px", backgroundColor: selectedCountry?.name === country.name ? "#007bff" : "#222", border: "1px solid #444", textAlign: "center", cursor: "pointer" }}
              >
                <img src={country.flag} alt="" style={{ width: "100%", height: "55px", objectFit: "contain", backgroundColor: "#f0f0f0", borderRadius: "4px" }} />
                <div style={{ fontSize: "12px", marginTop: "8px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: "bold" }}>{country.nameJa}</div>
              </div>
            ))}
          </div>

          {selectedCountry && (
            <div style={{ padding: "20px", borderRadius: "12px", backgroundColor: "#1e1e1e", border: "1px solid #333", textAlign: "center" }}>
              <h3 style={{ fontSize: "26px", margin: "0 0 5px 0" }}>{selectedCountry.nameJa}</h3>
              <p style={{ color: "#888", margin: "0 0 20px 0", fontSize: "14px" }}>{selectedCountry.name}</p>
              <img src={selectedCountry.flag} alt="国旗" style={{ width: "100%", maxHeight: "180px", objectFit: "contain", backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "8px", marginBottom: "20px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                <div style={{ background: "#2a2a2a", padding: "12px 15px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}><span style={{ color: "#aaa" }}>🏛️ 首都:</span><strong style={{ color: "#ffc107" }}>{selectedCountry.capital}</strong></div>
                <div style={{ background: "#2a2a2a", padding: "12px 15px", borderRadius: "8px", display: "flex", justifyContent: "space-between" }}><span style={{ color: "#aaa" }}>👥 人口:</span><strong style={{ color: "#28a745" }}>{selectedCountry.population}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🏳️ 2. クイズページ（3つのモード自動切替） */}
      {page === "quiz" && quiz && (
        <div>
          {quizMode === "country" && <h2 style={{ color: "#007bff", textAlign: "center" }}>❓ この国旗の【国名】はどこ？</h2>}
          {quizMode === "capital" && <h2 style={{ color: "#ffc107", textAlign: "center" }}>❓ この国旗の国の【首都】はどこ？</h2>}
          {quizMode === "flag" && <h2 style={{ color: "#28a745", textAlign: "center" }}>❓ 「{quiz.nameJa}」の国旗はどれ？</h2>}

          <div style={{ textAlign: "center", backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            {/* 💡 国旗当てモードならヒントテキストを表示、それ以外は大きな国旗画像を表示 */}
            {quizMode === "flag" ? (
              <div style={{ color: "#333", fontSize: "20px", fontWeight: "bold", padding: "20px 0" }}>
                🏛️ 首都ヒント: {quiz.capital}<br/>
                👥 人口ヒント: {quiz.population}
              </div>
            ) : (
              <img src={quiz.flag} alt="国旗" style={{ maxWidth: "100%", height: "160px", objectFit: "contain" }} />
            )}
          </div>

          <div className="choices-grid" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {choices.map((country) => {
              const isCorrect = country.name === quiz.name;
              return (
                <button
                  key={country.name}
                  className="choice-button"
                  onClick={() => checkAnswer(country)}
                  disabled={hasAnswered}
                  style={{
                    padding: "14px 10px", flex: "1 1 45%", cursor: hasAnswered ? "not-allowed" : "pointer",
                    backgroundColor: "#222", color: "#fff", border: "1px solid #444", borderRadius: "6px",
                    fontSize: "15px", fontWeight: "bold", opacity: hasAnswered && !isCorrect ? 0.3 : 1,
                    display: "flex", justifyContent: "center", alignItems: "center"
                  }}
                >
                  {/* 💡 国旗当てモードなら選択肢ボタンの中に国旗画像を表示 */}
                  {quizMode === "flag" ? (
                    <img src={country.flag} alt="選択肢" style={{ height: "45px", maxWidth: "100%", objectFit: "contain" }} />
                  ) : quizMode === "capital" ? (
                    `${country.capital} (${country.nameJa})`
                  ) : (
                    country.nameJa
                  )}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div style={{ marginTop: "25px", padding: "20px", borderRadius: "10px", backgroundColor: "#1e1e1e", border: "2px solid #007bff", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 15px 0", color: result.includes("⭕") ? "#28a745" : "#dc3545" }}>{result}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
                {quizMode === "flag" && (
                  <div style={{ textAlign: "center", background: "#fff", padding: "10px", borderRadius: "6px" }}><img src={quiz.flag} alt="正解" style={{ height: "90px", objectFit: "contain" }} /></div>
                )}
                <div style={{ background: "#2a2a2a", padding: "10px 15px", borderRadius: "6px", display: "flex" }}><span style={{ color: "#aaa" }}>🌍 正解の国:</span><strong style={{ marginLeft: "auto" }}>{quiz.nameJa}</strong></div>
                <div style={{ background: "#2a2a2a", padding: "10px 15px", borderRadius: "6px", display: "flex" }}><span style={{ color: "#aaa" }}>🏛️ 首都:</span><strong style={{ marginLeft: "auto", color: "#ffc107" }}>{quiz.capital}</strong></div>
                <div style={{ background: "#2a2a2a", padding: "10px 15px", borderRadius: "6px", display: "flex" }}><span style={{ color: "#aaa" }}>👥 人口:</span><strong style={{ marginLeft: "auto", color: "#28a745" }}>{quiz.population}</strong></div>
              </div>
              <button onClick={() => createQuiz()} style={{ marginTop: "20px", padding: "14px", width: "100%", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>次の問題 ➔</button>
            </div>
          )}
        </div>
      )}

      {/* 🏅 3. コレクション図鑑ページ */}
      {page === "collection" && (
        <div>
          <div style={{ backgroundColor: "#1e1e1e", padding: "15px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 5px 0" }}>🎖️ 国旗図鑑コンプリート率</h3>
            <div style={{ fontSize: "26px", fontWeight: "bold", color: "#ffc107" }}>{completionRate}% <span style={{ fontSize: "15px", color: "#aaa" }}>({unlockedCountries.length} / {flags.length} カ国)</span></div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "#333", borderRadius: "4px", marginTop: "10px", overflow: "hidden" }}>
              <div style={{ width: `${completionRate}%`, height: "100%", backgroundColor: "#ffc107" }}></div>
            </div>
          </div>

          <div className="collection-grid">
            {flags.map((country) => {
              const isUnlocked = unlockedCountries.includes(country.name);
              return (
                <div
                  key={country.name}
                  onClick={() => isUnlocked && setSelectedCountry(country)}
                  style={{ padding: "8px", borderRadius: "6px", backgroundColor: selectedCountry?.name === country.name ? "#007bff" : "#222", border: "1px solid #444", textAlign: "center", cursor: isUnlocked ? "pointer" : "not-allowed" }}
                >
                  <img src={country.flag} alt="" className={isUnlocked ? "" : "locked-flag"} style={{ width: "100%", height: "45px", objectFit: "contain", backgroundColor: isUnlocked ? "#f0f0f0" : "#111", borderRadius: "4px" }} />
                  <div style={{ fontSize: "11px", marginTop: "6px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", color: isUnlocked ? "#fff" : "#555" }}>
                    {isUnlocked ? country.nameJa : "？？？"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 解放した国をタップした時の詳細表示（ポップアップ風） */}
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