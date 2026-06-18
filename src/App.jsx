import { useEffect, useState } from "react";

function App() {
  const [flags, setFlags] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [choices, setChoices] = useState([]);
  const [result, setResult] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const response = await fetch(
        "https://countriesnow.space/api/v0.1/countries/flag/images"
      );

      if (!response.ok) {
        throw new Error("通信エラーが発生しました");
      }

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

    const correctCountry =
      flagData[Math.floor(Math.random() * flagData.length)];

    const wrongCountries = shuffle(
      flagData.filter(
        (country) => country.name !== correctCountry.name
      )
    ).slice(0, 3);

    const allChoices = shuffle([
      correctCountry,
      ...wrongCountries,
    ]);

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
    country.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>

      <hr />

      <h2>🔍 国名検索</h2>

      <input
        type="text"
        placeholder="国名を入力"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "10px",
        }}
      />

      <p>
        検索結果：
        <strong>{filteredCountries.length}</strong>
        件
      </p>

      <ul>
        {filteredCountries.slice(0, 10).map((country) => (
          <li key={country.name}>
            {country.name}
          </li>
        ))}
      </ul>

      <hr />

      <h2>🏳️ 国旗クイズ</h2>

      {quiz && (
        <>
          <img
            src={quiz.flag}
            alt="国旗"
            width="300"
          />

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {choices.map((country) => (
              <button
                key={country.name}
                onClick={() =>
                  checkAnswer(country.name)
                }
              >
                {country.name}
              </button>
            ))}
          </div>

          <h3>{result}</h3>

          <button
            onClick={() => createQuiz()}
            style={{
              marginTop: "10px",
              padding: "10px",
            }}
          >
            次の問題
          </button>
        </>
      )}

      <hr />

      <p>
        現在、
        <strong>{flags.length}</strong>
        カ国のデータを読み込みました。
      </p>
    </div>
  );
}

export default App;