import { useEffect, useState } from "react";

// 💡 APIから飛んでくる可能性のある表記をすべてカバーした辞書
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

// 💡 どんな国名が来ても絶対に日本語に変換する安全機能
const getJapaneseName = (englishName) => {
  if (!englishName) return "不明な国";
  const lower = englishName.toLowerCase().trim();
  
  // 1. 辞書に完全一致すればそれを返す
  if (countryTranslation[lower]) return countryTranslation[lower];
  
  // 2. 「United States」などの部分一致を救済
  if (lower.includes("united states")) return "アメリカ";
  if (lower.includes("isle of man")) return "マン島";
  if (lower.includes("united kingdom")) return "イギリス";
  if (lower.includes("russia")) return "ロシア";
  
  return englishName; // 最悪のフォールバック
};

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("search"); 
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

      const combinedData = data.data.map(country => {
        return {
          ...country,
          nameJa: getJapaneseName(country.name) // 💡 安全な変換関数を通す
        };
      });

      setFlags(combinedData);
      createQuiz(combinedData);
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
    
    // 💡 選択肢に変わるタイミングでも確実に日本語名を再生成・保証する
    const allChoices = shuffle([correctCountry, ...wrongCountries]).map(c => ({
      ...c,
      nameJa: getJapaneseName(c.name)
    }));

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

  const filteredCountries = flags.filter((country) =>
    country.nameJa.toLowerCase().includes(search.toLowerCase()) ||
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", color: "#fff", backgroundColor: "#121212", minHeight: "100vh" }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={() => setPage("search")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "search" ? "#007bff" : "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🔍 国名検索
        </button>
        <button 
          onClick={() => setPage("quiz")}
          style={{
            padding: "10px 20px",
            backgroundColor: page === "quiz" ? "#007bff" : "#333",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
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
            placeholder="「日本」「アンゴラ」など日本語で入力..."
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
          
          <div style={{ 
            display: "flex", 
            gap: "15px", 
            overflowX: "auto", 
            paddingBottom: "15px",
            marginBottom: "20px",
            scrollBehavior: "smooth"
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
                <div style={{ fontSize: "13px", marginTop: "8px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", fontWeight: "bold" }}>
                  {country.nameJa}
                </div>
              </div>
            ))}
          </div>

          {selectedCountry && (
            <div style={{ padding: "20px", borderRadius: "12px", backgroundColor: "#1e1e1e", border: "1px solid #333", textAlign: "center" }}>
              <h3 style={{ fontSize: "26px", margin: "0 0 5px 0" }}>{selectedCountry.nameJa}</h3>
              <p style={{ color: "#888", margin: "0 0 15px 0", fontSize: "14px" }}>{selectedCountry.name}</p>
              
              <img 
                src={selectedCountry.flag} 
                alt="国旗" 
                style={{ width: "100%", maxHeight: "250px", objectFit: "contain", backgroundColor: "#f0f0f0", padding: "10px", borderRadius: "8px" }} 
              />
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
    </div>
  );
}

export default App;