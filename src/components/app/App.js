// стилі і картинки
import './app.scss'
// компоненти
import MainPage from "../pages/mainPage/MainPage";
import VotingPage from '../pages/votingPage/VotingPage';
import LikesPage from '../pages/votingPage/likesPage/LikesPage';
import DislikesPage from '../pages/votingPage/dislikesPage/DislikesPage';
import FavouritesPage from '../pages/votingPage/favouritesPage/FavouritesPage';
// хуки
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BreedsPage from '../pages/breedsPage/BreedsPage';
import BreedsSinglePage from '../pages/breedsPage/breedsSinglePage/BreedsSinglePage';
import GalleryPage from '../pages/galleryPage/GalleryPage';
import { InputContext } from '../../context/context';
import { SearchLengthContext } from '../../context/context';

import { useState } from 'react';

const App = () => {
  const [searchBtnClicked, setSearchBtnClicked] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  return (
    <SearchLengthContext.Provider value={{ searchInput, setSearchInput }}>
      <InputContext.Provider value={{ searchBtnClicked, setSearchBtnClicked }}>
        <Router>
          <div className="app">
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/voting' element={<VotingPage />} />
              <Route path='/voting/likes' element={<LikesPage />} />
              <Route path='/voting/dislikes' element={<DislikesPage />} />
              <Route path='/voting/favourites' element={<FavouritesPage />} />
              <Route path='/breeds' element={<BreedsPage />} />
              <Route path='/breeds/:id' element={<BreedsSinglePage />} />
              <Route path='/gallery' element={<GalleryPage />} />
            </Routes>
          </div>
        </Router>
      </InputContext.Provider>
    </SearchLengthContext.Provider>
  );
}

export default App;
