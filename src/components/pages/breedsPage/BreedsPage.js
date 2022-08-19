// стилі і картинки
import './breedsPage.scss';
import VotingArrow from '../../../imgs/voting-arrow.svg';
import breedsZtoA from '../../../imgs/breeds-ZtoA.png';
import breedsAtoZ from '../../../imgs/breeds-AtoZ.png';
import Spinner from '../../spinner/Spinner';
// компоненти 
import StaticPartOfMainPage from '../../staticPartOfMainPage/StaticPartOfMainPage';
import Search from '../../search/Search';
// хуки
import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHttp } from '../../../hooks/http.hooks';
import { InputContext } from '../../../context/context';
import { SearchLengthContext } from '../../../context/context';

const BreedsPage = () => {
    const { request } = useHttp();
    const [breeds, setBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('all breeds');
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(0);
    const [breedsImgs, setBreedsImgs] = useState([]);
    const [sortedBreedsImgs, setSortedBreedsImgs] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { searchInput, setSearchInput } = useContext(SearchLengthContext);
    const { searchBtnClicked, setSearchBtnClicked } = useContext(InputContext);

    const getBreeds = () => {
        request('https://api.thecatapi.com/v1/breeds')
            .then(setBreeds)
    }
    const breedContentOptions = breeds.map(item => {
        return (
            <option key={item.id} value={item.name}>{item.name}</option>
        )
    })

    useEffect(() => {
        setLoading(true);
        setSearchBtnClicked(false);
        setSearchInput('');
        getBreeds();
    }, [])

    const getSelectedBreed = (e) => {
        setSelectedBreed(e.target.value);
        setPage(0)
    }
    const getLimit = (e) => {
        setLimit(e.target.value);
        setPage(0)
    }

    const sendRequestForCats = () => {
        setSorted(false)
        if (selectedBreed === 'all breeds') {
            setLoading(false);
            request(`https://api.thecatapi.com/v1/breeds?limit=${limit}&page=${page}`)
                .then(setBreedsImgs)
                .catch(onError)
        }
        else {
            const selectedBreedId = breeds.filter(item => item.name === selectedBreed);
            setLoading(false);
            request(`https://api.thecatapi.com/v1/images/search?breed_ids=${selectedBreedId[0].id}&limit=${limit}&page=${page}&order=Desc`, 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
                .then(setBreedsImgs)
                .catch(onError)
        }
    }

    const onError = () => {
        setError(true);
    }

    const showImgs = selectedBreed !== 'all breeds' ? breedsImgs.map(item => {
        return (
            <div key={item.id} className="grid-item">
                <img className="grid-item-img" src={item.url} alt="" />
            </div>
        )
    }) :
        breedsImgs.map(item => {
            return (
                <div key={item.id} className="grid-item">
                    <img className="grid-item-img" src={item.image ? item.image.url : ''} alt="" />
                    <Link to={`/breeds/${item.id}`} className="grid-item-tex">
                        <p className="grid-item-text">{item.name} </p>
                    </Link>
                </div>
            )
        })

    const sortedImgs = selectedBreed !== 'all breeds' ? sortedBreedsImgs.map(item => {
        return (
            <div key={item.id} className="grid-item">
                <img className="grid-item-img" src={item.url} alt="" />
                <div className="grid-item-tex"></div>
            </div>
        )
    }) :
        sortedBreedsImgs.map(item => {
            return (
                <div key={item.id} className="grid-item">
                    <img className="grid-item-img" src={item.image ? item.image.url : ''} alt="" />
                    <div className="grid-item-tex">
                        <p className="grid-item-text">{item.name} </p>
                    </div>
                </div>
            )
        })

    useEffect(() => {
        sendRequestForCats()
    }, [])
    useEffect(() => {
        sendRequestForCats()
    }, [page, limit, selectedBreed])

    const sortImagesZtoA = (e) => {
        e.preventDefault();
        const copyArr = [...breedsImgs];
        const sorted = copyArr.sort(item => item.name).reverse();
        setSorted(true)
        setSortedBreedsImgs([...sorted])
    }
    const sortImagesAtoZ = (e) => {
        e.preventDefault();
        const copyArr = [...breedsImgs];
        const sorted = copyArr.sort(item => item.name);
        setSorted(true)
        setSortedBreedsImgs([...sorted])
    }

    const showNextPage = () => {
        setPage(item => item + 1)
    }
    const showPrevPage = () => {
        setPage(item => item - 1)
    }

    return (
        <StaticPartOfMainPage leftPartOfPage={
            <div className='voting'>
                {searchBtnClicked && searchInput.length > 0 ?
                    <Search />
                    :
                    <>
                        <Search />
                        <div className="voting-wrapper breed-wrapper">
                            <Link to="/" className="voting-wrapper-arrow">
                                <div>
                                    <img src={VotingArrow} alt="VotingArrow" />
                                </div>
                            </Link>
                            <div className="voting-wrapper-title">
                                Breeds
                            </div>
                            <select
                                value={selectedBreed}
                                className='breeds-select'
                                name=""
                                id=""
                                onChange={(e) => getSelectedBreed(e)} >
                                <option key={'all breeds'} value="all breeds">All breeds</option>
                                {breedContentOptions}
                            </select>
                            <select
                                value={limit}
                                className='breeds-select breeds-select-limit'
                                name=""
                                id=""
                                onChange={(e) => getLimit(e)} >
                                <option key={'limit-5'} value="5" >Limit:5</option>
                                <option key={'limit-10'} value="10">Limit:10</option>
                                <option key={'limit-15'} value="15">Limit:15</option>
                                <option key={'limit-20'} value="20">Limit:20</option>
                            </select>
                            <div className='breeds-sort'>
                                <a href="#" onClick={(e) => sortImagesZtoA(e)}  className='breeds-sort-first'>
                                    <img src={breedsZtoA} alt="sort-Z-to-A" />
                                </a>
                                <a href="#" onClick={(e) => sortImagesAtoZ(e)}>
                                    <img src={breedsAtoZ} alt="sort-A-to-Z" />
                                </a>
                            </div>
                            
                            {loading ? <Spinner /> :
                                <div className="grid">
                                    {error ? <div>Помилка. Щось пішло не так ...</div> : 
                                        sorted ? sortedImgs : showImgs
                                    }
                                </div>
                            }
                        </div>
                        <div className="breeds-btn-wrapper">
                            <button
                                onClick={showPrevPage}
                                className="breeds-btn breeds-btn-prev"
                                disabled={page === 0 ? true : false} >
                                Prev
                            </button>
                            <button
                                onClick={showNextPage}
                                className="breeds-btn breeds-btn-next"
                                disabled={breedsImgs.length < limit ? true : false} >
                                Next
                            </button>
                        </div>
                    </>}
            </div>
        } />
    )
};

export default BreedsPage;