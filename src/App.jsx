import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all')
        const data = await response.json()
        setCountries(data)
        console.log("取得データ:", data)
      } catch (error) {
        console.error("エラー:", error)
      }
    }
    fetchCountries()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>
      <h2>ステップ2：APIデータ取得テスト</h2>
      <p>現在、APIから <strong>{countries.length}</strong> カ国のデータを読み込みました！</p>
    </div>
  )
}

export default App