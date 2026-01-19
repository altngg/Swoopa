import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Favorites from './pages/Favorites';
import UserAccount from './pages/UserAccount';
import ItemPreview from './pages/ItemPreview';
import Profile from './pages/Profile';
import SearchField from './components/SearchField';
import AddPost from './pages/AddPost';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Выносим общий лейаут с Navbar отдельно
function MainLayout() {
  return (
    <>
      <Navbar />
      <SearchField />
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/user-account" element={<UserAccount initialTab="ads" />} />
        <Route path="/user-account/messages/:chatId?" element={<UserAccount initialTab="messages" />} />
        <Route path="/user-account/offers" element={<UserAccount initialTab="offers" />} />
        <Route path="/item/:id" element={<ItemPreview />} />
        <Route path="/item/free/:id" element={<ItemPreview />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/users/:id" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;