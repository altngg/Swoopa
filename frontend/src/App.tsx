import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Favorites from './pages/Favorites';
import UserAccount from './pages/UserAccount';
import ItemPreview from './pages/ItemPreview';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import SearchField from './components/SearchField';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="min-w-[80rem] max-w-4xl mx-auto">
          <SearchField />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/user-account" element={<UserAccount initialTab="ads" />} />
            <Route path="/user-account/messages" element={<UserAccount initialTab="messages" />} />
            <Route path="/item/:id" element={<ItemPreview />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        
      </div>
    </Router>
  );
}

export default App;