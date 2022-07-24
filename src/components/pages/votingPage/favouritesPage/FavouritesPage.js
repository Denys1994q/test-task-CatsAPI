// стилі і картинки
import VotingArrow from '../../../../imgs/voting-arrow.svg';
import Spinner from '../../../spinner/Spinner';
// компоненти
import StaticPartOfMainPage from '../../../staticPartOfMainPage/StaticPartOfMainPage';
import Search from '../../../search/Search';
// хуки
import { useState, useEffect, useContext } from 'react';
import { useHttp } from '../../../../hooks/http.hooks';
import { useNavigate } from 'react-router-dom';
// контекст
import { InputContext } from '../../../../context/context';
import { SearchLengthContext } from '../../../../context/context';

const FavouritesPage = () => {
    const { request } = useHttp();
    const [likedCats, setLikedCats] = useState([]);
    const [deleteCat, setDeleteCat] = useState(false);
    const [arrDeletedCats, setArrDeletedCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [clicked, setClicked] = useState(true);
    // контекст
    const { searchInput, setSearchInput } = useContext(SearchLengthContext);
    const { searchBtnClicked, setSearchBtnClicked } = useContext(InputContext);

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        sendRequestForLikedCats()
        setSearchBtnClicked(false);
        setSearchInput('');
    }, [])

    const sendRequestForLikedCats = () => {
        setClicked(true)
        setLoading(true);
        request('https://api.thecatapi.com/v1/favourites', 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
            .then(onOk)
            .catch(onError)
    }

    const onOk = (data) => {
        setLoading(false);
        setLikedCats(data)
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const deleteFromFavs = (id) => {
        setClicked(false);
        setArrDeletedCats(old => [...old, id])
        setDeleteCat(id)
        if (likedCats.length > 0) {
            request(`https://api.thecatapi.com/v1/favourites/${id}`,
                'DELETE',
                null,
                {
                    'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
                }
            )
            .then(sendRequestForLikedCats)
        }
    }

    const catsImgs = likedCats.map(item => {
        const id = item.id;
        return (
            <div
                key={item.id}
                className="grid-item">
                <img src={item.image.url} alt="" />
                <div className="grid-item-tex">
                    <div onClick={() => deleteFromFavs(id)} className={clicked ? 'grid-item-fav-active' :  "grid-item-fav"}></div>
                </div>
            </div>
        )
    })

    const infoAboutDeletedCats = arrDeletedCats.map(item => {
        const currentDate = new Date();
        const t = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()
        const hours = `${currentDate.getHours()}:${t}`;
        return (
            <div key={item} className='fav-wrapper-info'>
                <div className="info-time">
                    <p>{hours}</p>
                </div>
                <p className="info-text">Image ID: <span>{item}</span> was removed from Favourites</p>
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
                        <div className="voting-wrapper">
                            <a onClick={goBack} className="voting-wrapper-arrow">
                                <div>
                                    <img src={VotingArrow} alt="VotingArrow" />
                                </div>
                            </a>
                            <div className="voting-wrapper-title ">
                                Favourites
                            </div>
                            <div>
                            {loading ? <Spinner /> :
                            <>
                                {likedCats.length == 0 ?
                                    <div className='fav-wrapper-info'>
                                        <p className='fav-wrapper-info-noItems'>No item found</p>
                                    </div>
                                :
                                <div className="grid">
                                    {error ? <div>Помилка. Щось пішло не так ...</div> : catsImgs}
                                </div>}
                            </>
                            }
                            {infoAboutDeletedCats}
                            </div>
                        </div>
                    </>
                }
            </div>
        } />
    )
}

export default FavouritesPage;