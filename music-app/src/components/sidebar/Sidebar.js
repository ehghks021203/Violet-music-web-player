import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

import FriendModal from '../FriendModal';
import { ReactComponent as Add } from "../../assets/imgs/Add.svg";


function UserGreeting(props) {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [userData, setUserData] = useState({
        'email': '',
        'nickname': '',
        'sigdate': '',
        'img_route': ''
    });
    
    const [friendList, setFriendList] = useState([]);

    // <Modal>
    const [modalfrIsOpen, setModalfrIsOpen] = useState(false);

    const onClickModalButton = () => {
        setModalfrIsOpen(true);
    };
    // </Modal>
    useEffect(() => {
        const storedNickname = localStorage.getItem('nickname');
        const stnickName = storedNickname.replace(/^"(.*)"$/, '$1');
        setNickname(stnickName);
        axios.post("https://blue.kku.ac.kr:5050/userInfo.php", {
            'nickname': stnickName,
        })
        .then(function(response){
            console.log(response.data.message)
            setUserData(response.data.message[0]);
        });
        const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
        axios.post("https://blue.kku.ac.kr:5050/friendList.php", {
            'email': email,
        })
        .then(function(response){
            console.log(response.data.message);
            setFriendList(response.data.message);
        });
        
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('signdata');
        localStorage.removeItem('email');
        localStorage.removeItem('nickname');
        localStorage.removeItem('likedList');

        window.location.reload();
    };

    const navigateToFriendpage = (e) => {
        navigate("/" + e + "/playlists");
    };

    const navigateToMypage = useCallback(() => {
        navigate("/" + nickname + "/playlists");
    }, [navigate, nickname]);

    return (   
        <div>
            <div className='sidebar-login-panel'>
                <div className='sidebar-user-container'>
                    <img className='sidebar-user-profile' src={userData.img_route !== "" ? process.env.PUBLIC_URL + userData.img_route : "/img/EmptyUser.jpg"} alt="User Profile" />
                    <div style={{width:"126px", marginTop:"6px"}}>
                        <span className='sidebar-user-name'>{nickname}</span><br/>
                        <button type='button' className='sidebar-text-button' style={{width:"60px"}} onClick={navigateToMypage}>
                            My Page
                        </button>
                        <span className='sidebar-div-text'>|</span>
                        <button type='button' className='sidebar-text-button' style={{width:"60px"}} onClick={handleLogout}>
                            SIGN OUT
                        </button>
                    </div>
                </div>
            </div>
            <div className='sidebar-menu'>
                <hr className='sidebar-div-line' />
                
                <NavLink className='sidebar-list-title' to={'/' + nickname + '/recently-played'}>
                    Recently Played
                </NavLink>
                <NavLink className='sidebar-list-title' to={'/' + nickname + '/most-played'}>
                    Most Played
                </NavLink>
                <NavLink className='sidebar-list-title' to={'/' + nickname + '/favorite'}>
                    Favorite Music
                </NavLink>
                <NavLink className='sidebar-list-title' to={'/' + nickname + '/playlists'}>
                    My Playlist
                </NavLink>

                {modalfrIsOpen && (<FriendModal visible={modalfrIsOpen} onClose={() => {setModalfrIsOpen(false);}} />)}
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    <h3 className='sidebar-friend'>Friends</h3>
                    <button className='sidebar-friend-add-button' onClick={onClickModalButton}><Add/></button>
                </div>
                <hr className='sidebar-div-line' style={{marginBottom:"4px"}}/>
                {friendList === "" ? (
                <div style={{textAlign : 'center', marginTop: '50px'}}>Add friend</div>
                ): ( 
                friendList.map((friend, index) => (
                    <div className='sidebar-friend-unit' key={index}>
                        <img className='sidebar-friend-profile' src={friend.img_route !== "" ? process.env.PUBLIC_URL +  friend.img_route : "/img/EmptyUser.jpg"} alt="Friend Profile" />
                        <div style={{width:"126px", marginTop:"6px"}}>
                            <span className='sidebar-friend-name'onClick={() => navigateToFriendpage(friend.nickname)}>{friend.nickname}</span><br/>
                            <span className='sidebar-friend-follower'>{friend.followers.toLocaleString('ko-KR')} followers</span>
                        </div>
                    </div>
                ))
                )}
            </div>
        </div>
    );
}

function GuestGreeting(props) {
    const navigate = useNavigate();

    return (
        <div>
            <div className='sidebar-login-panel'>
                <button type='button' className='sidebar-login-button' onClick={() => navigate("/login")}>
                    SIGN IN
                </button>
                <div className='container'>
                    <button type='button' className='sidebar-text-button' onClick={() => navigate("/login")}>
                        Forgot password
                    </button>
                    <span className='sidebar-div-text'>|</span>
                    <button type='button' className='sidebar-text-button' onClick={() => navigate("/register")}>
                        Create account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function Sidebar() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    return (
        <div className='sidebar-container'>
            <div className='sidebar'>
                <div className='sidebar-wrapper'>
                    <button className='sidebar-title-name' onClick={() => navigate("/")}>
                        Violet
                    </button>
                    {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
                </div>
            </div>
        </div>
    );
}
