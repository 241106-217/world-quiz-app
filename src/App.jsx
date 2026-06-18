import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // 💡 学校でブロックされるURLの代わりに、GitHub上の安全なバックアップデータから取得する！
        const response = await fetch('https://raw.githubusercontent.com/mledoze/countries/master/countries.json')
        const data = await response.json()
        
        // データの形を授業のAPI（restcountries）と同じ形式に変換してセット
        const formattedData = data.map(c => ({
          name: { common: c.name.common },
          flags: { png: `https://flagcdn.com/w320/${c.cca2.toLowerCase()}.png` },
          cca3: c.cca3
        }))

        setCountries(formattedData)
        console.log("データ取得成功！", formattedData)
      } catch (error) {
        console.error("エラー:", error)
      }
    }
    fetchCountries()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>
      <h2>ステップ2：ネットワーク回避・API取得テスト</h2>
      <p>現在、安全なAPIルートから <strong>{countries.length}</strong> カ国のデータを読み込みました！</p>
    </div>
  )
}

export default App