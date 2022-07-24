import './mainPage.scss'
import girlAndPet from '../../../imgs/girl-and-pet.png';
// компоненти
import StaticPartOfMainPage from '../../staticPartOfMainPage/StaticPartOfMainPage';

const MainPage = () => {

    return (
        <StaticPartOfMainPage leftPartOfPage={
        <div className="home-left">
            <img src={girlAndPet} alt="" />
        </div>
        } />
    )
}

export default MainPage;