// стилі і картинки
import VotingArrow from '../../../imgs/voting-arrow.svg';
import CloseLogo from '../../../imgs/gallery-btn-close.png';
import './galleryPage.scss';
// компоненти
import StaticPartOfMainPage from '../../staticPartOfMainPage/StaticPartOfMainPage';
import Search from '../../search/Search';
import Spinner from '../../spinner/Spinner';
// хуки
import { useHttp } from '../../../hooks/http.hooks';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
// контекст 
import {InputContext} from '../../../context/context';
import { SearchLengthContext } from '../../../context/context';

const GalleryPage = () => {
    const { request } = useHttp();
    const [breeds, setBreeds] = useState([]);
    const [order, setOrder] = useState('asc');
    const [type, setType] = useState('all');
    const [breed, setBreed] = useState('');
    const [limit, setLimit] = useState(5);
    const formats = ['jpg', 'png'];
    const [stylizedFavCats, setStylizedFavCats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingGalleryImgs, setLoadingGalleryImgs] = useState(true);
    const [catImgs, setCatImgs] = useState([]);
    // modal
    const [showModal, setShowModal] = useState(false); 
    const [imgUrl, setImgUrl] = useState(''); 
    const [file, setfFile] = useState(null); 
    const [fileGot, setfFileGot] = useState(false); 
    const [fileName, setfFileName] = useState(''); 
    const [uploadedCat, setUploadedCat] = useState(false); 
    const [uploadedCatNotFound, setUploadedCatNotFound] = useState(false); 
    // контекст
    const {searchInput, setSearchInput} = useContext(SearchLengthContext);
    const {searchBtnClicked, setSearchBtnClicked} = useContext(InputContext);

    const getBreeds = () => {
        request('https://api.thecatapi.com/v1/breeds')
            .then(setBreeds)
    }

    useEffect(() => {
        getBreeds();
        getCatsfromApi();
        getFavs();
        setSearchBtnClicked(false);
        setSearchInput('');
    }, [])

    const breedContentOptions = breeds.map(item => {
        return (
            <option key={item.id} value={item.id}>{item.name}</option>
        )
    })

    const getSelectedOrder = (e) => {
        setOrder(e.target.value)
    }
    const getSelectedType = (e) => {
        setType(e.target.value)
    }
    const getSelectedBreed = (e) => {
        setBreed(e.target.value)
    }
    const getSelectedLimit = (e) => {
        setLimit(e.target.value)
    }

    const getCatsfromApi = () => {
        setLoadingGalleryImgs(false);
        if (breed === '' || breed === 'none') {
            request(`https://api.thecatapi.com/v1/images/search?limit=${limit}&order=${order}&mime_types=${type}`, 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
                .then(setCatImgs)
        }
        else {
            request(`https://api.thecatapi.com/v1/images/search?breed_id=${breed}&limit=${limit}&order=${order}&mime_types=${type}`, 'GET', null, { 'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60' })
                .then(setCatImgs)
        }
    }

    const getFavs = () => {
        request('https://api.thecatapi.com/v1/favourites', 'GET', null, {
            'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
        })
            .then(data => setStylizedFavCats([...data]))
    }

    const addToFavourites = (item) => {
        // якщо клікнули на картинку, якої немає в списку улюблених - додаємо її до списку улюблених
        if (!stylizedFavCats.filter(it => it.image_id === item.id).length > 0) {
            const body = {
                image_id: item.id,
            }
            request('https://api.thecatapi.com/v1/favourites ',
                'POST',
                JSON.stringify(body),
                {
                    'Content-Type': 'application/json',
                    'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
                }
            ).then(getFavs)
        }
        // якщо клікнули на картинку, яка є списку улюблених - видаляємо 
        else {
            const deleted = stylizedFavCats.filter(it => it.image_id === item.id)
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

    const cats = catImgs.map((item, i) => {
        const id = item.id;
        return (
            <div key={item.id} className="grid-item">
                <img className="grid-item-img" src={item.url} alt="" />
                <div
                    className={stylizedFavCats.filter(it => it.image_id === id).length > 0 ? 'grid-item-tex-fav' : 'grid-item-tex'} >
                    <div
                        onClick={() => addToFavourites(item)}
                        className={stylizedFavCats.filter(it => it.image_id === id).length > 0 ? "grid-item-fav-active" : "grid-item-fav"}>
                    </div>
                </div>
            </div>
        )
    })

    // МОДАЛКА 
    const uploadFile = () => {
        setShowModal(true);
    }

    const closeModal = (e) => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('modal-wrapper-close') || e.target.classList.contains('modal-wrapper-close-img')) {
            
            setShowModal(false);
            setfFileGot(false); // !!!
            setUploadedCat(false);
            setfFile(null)
            setImgUrl('')
            setfFileName('')
            setUploadedCatNotFound(false)
            setLoading(false)
        }
    }

    const showInputFile = (e) => {
        setImgUrl(URL.createObjectURL(e.target.files[0]))
        if (e.target.files[0]) {
            setfFile(e.target.files[0])
            setfFileGot(true);
            setfFileName(e.target.files[0].name);
        }
    }

    const downloadPhoto = () => {
        setLoading(true)
        let formdata = new FormData();
        formdata.append("file", file);

        request('https://api.thecatapi.com/v1/images/upload',
        'POST',
        formdata,
        {
            'x-api-key': '3c71318c-32fa-4b4a-a5bf-f888e6bf7e60'
        }
        )
        .then(onOk)
        .catch(onError)
    }

    const onOk= () => {
        setUploadedCat(true)
    }

    const onError = () => {
        setUploadedCatNotFound(true)
    }

    return (
        <StaticPartOfMainPage leftPartOfPage={
            <>
            <div className='voting'>
            {searchBtnClicked && searchInput.length > 0 ? 
                <Search />
            : 
            <>
                <Search />
                <div className="voting-wrapper">
                    <Link to="/" className="voting-wrapper-arrow">
                        <div>
                            <img src={VotingArrow} alt="VotingArrow" />
                        </div>
                    </Link>
                    <div className='singleBreed-wrapper'>
                        <div className="voting-wrapper-title">
                            Gallery
                        </div>
                        <div>
                            <button 
                                onClick={() => uploadFile()} 
                                className='gallery-btn'>
                                UPLOAD
                            </button>
                        </div>
                    </div>

                    <div className='gallery-inputs-panel'>
                        <div className='gallery-inputs-panel-order'>
                            <div className='gallery-inputs-panel-title'>Order</div>
                            <select
                                className='gallery-inputs-panel-item'
                                name=""
                                id=""
                                value={order}
                                onChange={(e) => getSelectedOrder(e)} >
                                <option value="random">Random</option>
                                <option value="desc">Desc</option>
                                <option value="asc">Asc</option>
                            </select>
                        </div>
                        <div className='gallery-inputs-panel-type'>
                            <div className='gallery-inputs-panel-title'>Type</div>
                            <select
                                className='gallery-inputs-panel-item'
                                name=""
                                id=""
                                value={type}
                                onChange={(e) => getSelectedType(e)} >
                                <option value="all">All</option>
                                <option value={formats}>Static</option>
                                <option value="gif">Animated</option>
                            </select>
                        </div>
                        <div className='gallery-inputs-panel-breed'>
                            <div className='gallery-inputs-panel-title'>Breed</div>
                            <select
                                className='gallery-inputs-panel-item'
                                name=""
                                id=""
                                value={breed}
                                onChange={(e) => getSelectedBreed(e)} >
                                <option value="none">None</option>
                                {breedContentOptions}
                            </select>
                        </div>
                        <div className='gallery-inputs-panel-limit'>
                            <div className='gallery-inputs-panel-title'>Limit</div>
                            <select
                                className='gallery-inputs-panel-item gallery-inputs-panel-item-limit'
                                name=""
                                id=""
                                value={limit}
                                onChange={(e) => getSelectedLimit(e)} >
                                <option value="5">5 items per page</option>
                                <option value="10">10 items per page</option>
                                <option value="15">15 items per page</option>
                                <option value="20">20 items per page</option>
                            </select>
                        </div>
                        <a href='#' onClick={() => getCatsfromApi()} className='gallery-inputs-panel-btn'></a>
                    </div>
                    {loadingGalleryImgs ? <Spinner/> : 
                     <div className="grid">
                        {cats}
                     </div>
                     }
                </div>
            </>
            }
            </div>

            <div className="modal" onClick={(e) => closeModal(e)} style={{'display': showModal ? 'block' : 'none'}}>
                <div className="modal-wrapper">
                    <div className="modal-wrapper-close">
                        <img className="modal-wrapper-close-img" src={CloseLogo} alt="" />
                    </div>        
                    <div className="modal-wrapper-title">Upload a .jpg or .png Cat Image</div>
                    <div className="modal-wrapper-subtitle">Any uploads must comply with the <a className="modal-wrapper-subtitle-link" target="_blank" href="https://thecatapi.com/privacy">upload guidelines</a> or face deletion.</div>
                    
                    {fileGot ? 
                    <>
                        <div className={uploadedCatNotFound ? "modal-wrapper-file-error" : "modal-wrapper-file"}>
                            {uploadedCat ? '' : 
                                <div className={uploadedCatNotFound ? "modal-wrapper-file-success-error" : "modal-wrapper-file-success"}>
                                    <img src={imgUrl} alt="" />
                                </div> }
                        </div>
                        {uploadedCat ? 
                            <div className="modal-wrapper-file-info">No file selected</div> 
                            : 
                            <div className="modal-wrapper-file-info">Image File Name: {fileName}</div>
                        }
                        {uploadedCat || uploadedCatNotFound ? 
                            <div className={uploadedCat ? "modal-wrapper-file-found" : "modal-wrapper-file-found-error"}>
                                {uploadedCatNotFound ? 'No Cat found - try a different one' : 'Thanks for the Upload - Cat found!'}
                            </div> 
                            : 
                            <>
                            {loading ? 
                                <Spinner/> 
                            : 
                                <button style={{'display': uploadedCatNotFound ? 'none' : '' }} onClick={() => downloadPhoto()} className="modal-wrapper-file-btn">upload photo
                                </button>
                            }
                            </>
                        }
                    </>
                        : 
                    <>
                    <div className="modal-wrapper-file">
                        <input className="modal-wrapper-file" type="file" onChange={(e) => showInputFile(e)} />
                        <div className="modal-wrapper-file-text"><strong>Drag here</strong> your file or <strong>Click here</strong> to upload</div>
                    </div>
                    <div className="modal-wrapper-file-info">No file selected</div>
                    </>
                    }
              
                </div>
            </div>
        </>
        } />
    )
}


export default GalleryPage;