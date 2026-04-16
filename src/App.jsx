import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GameProvider } from './context/GameContext.jsx'
import MainPage from './pages/MainPage.jsx'
import SetupPage from './pages/SetupPage.jsx'
import GamePage from './pages/GamePage.jsx'
import EndPage from './pages/EndPage.jsx'
export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/end" element={<EndPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameProvider>
    </BrowserRouter>
  )
}
