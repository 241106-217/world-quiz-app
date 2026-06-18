import { useState, useEffect } from 'react'

function App() {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // 1. 新しいAPI（CountriesNow）からデータを取得
        const response = await fetch('https://countriesnow.space/api/v0.1/countries')
        if (!response.ok) throw new Error('通信エラーが発生しました')
        
        const jsonResult = await response.json()
        
        // 💡 CountriesNowは「jsonResult.data」の中に国の配列が入っています
        const countryList = jsonResult.data || []
        
        // 2. 取得した国リストをセット
        setCountries(countryList)
        console.log("データ取得成功:", countryList)
      } catch (error) {
        console.error("エラーが発生しました:", error)
      }
    }
    fetchCountries()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌍 世界の国々 探索＆クイズ</h1>
      <h2>ステップ2：API変更テスト (CountriesNow)</h2>
      
      {/* 国のデータが読み込まれると、ここが0から変化します */}
      <p>現在、新しいAPIから <strong>{countries.length}</strong> カ国のデータを読み込みました！</p>

      {/* 最初の5カ国だけ国名を表示してみるテスト */}
      {countries.length > 0 && (
        <ul>
          {countries.slice(0, 5).map((country, index) => (
            <li key={index}>{country.country}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App