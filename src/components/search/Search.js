import './search.scss';
import searchImg1 from '../../imgs/search1.svg';
import searchImg2 from '../../imgs/search2.svg';
import searchImg3 from '../../imgs/search3.svg';
import searchIcon from '../../imgs/searchIcon.svg';
import VotingArrow from '../../imgs/voting-arrow.svg';
import searchImgWhiteSmile from '../../imgs/voting-likes-smile.svg';
import searchImgWhiteSad from '../../imgs/voting-dislikes-sad.svg';
import searchImgWhiteHeart from '../../imgs/voting-favourites-heart.svg';
import Spinner from '../spinner/Spinner';
// хуки
import {useHttp} from '../../hooks/http.hooks';
import { useState, useEffect, useContext, createRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {InputContext} from '../../context/context';
import { SearchLengthContext } from '../../context/context';

const Search = () => {
    const {request} = useHttp();
    const location = useLocation();
    const [activeClassLikes, setActiveClassLikes] = useState(false);
    const [activeClassDislikes, setActiveClassDislikes] = useState(false);
    const [activeClassFavourites, setActiveClassFavourites] = useState(false);
    // з контексту
    const [loading, setLoading] = useState(false);
    const {searchInput, setSearchInput} = useContext(SearchLengthContext);
    const { searchBtnClicked, setSearchBtnClicked } = useContext(InputContext);
    // верстка
    // const [error, setError] = useState(false);
    const [breedId, setBreedId] = useState('');
    const [cats, setCats] = useState([]);
    const [uploadedCatNotFound, setUploadedCatNotFound] = useState(true);

    const myRef = createRef();
    const showFocus = () => {
        myRef.current.focus()
    }

    useEffect(() => {
        switch (location.pathname) {
            case '/voting/likes':
                setActiveClassLikes(true)
                break;
            case '/voting/dislikes':
                setActiveClassDislikes(true);
                break;
            case '/voting/favourites':
                setActiveClassFavourites(true);
                break;
        }
    }, [location])

    const searchCat = (e) => {
        setSearchInput(e.target.value)
        if (e.target.value === 0) {
            setSearchBtnClicked(false);
            setCats([])
            setBreedId('')
        }
    }

    const changeBtnStatus = (e) => {
        e.preventDefault();
        setLoading(true);

        setSearchBtnClicked(true);

        request(`https://api.thecatapi.com/v1/breeds/search?q=${searchInput}`, 'GET', null, {'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'}) 
        .then(onOk)
        .catch(onError)
    }

    const onOk = (data) => {
        setLoading(false);
        setBreedId(data[0].id)
        setUploadedCatNotFound(false)
    }

    const onError = () => {
        setLoading(false);
        setUploadedCatNotFound(true)
    }

    useEffect(() => {
        getCatsWithBreedId();
    }, [breedId])

    const getCatsWithBreedId = () => {
        if (breedId.length > 1) {
            request(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`, 'GET', null, {'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'})
            .then(setCats)
        }
    }

    const catsContent = cats.map(item => {
        return (
            <div key={item.id} className="grid-item">
                <img className="grid-item-img" src={item.url} alt="" />
            </div>
        ) 
    });

    return (
        <>
            {searchBtnClicked && searchInput.length > 0  ?
                <div className='voting'>
                    <div className="search">
                        <div className="search-inp">
                            <input
                                value={searchInput}
                                type="text"
                                name="search"
                                onChange={(e) => searchCat(e)}
                                placeholder='Search for breeds by name'
                                 />
                                {loading ?  
                                <div className='search-spinner'><Spinner /></div> 
                                :   
                                <Link onClick={(e) => changeBtnStatus(e)} to='#'>
                                    <img src={searchIcon} alt="searchIcon" />
                                </Link>
                                }
                        </div>
                        <div className="search-icons">  
                            <div style={{ 'backgroundColor': activeClassLikes ? '#FF868E' : null }}>
                                <Link className="search-icon" to='/voting/likes'>
                                    <img src={activeClassLikes ? searchImgWhiteSmile : searchImg1} alt="" />
                                </Link>
                            </div>
                            <div style={{ 'backgroundColor': activeClassFavourites ? '#FF868E' : null }}>
                                <Link to='/voting/favourites'>
                                    <img src={activeClassFavourites ? searchImgWhiteHeart : searchImg2} alt="" />
                                </Link></div>
                            <div style={{ 'backgroundColor': activeClassDislikes ? '#FF868E' : null }}>
                                <Link to="/voting/dislikes">
                                    <img src={activeClassDislikes ? searchImgWhiteSad : searchImg3} alt="" />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="voting-wrapper">
                        <Link to="/" className="voting-wrapper-arrow">
                            <div>
                                <img src={VotingArrow} alt="VotingArrow" />
                            </div>
                        </Link>
                        <div className="voting-wrapper-title breed-wrapper-title">
                            Search
                        </div>
                        {!loading ?
                        <div>
                        {uploadedCatNotFound ? 
                            <div className="search-info-breed">
                                Sorry, no search results for: <strong>{searchInput}</strong>
                            </div>
                        : 
                        <>
                            <div className="search-info-breed">
                                Search results for: <strong>{searchInput}</strong>
                            </div>
                            <div className="grid">
                                {catsContent}
                            </div>
                        </>
                        }
                    </div> 
                    : <Spinner/>}
                    </div>
                </div>
                :
                <div className="search">
                    <div className="search-inp">
                        <input  
                            value={searchInput}
                            onClick={showFocus}
                            ref={myRef}
                            type="text"
                            name=""
                            onChange={(e) => searchCat(e)}
                            placeholder='Search for breeds by name' />
                        <Link className="search-icon-img" onClick={(e) => changeBtnStatus(e)} to='#'>
                            {/* <img src={searchIcon} alt="searchIcon" /> */}
                        </Link>
                    </div>
                    <div className="search-icons">
                        <div style={{ 'backgroundColor': activeClassLikes ? '#FF868E' : null }}>
                            <Link to='/voting/likes'>
                                <img src={activeClassLikes ? searchImgWhiteSmile : searchImg1} alt="" />
                            </Link>
                        </div>
                        <div style={{ 'backgroundColor': activeClassFavourites ? '#FF868E' : null }}>
                            <Link to='/voting/favourites'>
                                <img src={activeClassFavourites ? searchImgWhiteHeart : searchImg2} alt="" />
                            </Link></div>
                        <div style={{ 'backgroundColor': activeClassDislikes ? '#FF868E' : null }}>
                            <Link to="/voting/dislikes">
                                <img src={activeClassDislikes ? searchImgWhiteSad : searchImg3} alt="" />
                            </Link>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Search;