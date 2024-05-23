import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import '../MainPage/MainPage.css';
import './MyPage.css';
import '../../MusicAddMenu.css';
import Topbar from '../../topbar/Topbar';
import MypageProfileModal from "./MypageProfileModal";

import { ReactComponent as MusicPlay } from "../../../assets/imgs/Play.svg";
import { ReactComponent as MusicAdd } from "../../../assets/imgs/Add.svg";
import { ReactComponent as MusicLike } from "../../../assets/imgs/Like.svg";
import { ReactComponent as MusicLikeClick } from "../../../assets/imgs/LikeOn.svg";


function MyPage({ createPlaylistOn, setCreatePlaylistOn, PlayMusic, AddMusic }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [buttonStyle, setButtonStyle] = useState({});
    const [buttonText, setButtonText] = useState('Follow');
    const { user, state } = useParams();
    const [userData, setUserData] = useState({
        'email':'', 
        'nickname':'', 
        'sigdate':'', 
        'img_route':''
    });
    const [musicList, setMusicList] = useState([]);
    const [playlistList, setPlaylistList] = useState([]);
    const isExist = true;
    console.log(state)

    const activeStyle = {
        marginRight: '20px',
        textAlign: 'left',
        textDecoration: 'none',
        fontFamily: 'SC Dream 4',
        fontSize: '20px',
        color: 'rgba(250, 250, 250, 1.0)'
    }

    const style = {
        marginRight: '20px',
        textAlign: 'left',
        textDecoration: 'none',
        fontFamily: 'SC Dream 4',
        fontSize: '20px',
        color: 'rgba(204, 204, 204, 1.0)'
    }
    const isLoggedIn = !!localStorage.getItem('token');

    // <Modal>
    const [modalpwIsOpen, setModalpwIsOpen] = useState(false);
    const [shouldShowButton,setShouldShowButton] = useState(false);

    const onClickModalButton = () => {
        setModalpwIsOpen(true);
    };
    // </Modal>
    

    // URL 상의 유저 이름이 바뀔 때 실행
    useEffect(() => {
       
        if(isLoggedIn){
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/userInfo.php", {
                'nickname': user,
            })
            .then(function(response){
                setUserData(response.data.message[0]);
            })
            
            axios.post("https://blue.kku.ac.kr:5050/myprofile.php", {
                'email': email,
            }).then(function(response){
                const nickname = response.data.message.nickname;
                if(nickname === user){
                    console.log("같음");
                    setShouldShowButton(true);
                }
                else{
                    console.log("다름");
                    setShouldShowButton(false);

                }
            })
        if (state === 'recently-played'){
            axios.post("https://blue.kku.ac.kr:5050/mypageRecent.php", {
            'nickname': user,
            'email': email
            })
            .then(function(response) {
                console.log(JSON.stringify(response.data));
                if(response.data.status === "fail"){
                    setMusicList([]);
                } else{
                if(response.data.message != null){
                const sortedData = response.data.message.sort((a, b) => new Date(b.clickdate) - new Date(a.clickdate)); 
                console.log(sortedData);
                if (Array.isArray(response.data.message)) {
                    setMusicList(sortedData);
                }
                else{
                    setMusicList([sortedData]);
                }}
            }
            })
        } else if (state === 'most-played') {
            axios.post("https://blue.kku.ac.kr:5050/mypageRecent.php", {
                'nickname': user,
                'email': email
            })
            .then(function(response) {
                if(response.data.status === "fail"){
                    setMusicList([]);
                } else{
                    if(response.data.message != null){
                    console.log(JSON.stringify(response.data));
                    const sortedData = response.data.message.sort((a, b) => b.clickcount.localeCompare(a.clickcount));
                    if (Array.isArray(response.data.message)) {
                        setMusicList(sortedData);
                    }
                    else{
                        setMusicList([sortedData]);
                    }
                }}
            })
        } else if (state === 'favorite') {
            axios.post("https://blue.kku.ac.kr:5050/userLike.php", {
                'nickname': user,
                'email':email
            })
            .then(function(response) {
                if(response.data.status === "fail"){
                    setMusicList([]);
                }else{
                if (Array.isArray(response.data.message)){
                console.log(response.data.message);
                setMusicList(response.data.message);
                }
            }})
        }

        // 플레이리스트 목록 가져오기
        axios.post("https://blue.kku.ac.kr:5050/playlist.php", {
            'type':'list',
            'nickname': user
        })
        .then(function(response) {
            console.log(response.data)
            if (Array.isArray(response.data.message)) {
                setPlaylistList(response.data.message);
                
            } else {
                setPlaylistList([]);
            }
        })
    }
    }, [user, state,window.location.href]);

    useEffect(() => {
        // 플레이리스트 목록 가져오기 (플레이리스트 생성 후 다시 렌더링)
        axios.post("https://blue.kku.ac.kr:5050/playlist.php", {
            'type':'list',
            'nickname': user
        })
        .then(function(response) {
            console.log(response.data)
            if (Array.isArray(response.data.message)) {
                setPlaylistList(response.data.message);
                
            } else {
                setPlaylistList([]);
            }
        })
    }, [createPlaylistOn])

    useEffect(() => {
        if(isLoggedIn){
        const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
        axios.post("https://blue.kku.ac.kr:5050/frButtonCheck.php", {
            'email': email,
            'nickname': user
        })
        .then(function(response){
            console.log(response.data.message);
            if(response.data.message === "ifFriend"){
                setButtonText('Following');
                setButtonStyle({
                    backgroundColor: '#252D36',
                    color: '#ececec'
                })
            }
            else{
                setButtonText('Follow');
                setButtonStyle({
                    backgroundColor: '#ffffff',
                    color: '#000000'
                });
            }
        });
    }
    },[window.location.href])


    //const mypageParams = new URLmypageParams(location.mypage)
    //const user = mypageParams.get('user');
    //console.log(user)
    const handleMostClick = () => {
        if(musicList[0] != ""){
            axios.post("https://blue.kku.ac.kr:5050/mypageRecent.php", {
                'nickname': user,
            })
            .then(function(response) {
                if(response.data.status === "fail"){
                    setMusicList([]);
                }else{
                if(response.data.message != null){
                console.log(JSON.stringify(response.data));
                const sortedData = response.data.message.sort((a, b) => b.clickcount.localeCompare(a.clickcount));
                if (Array.isArray(response.data.message)) {
                    setMusicList(sortedData);
                }
                else{
                    setMusicList([sortedData]);
                }
            }}
            })
        }
    }
    const handleRecentClick = () => {
        if(musicList[0] != ""){
            axios.post("https://blue.kku.ac.kr:5050/mypageRecent.php", {
            'nickname': user,
            })
            .then(function(response) {
                console.log(JSON.stringify(response.data));
                if(response.data.status === "fail"){
                    setMusicList([]);
                } else{
                if(response.data.message != null){
                const sortedData = response.data.message.sort((a, b) => new Date(b.clickdate) - new Date(a.clickdate)); 
                console.log(sortedData);
                if (Array.isArray(response.data.message)) {
                    setMusicList(sortedData);
                }
                else{
                    setMusicList([sortedData]);
                }}
            }
            })
        }
    }
    const handleLikeClick = (title, index) => {
        if (isLoggedIn) {
            console.log("로그인 성공");
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/likeCheck.php", {
              'title': title,
              'email': email
            })
            .then(function(response) {
              console.log(response.data.status);
              if (response.data.status === "success") {
                axios.post("https://blue.kku.ac.kr:5050/likeDel.php", {
                  'title': title,
                  'email': email
                })
                .then(function(response) {
                  console.log(response.data.message);
                  const updatedMusicList = [...musicList];
                  updatedMusicList[index].mlike = '0';
                  setMusicList(updatedMusicList);
                });
              } else {
                axios.post("https://blue.kku.ac.kr:5050/like.php", {
                  'title': title,
                  'email': email
                })
                .then(function(response) {
                    const updatedMusicList = [...musicList];
                    updatedMusicList[index].mlike = '1'; // 좋아요 상태를 '1'으로 설정
                    setMusicList(updatedMusicList);
                });
              }
            });
            console.log('Like button clicked!');
          } else {
            alert("로그인을 해주세요!");
            // 로그인 안됐을 시 좋아요 x
          }
    };
    const handleFavoriteClick = () => {
        if(musicList[0] != ""){
            axios.post("https://blue.kku.ac.kr:5050/userLike.php", {
                'nickname': user,
            })
            .then(function(response) {
                if(response.data.status === "fail"){
                    setMusicList([]);
                }else{
                if (Array.isArray(response.data.message)){
                console.log(response.data.message);
                setMusicList(response.data.message);
                }
            }})
        }
    }

    const handlePlaylistClick = (playlist) => {
        console.log(playlist)
        navigate("/playlist/" + playlist.no);
    }

    const handleAddClick = (music) => {
        if (isLoggedIn) {
            AddMusic(music);
            console.log("로그인 성공");
        }
        else {
            alert("로그인을 해주세요!")
            // 로그인안됬을시 좋아요 x
        }
    }

    const handleClick = (title) => {             
        navigate("/album", { state: { title: title } });
    };

    const onFollowButton = () => {
        const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
        if (buttonText === 'Follow'){
            setButtonText('Following');
            setButtonStyle({
                backgroundColor: '#252D36',
                color: '#ececec'
            })
            axios.post("https://blue.kku.ac.kr:5050/friend.php", {
                'nickname': user,
                'email':email
            })
            .then(function (response) {
                console.log(JSON.stringify(response));
              });
              window.location.reload();
        }else{
            axios.post("https://blue.kku.ac.kr:5050/friendDel.php", {
                'nickname': user,
                'email':email
            })
            .then(function (response) {
                console.log(JSON.stringify(response));
            });
            
            setButtonText('Follow');
            setButtonStyle({
                backgroundColor: '#ffffff',
                color: '#000000'
            });
            window.location.reload();
        }
    }
    

    return (
        <div>
            
            <div className='main-window'>
                <Topbar />
                
                {
                    /* 유저가 존재하지 않는다면 */
                    isExist !== true
                    ? <h2>{user} 라는 사용자는 존재하지 않습니다.</h2>
                    :  (
                        <div>
                            <div className='mypage-topbar'>
                                <div className='mypage-title-area'>
                                    {modalpwIsOpen && (<MypageProfileModal visible={modalpwIsOpen} onClose={() => {setModalpwIsOpen(false);}} />)}
                                    <img className='mypage-user-img' src={userData && userData.img_route !== "" ?process.env.PUBLIC_URL +  userData.img_route : "/img/EmptyUser.jpg"}/>
                                    <div>
                                        <h2 className='mypage-title-text'>{user}'s Page</h2>
                                        <span className='mypage-user-text'>{user} | Following: {userData.followers}</span>
                                        {isLoggedIn && (
                                            shouldShowButton && (
                                                <button className='mypage-user-button' onClick={onClickModalButton}>MyProfile</button>
                                        ))}
                                        {isLoggedIn && (
                                            !shouldShowButton && (
                                                <button className='mypage-user-button'style={buttonStyle} onClick={onFollowButton}>{buttonText}</button>
                                        )
                                        )}
                                    </div>
                                </div>
                                
                                <div className='mypage-navigate-area'>
                                    <NavLink style={({ isActive }) => (isActive ? activeStyle : style)} to={'/' + user + '/playlists'}>Playlists</NavLink>
                                    <NavLink style={({ isActive }) => (isActive ? activeStyle : style)} to={'/' + user + '/recently-played'}onClick={() => handleRecentClick()}>Recently Played</NavLink>
                                    <NavLink style={({ isActive }) => (isActive ? activeStyle : style)} to={'/' + user + '/most-played'}onClick={() => handleMostClick()}>Most Played</NavLink>
                                    <NavLink style={({ isActive }) => (isActive ? activeStyle : style)} to={'/' + user + '/favorite'} onClick={() => handleFavoriteClick()}>Favorite Music</NavLink>
                                    
                                </div>
                                <hr/>
                            </div>
                            {
                                state === "playlists"
                                ? (
                                    <div className='mypage-music-list'>
                                        
                                        <div className='mypage-container'>
                                            <h3 className='mypage-result-title' style={{marginTop:"0px"}}>Playlists</h3>
                                            {
                                                shouldShowButton
                                                ? <button className='mypage-create-playlist-button' onClick={() => {setCreatePlaylistOn(true)}}>Create Playlist</button>
                                                : <div/>
                                            }   
                                        </div>
                                        <hr className='mypage-list-div-line' style={{marginTop:"-20px"}}/>
                                        {
                                            playlistList.length === 0
                                            ? <h4 className='mypage-none-result-text'>플레이리스트가 존재하지 않습니다.</h4>
                                            : (
                    
                                                <div className='mypage-playlist-list'>
                                                    
                                                    {playlistList.map((playlist, index) => {
                                                        return (
                                                            <div className='mypage-playlist-unit'>
                                                                <img className='mypage-playlist-img' style={{cursor:"pointer"}} onClick={() => handlePlaylistClick(playlist)} alt={playlist} src={process.env.PUBLIC_URL + playlist.img_route !== "" ? playlist.img_route : "/img/albums/EmptyAlbum.jpg"}/>
                                                                <span className='mypage-playlist-list-text'>{playlist.playlist_name}</span><br/>
                                                                <span className='mypage-playlist-list-info-text'>{user} | {playlist.tracks} Tracks</span> 
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                                : (
                                    <div className='mypage-music-list'>
                                        <h3 className='mypage-result-title'>{state === "recently-played" ? "Recently Played" : state === "most-played" ? "Most Played" : "Favorite Music"}</h3>
                                        <hr className='mypage-list-div-line' style={{marginTop:"-20px"}}/>
                                        {
                                            musicList.length === 0
                                            ? <h4 className='mypage-none-result-text'>결과가 존재하지 않습니다.</h4>
                                            : (
                                                <table className='mypage-music-list-table'>
                                                    <thead>
                                                        <tr>
                                                            <th style={{width:"70px", fontWeight:"bold"}}>Music/Artist</th>
                                                            <th style={{width:"40%", fontWeight:"bold"}}></th>
                                                            <th style={{width:"calc(36%-70px)", fontWeight:"bold"}}>Album</th>
                                                            <th style={{width:"8%", textAlign:"center", fontWeight:"bold"}}>Listen</th>
                                                            <th style={{width:"8%", textAlign:"center", fontWeight:"bold"}}>Add</th>
                                                            <th style={{width:"8%", textAlign:"center", fontWeight:"bold"}}>Like</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {musicList.map((music, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <th><img className='mypage-music-list-album-img' onClick={() => handleClick(music.title)} alt={music.album} src={process.env.PUBLIC_URL + music.img_route}/></th>
                                                                    <th>
                                                                        <span className='mypage-music-list-song-text' onClick={() => handleClick(music.title)}>{music.title}</span><br/>
                                                                        <span className='mypage-music-list-artist-text'>{music.artist}</span>
                                                                        </th>
                                                                    <th className='mypage-music-list-album-text'>{music.album}</th>
                                                                    <th><button type='button' className='mypage-music-list-btn' onClick={() => PlayMusic(music)}><MusicPlay/></button></th>
                                                                    <th><button type='button' className='mypage-music-list-btn' onClick={() => handleAddClick(music)}><MusicAdd/></button></th>
                                                                    <th><button type='button' className='mypage-music-list-btn'onClick={() => {handleLikeClick(music.title, index)}}>{parseInt(music.mlike, 10) === 1 ? <MusicLikeClick/> : <MusicLike/>}</button></th>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            )
                                        }
                                    </div>

                                )
                            }

                        </div>
                    )
                }
                <table className='mypage-music-list-table'></table>
            </div>
        </div>
    );

}
export default MyPage;