import TinderCard from "react-tinder-card";
import { useEffect, useState } from "react";
import axios from 'axios'
import { useCookies } from 'react-cookie'

import ChatContainer from '../components/ChatContainer'


const Dashboard = () => {

  const [user, setUser] = useState(null)
  const [cookie, setCookie, removeCookie] = useCookies(['user'])
  const [genderedUsers, setGenderedUsers] = useState(null)

  const userId = cookie.UserId

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {
        params: { userId }
      })
      setUser(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/gendered-users', {
        params: { gender : user.gender_interest}
      })
      setGenderedUsers(response.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
  if(user) {
    getGenderedUsers()
  }
 }, [user] )

  // console.log('user',user)


const updateMatches = async (matchedUserId) => {
  try {
    const response = await axios.put('http://localhost:8000/addmatch', {
      userId,
      matchedUserId
    })
    getUser()

  } catch (err) {
    console.log(err)
  }
}


  const [lastDirection, setLastDirection] = useState()
  
  const swiped = (direction, swipedUserId) => {
    if (direction === 'right') {
      updateMatches(swipedUserId)
    }
      setLastDirection(direction)
  }
  
  const outOfFrame = (name) => {
      // console.log(name + ' left the screen!')
  }

  const matchedUserId = user?.matches.map(({user_id}) => user_id).concat(userId)

  const filteredGenderedUsers = genderedUsers?.filter(
    genderedUsers => !matchedUserId.includes(genderedUsers.user_id)
  )

    return (
      <>
        {  user &&
          <div className="dashboard">
              <ChatContainer user={user}/>

              <div className="swipe-container">
                  <div className="card-container">

                      {filteredGenderedUsers?.map((genderedUser) =>
                      <TinderCard 
                      className='swipe' 
                      key={genderedUser.user_id} 
                      onSwipe={(dir) => swiped(dir, genderedUser.user_id)} 
                      onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}>
                          <div style={{ backgroundImage: 'url(' + genderedUser.url + ')' }} className='card'>
                          <h3>{genderedUser.first_name}</h3>
                          </div>
                      </TinderCard>
                      )}

                      <div className="swipe-info">
                          {lastDirection ? <p>You Swiped {lastDirection}</p> : <p/>}
                      </div>

                  </div>
              </div>
          </div>
        }
        </>
    )
};

export default Dashboard;