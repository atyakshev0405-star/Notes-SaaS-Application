function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', fontSize: '32px' }}>Notes App - Test</h1>
      <p style={{ color: '#666', fontSize: '18px' }}>If you see this, React is working!</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'white', border: '1px solid #ccc' }}>
        <p>This is a test component without Tailwind CSS</p>
      </div>
    </div>
  )
}

export default App
