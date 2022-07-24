import VotingArrow from '../../../../imgs/voting-arrow.svg';
import Spinner from '../../../spinner/Spinner';
import './breedsSinglePage.scss'
import StaticPartOfMainPage from '../../../staticPartOfMainPage/StaticPartOfMainPage';
import Search from '../../../search/Search';
import { useHttp } from '../../../../hooks/http.hooks';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
// контекст
import { InputContext, SearchLengthContext } from '../../../../context/context';

const BreedsSinglePage = () => {
    const { id } = useParams();
    const { request } = useHttp();
    const [infoAboutSelectedCat, setInfoAboutSelectedCat] = useState([]);
    const [allBreedsInfo, setAllBreedsInfo] = useState([]);
    const [breed, setBreed] = useState([]);
    const [slide, setSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // контекст
    const { searchInput } = useContext(SearchLengthContext);
    const { searchBtnClicked } = useContext(InputContext);

    const navigate = useNavigate();
    const goBack = () => navigate(-1);

    useEffect(() => {
        sendRequestForCats()
        sendRequestForCatsBreed()
    }, [])

    useEffect(() => {
        findInfo()
    }, [allBreedsInfo])

    const sendRequestForCats = () => {
        setLoading(false);
        request(`https://api.thecatapi.com/v1/images/search?breed_ids=${id}&limit=20`)
            .then(setBreed)
            .catch(onError)
    }

    const onError = () => {
        setError(true);
    }

    const sendRequestForCatsBreed = () => {
        request(`https://api.thecatapi.com/v1/breeds`, 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
            .then(setAllBreedsInfo)
    }

    const findInfo = () => {
        setInfoAboutSelectedCat(allBreedsInfo.filter(item => item.id == id))
    }

    const changeSlide = (i) => {
        setSlide(i)
    }

    const dots = breed.map((item, i) => {
        return (
            <>
                <li onClick={() => changeSlide(i)} className={slide == i ? 'dot active-dot' : 'dot'}></li>
            </>
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
                            <div className='singleBreed-wrapper'>
                                <div className="voting-wrapper-title breed-wrapper-title singleBreed-wrapper-title">
                                    Breeds
                                </div>
                                <div className='singleBreed-id'>
                                    {infoAboutSelectedCat.length > 0 ? infoAboutSelectedCat[0].id : ''}
                                </div>
                            </div>

                            {error ? <div>Помилка. Щось пішло не так ...</div> :
                                loading ? <Spinner /> :
                                    <>
                                        <div className='breed-slider-wrapper'>
                                            <img src={breed.length > 0 ? breed[slide].url : null} alt="" />
                                            <div className='breed-slider-dots'>
                                                <ul className='breed-slider-dots'>
                                                    {dots}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='breed-info'>
                                            {infoAboutSelectedCat.length > 0 ?
                                                <>
                                                    <div className='breed-info-title'>{infoAboutSelectedCat[0].name}</div>
                                                    <div className='breed-info-subtitle'>{infoAboutSelectedCat[0].description}</div>
                                                    <div className='breed-info-bottom'>
                                                        <div>
                                                            <div>
                                                                <span className='breed-info-bottom-title'>Temperament: </span>
                                                                <br />
                                                                {infoAboutSelectedCat[0].temperament}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div>
                                                                <span className='breed-info-bottom-title'>Origin: </span>
                                                                {infoAboutSelectedCat[0].origin}
                                                            </div>
                                                            <div>
                                                                <span className='breed-info-bottom-title'>Weight: </span>
                                                                {infoAboutSelectedCat[0].weight.metric} kgs
                                                            </div>
                                                            <div>
                                                                <span className='breed-info-bottom-title'>Life span: </span>
                                                                {infoAboutSelectedCat[0].life_span} years
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                                : ''}
                                        </div>
                                    </>
                            }

                        </div>
                    </>
                }
            </div>
        } />
    )
}

export default BreedsSinglePage;