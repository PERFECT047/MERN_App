import whiteLogo from '../images/white_logo.png'
import colorLogo from '../images/color_logo.png'

const Navbar = ({minimal, authToken}) => {

    return (
        <nav>
            <div className="logo-container">
                <img className="logo" src={minimal ? colorLogo : whiteLogo}/>
            </div>

            {!authToken && !minimal && <button 
                className='nav-button'>Log In</button>
            }
        </nav>
    )
};

export default Navbar;