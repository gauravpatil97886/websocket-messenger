import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css'
import Chat from './Chat.jsx'
import './assets/chat.css'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/chat' element={<Chat/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App