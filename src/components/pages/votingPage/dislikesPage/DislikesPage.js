import VotingArrow from '../../../../imgs/voting-arrow.svg';
import Spinner from '../../../spinner/Spinner';
// компоненти 
import Search from "../../../search/Search";
import StaticPartOfMainPage from "../../../staticPartOfMainPage/StaticPartOfMainPage";
// хуки 
import { useHttp } from '../../../../hooks/http.hooks';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback, useContext } from 'react';
// контекст
import { InputContext } from '../../../../context/context';
import { SearchLengthContext } from '../../../../context/context';

const DislikesPage = () => {
    const { request } = useHttp();
    const [dislikedCats, setdislikedCats] = useState([]);
    const [dislikedCatsUrls, setdislikedCatsUrls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // контекст
    const { searchInput, setSearchInput } = useContext(SearchLengthContext);
    const { searchBtnClicked, setSearchBtnClicked } = useContext(InputContext);

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        sendRequestFordislikedCats()
        setSearchBtnClicked(false);
        setSearchInput('');
    }, [])

    useEffect(() => {
        sendRequestFordislikedCatsUrls()
    }, [dislikedCats])

    const sendRequestFordislikedCats = () => {
        setLoading(true);
        request('https://api.thecatapi.com/v1/votes?sub_id=test1994', 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
            .then(onOk)
            .catch(onError)
    }

    
    const onOk = (data) => {
        setLoading(false);
        setdislikedCats(data)
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const sendRequestFordislikedCatsUrls = useCallback(() => {
        if (dislikedCats) {
            const catsIds = dislikedCats.filter(item => item.value == 0).map(item => item.image_id)
            catsIds.map(item => {
                request(`https://api.thecatapi.com/v1/images/${item}`,
                    'GET',
                    null,
                    {
                        'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
                    })
                    .then(data => setdislikedCatsUrls(old => [...old, data.url]))
                    .catch(onError)
            })
        }
    }, [dislikedCats])

    const catsImgs = dislikedCatsUrls.map((item, i) => {
        return (
            <div
                key={i}
                className="grid-item">
                <img src={item} alt="" />
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
                            <div className="voting-wrapper-title">
                                Dislikes
                            </div>
                            <div>
                            {loading ? <Spinner /> :
                                    dislikedCats.filter(item => item.value == 0).length == 0 ?
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

export default DislikesPage;