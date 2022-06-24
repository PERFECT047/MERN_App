import Navbar from '../components/Nav'
import { useState } from 'react';
import { useCookies } from 'react-cookie';

import AuthModal from '../components/AuthModal'

const Home = () => {

    const [showModal, setShowModal] = useState(false);
    const [isSignUp, setIsSignUp] = useState(true);
    const [cookie, setCookie, removeCookie] = useCookies(['user'])

    const authToken = cookie.AuthToken;

    const handleClick = () => {
        // console.log("clicked");

        if(authToken) {
            removeCookie('UserId', cookie.UserId)
            removeCookie('AuthToken', cookie.AuthToken)

            window.location.reload()
            return
        }

        setShowModal(true);
        setIsSignUp(true);

    }

    return (
        <div className='overlay'>

            <Navbar 
            authToken={authToken}
            minimal={false} 
            showModal={showModal} 
            setShowModal={setShowModal}
            setIsSignUp={setIsSignUp}
            />

            <div className="home">
                <h1 className='primary-title'>Swipe Right</h1>
                <button className="primary-button" onClick={handleClick}>
                    { authToken ? "Signout" : "Create Account"}
                </button>

                {showModal && (
                        <AuthModal 
                        setShowModal={setShowModal}
                        setIsSignUp={setIsSignUp}
                        isSignUp={isSignUp}
                        />
                    )
                }

            </div>
        </div>
    )
};

export default Home;