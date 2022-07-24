// стилі і картинки
import './votingPage.scss';
import votingInfoFavourite from '../../../imgs/voting-info-favourite.svg';
import votingInfoSmile from '../../../imgs/voting-info-smile.svg';
import votingInfoSad from '../../../imgs/voting-info-sad.svg';
import Spinner from '../../spinner/Spinner';
// компоненти
import StaticPartOfMainPage from '../../staticPartOfMainPage/StaticPartOfMainPage';
import Search from '../../search/Search';
// хуки
import { useState, useEffect, useContext } from 'react';
import { useHttp } from '../../../hooks/http.hooks';
import { Link } from 'react-router-dom';
// контекст
import { InputContext } from '../../../context/context';
import { SearchLengthContext } from '../../../context/context';

const VotingPage = () => {
    const { request } = useHttp();
    const [cat, setCat] = useState({});
    const [catUrl, setCatUrl] = useState('');
    const [selectedCat, setSelectedCat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [favCat, setFavCat] = useState(false);
    const [favCats, setFavCats] = useState([]);
    const [catDeleted, setCatDeleted] = useState(false);
    // контекст
    const { searchInput, setSearchInput } = useContext(SearchLengthContext);
    const { searchBtnClicked, setSearchBtnClicked } = useContext(InputContext);

    useEffect(() => {
        getCat();
        setSearchBtnClicked(false);
        setSearchInput('');
        getFavs();
    }, [])

    const getCat = () => {
        setLoading(false);
        request('https://api.thecatapi.com/v1/images/search')
            .then(onCatLoaded)
            .catch(onError)
    }

    const onError = () => {
        setError(true);
    }

    const onCatLoaded = (data) => {
        setCat(data);
        const caturl = data[0].url;
        setCatUrl(caturl);
    }

    const addToLikes = (e) => {
        e.preventDefault();
        getCat();

        setSelectedCat(old => [...old, {
            image_id: cat[0].id,
            status: 'liked'
        }])

        const body = {
            image_id: cat[0].id,
            value: 1,
            sub_id: 'test1994'
        }
        request('https://api.thecatapi.com/v1/votes',
            'POST',
            JSON.stringify(body),
            {
                'Content-Type': 'application/json',
                'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
            })
    }

    const addToDislikes = (e) => {
        e.preventDefault();
        getCat();

        setSelectedCat(old => [...old, {
            image_id: cat[0].id,
            status: 'disliked'
        }])

        const body = {
            image_id: cat[0].id,
            value: 0,
            sub_id: 'test1994'
        }
        request('https://api.thecatapi.com/v1/votes',
            'POST',
            JSON.stringify(body),
            {
                'Content-Type': 'application/json',
                'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
            })
    }

    const getFavs = () => {
        request('https://api.thecatapi.com/v1/favourites', 'GET', null, {
            'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
        })
            .then(data => setFavCats([...data]))
    }

    const addToFavourites = (e) => {
        e.preventDefault();

        if (!favCats.filter(item => item.image_id == cat[0].id).length > 0) {    
            setFavCat(true);
            setSelectedCat(old => [...old, {
                image_id: cat[0].id,
                status: 'favourite'
            }]
            )
    
            const body = {
                image_id: cat[0].id,
            }
            request('https://api.thecatapi.com/v1/favourites ',
                'POST',
                JSON.stringify(body),
                {
                    'Content-Type': 'application/json',
                    'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
            })
            .then(getFavs)
        }
        else {
            setFavCat(false);
            setSelectedCat(old => [...old, {
                image_id: cat[0].id,
                status: 'removeFromFavourite'
            }])

            setCatDeleted(true);
            const deleted = favCats.filter(it => it.image_id == selectedCat[0].image_id);
            request(`https://api.thecatapi.com/v1/favourites/${deleted[0].id}`,
                'DELETE',
                null,
                {
                    'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
                }
            )
            .then(getFavs)
        }
    }

    const showImg = (data) => {
        switch (data) {
            case 'favourite': {
                return votingInfoFavourite;
            }
            case 'liked': {
                return votingInfoSmile;
            }
            case 'disliked': {
                return votingInfoSad;
            }
        }
    }

    const contentForShowingInfo = selectedCat.map((item, i) => {
        const currentDate = new Date();
        const t = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()
        const hours = `${currentDate.getHours()}:${t}`;
        return (
            <div key={i} className='voting-wrapper-info'>
                <div className="info-time">
                    <p>{hours}</p>
                </div>
                {item.status == 'removeFromFavourite' ? 
                    <p className="info-text">Image ID: <span>{item.image_id}</span> was removed from favourite </p>
                : 
                    <p className="info-text">Image ID: <span>{item.image_id}</span> was added to {item.status} </p>
                }
                <div className="info-icon"><img src={showImg(item.status)} alt="" /></div>
     
                
            </div>
        )
    })

    return (
        <StaticPartOfMainPage leftPartOfPage={
            <div className='voting'>
                {searchBtnClicked && searchInput.length > 0 ?
                    <Search />
                    :
                    <>
                        <Search />
                        <div className="voting-wrapper voting-wrapper-bg">
                            {loading ? <Spinner/> : 
                            <>
                            <Link to="/" className="voting-wrapper-arrow"></Link>
                            <div className="voting-wrapper-title">
                                Voting
                            </div>
                            <div className="voting-wrapper-img">
                                {error ? <div>Помилка. Щось пішло не так ...</div> : <img src={catUrl} alt="" />}
                            </div>
                            <div className="voting-wrapper-icons">
                                <a href='#' onClick={(e) => addToLikes(e)}>
                                    <div className="icon-like"></div>
                                </a>
                                <a href="#" onClick={(e) => addToFavourites(e)}>
                                    <div className={favCat ? "icon-favourites-active" : "icon-favourites"} ></div>
                                </a>
                                <a href="#" onClick={(e) => addToDislikes(e)}>
                                    <div className="icon-dislikes"></div>
                                </a>
                            </div>
                            {contentForShowingInfo}
                            </>
                            }
             
                        </div>

                    </>
                }
            </div>

        } />
    )
}

export default VotingPage;