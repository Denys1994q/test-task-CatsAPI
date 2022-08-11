import logo from '../../imgs/logo.svg';
import homeImage1 from '../../imgs/home-img1.svg';
import homeImage2 from '../../imgs/home-img2.svg';
import homeImage3 from '../../imgs/home-img3.svg';
// хуки
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {Link} from 'react-router-dom';

const StaticPartOfMainPage = (props) => {
    const location = useLocation();
    const [activeClassVoting, setActiveClassVoting] = useState(false);
    const [activeClassBreeds, setActiveClassBreeds] = useState(false);
    const [activeClassGallery, setActiveClassGallery] = useState(false);

    useEffect(() => {
        switch(location.pathname) {
            case '/voting':
                setActiveClassVoting(true)
                break;
            case '/breeds':
                setActiveClassBreeds(true);
                break;
            case '/gallery':
                setActiveClassGallery(true);
                break;
        }
    }, [location])

    return (
        <div className="home">
            <div className="home-wrapper">
                <div>1</div>
                <div className="home-right">
                    <div className="sticky">
                    <Link to='/' className="home-right-logo">
                        <img src={logo} alt="logo" />
                    </Link>
                    <p>Lets start using The Cat API</p>
                    <div className="home-right-inner">
                        <div>
                            <img src={homeImage1} alt="" />
                            <Link to='/voting'>
                                <div style={{'backgroundColor': activeClassVoting ? '#FF868E' : null, 'color': activeClassVoting ? '#FFFFFF' : null}}>Voting</div>
                            </Link>
                        </div>
                        <div>
                            <img src={homeImage2} alt="" />
                            <Link to="/breeds">
                                <div style={{'backgroundColor': activeClassBreeds ? '#FF868E' : null, 'color': activeClassBreeds ? '#FFFFFF' : null}}>Breeds</div>
                            </Link>
                        </div>
                        <div>
                            <img src={homeImage3} alt="" />
                            <Link to="/gallery">
                                <div style={{'backgroundColor': activeClassGallery ? '#FF868E' : null, 'color': activeClassGallery ? '#FFFFFF' : null}}>Gallery</div>
                            </Link>
                        </div>
                    </div>
                    </div>
                </div>
              {props.leftPartOfPage}
            </div>
        </div>
    )
}

export default StaticPartOfMainPage;