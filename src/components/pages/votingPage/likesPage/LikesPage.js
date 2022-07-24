import './likesPage.scss';
import VotingArrow from '../../../../imgs/voting-arrow.svg';
import Spinner from '../../../spinner/Spinner';
// компоненти 
import Search from "../../../search/Search";
import StaticPartOfMainPage from "../../../staticPartOfMainPage/StaticPartOfMainPage";
// хуки
import { useHttp } from '../../../../hooks/http.hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
// контекст
import { InputContext } from '../../../../context/context';
import { SearchLengthContext } from '../../../../context/context';

const LikesPage = () => {
    const { request } = useHttp();
    const [likedCats, setLikedCats] = useState([]);
    const [likedCatsUrls, setLikedCatsUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { searchInput, setSearchInput } = useContext(SearchLengthContext);
    const { searchBtnClicked, setSearchBtnClicked } = useContext(InputContext);
    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        sendRequestForLikedCats()
        setSearchBtnClicked(false);
        setSearchInput('');
        // deleteAll()
    }, [])

    useEffect(() => {
        sendRequestForLikedCatsUrls()
    }, [likedCats])

    const sendRequestForLikedCats = () => {
        setLoading(true);
        request(`https://api.thecatapi.com/v1/votes?sub_id=test1994`, 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
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

    const sendRequestForLikedCatsUrls = () => {
        if (likedCats) {
            const catsIds = likedCats.filter(item => item.value == 1).map(item => item.image_id)
            catsIds.map(item => {
                request(`https://api.thecatapi.com/v1/images/${item}`,
                    'GET',
                    null,
                    {
                        'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
                    })
                    .then(data => setLikedCatsUrls(old => [...old, data.url]))
                    .catch(onError)
            })
        }
    }

    const catsImgs = likedCatsUrls.map((item, i) => {
        return (
            <div
                key={i}
                className="grid-item">
                <img src={item} alt="" />
            </div>
        )
    })

    const deleteAll = () => {
        likedCats.map(item => {
            request(`https://api.thecatapi.com/v1/votes/${item.id}`, 'DELETE', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
            .then(d => console.log(d))
        })
    }

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
                            <div className="voting-wrapper-title">
                                Likes
                            </div>
                            <div>
                                {loading ? <Spinner /> :
                                    likedCats.filter(item => item.value == 1).length == 0 ?
                                        <div className='fav-wrapper-info'>
                                            <p className='fav-wrapper-info-noItems'>No item found</p>
                                        </div>
                                    :
                                    <div className="grid">
                                        {error ? <div>Помилка. Щось пішло не так ...</div> : catsImgs}
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        } />
    )
}

export default LikesPage;