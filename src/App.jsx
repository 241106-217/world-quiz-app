import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // 1. APIからデータを取得
        const response = await fetch('https://restcountries.com/v3.1/all')
        if (!response.ok) throw new Error('通信エラーが発生しました')
        
        const data = await response.json()
        
        // 2. 取得したデータ（250カ国分）をそのままセット
        setCountries(data)
        console.log("データの取得に成功しました！", data)
      } catch (error) {
        console.error("エラーが発生しました:", error)
      }
    }
    fetchCountries()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>
      <h2>ステップ2：APIデータ取得テスト</h2>
      
      {/* 3. データの件数を表示 */}
      <p>現在、APIから <strong>{countries.length}</strong> カ国のデータを読み込みました！</p>

      {/* ⚠️ 安全に国名を表示するためのテスト（中身がある時だけ回す） */}
      {countries.length > 0 && (
        <ul>
          {countries.slice(0, 5).map((country) => (
            <li key={country.cca3}>{country.name?.common}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App