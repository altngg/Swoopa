/* eslint-disable @typescript-eslint/no-explicit-any */
// Создайте файл ApiTest.tsx
import React, { useState } from 'react';

const ApiTest: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username || 'testuser',
          password: password || 'testpassword123'
        }),
      });

      const data = await response.json();
      
      console.log('🔍 СЫРОЙ ОТВЕТ ОТ СЕРВЕРА:', {
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        data: data,
        dataType: typeof data,
        keys: Object.keys(data),
        accessTokenExists: 'access_token' in data,
        accessTokenValue: data.access_token,
        accessTokenType: typeof data.access_token,
        fullDataString: JSON.stringify(data)
      });

      setResult(data);
      
      // Сохраняем как есть
      localStorage.setItem('test_raw_response', JSON.stringify(data));
      
      if (data.access_token) {
        console.log('✅ Найден access_token:', {
          length: data.access_token.length,
          firstChars: data.access_token.substring(0, 20),
          type: typeof data.access_token
        });
        localStorage.setItem('test_access_token', data.access_token);
      } else {
        console.log('❌ NO access_token in response! Keys:', Object.keys(data));
        console.log('Full response:', data);
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '10px' }}>
      <h2>🔧 ТЕСТ API (СЫРОЙ ЗАПРОС)</h2>
      <div>
        <input 
          placeholder="username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ margin: '5px', padding: '5px' }}
        />
        <input 
          type="password"
          placeholder="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ margin: '5px', padding: '5px' }}
        />
      </div>
      <button onClick={testApi} disabled={loading} style={{ margin: '5px', padding: '10px' }}>
        {loading ? 'Тестирую...' : 'Тест /users/login/'}
      </button>
      
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Результат:</h3>
          <pre style={{ background: '#f0f0f0', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;