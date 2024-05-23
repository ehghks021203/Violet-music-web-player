import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import Topbar from '../../topbar/Topbar';

import { ReactComponent as MusicPlay } from "../../../assets/imgs/Play.svg";
import { ReactComponent as MusicAdd } from "../../../assets/imgs/Add.svg";
import { ReactComponent as MusicLike } from "../../../assets/imgs/Like.svg";
import { ReactComponent as MusicLikeClick } from "../../../assets/imgs/LikeOn.svg";
import MainBanner from './MainBanner';

function MainPage({ PlayMusic, AddMusic }) {
    const navigate = useNavigate();
    const [musicList, setMusicList] = useState([]);
    const [albumList, setAlbumList] = useState([]);
    
    // 로컬 스토리지에 저장되어있는 토큰을 불러와 로그인 상태인지 체크
    const isLoggedIn = !!localStorage.getItem('token');
    useEffect(() => {
        const token = localStorage.getItem('token');
        // 비로그인 상태일 때 음악 리스트 불러오기
        if (!isLoggedIn) {
            axios.post("https://blue.kku.ac.kr:5050/music-list.php", {})
            .then(function(response) {
                if (Array.isArray(response.data.message)) {
                    const sortedMusicList = response.data.message.sort((a, b) =>
                         b.reldate.localeCompare(a.reldate)
                    );
                    if (response.data.message.length >= 12) {
                        setMusicList(sortedMusicList.slice(0,12));
                    }
                }
                else {
                    setMusicList([response.data.message])
                }        
            })
        }
        // 로그인 상태일 때 음악 리스트 불러오기
        else {
            // 로컬 스토리지에 저장되어있는 이메일 정보 불러오기
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/music-list-login.php", {
                'email': email,
            })
            .then(function(response) {
                if (Array.isArray(response.data.message)) {
                    const sortedMusicList = response.data.message.sort((a, b) =>
                        b.reldate.localeCompare(a.reldate)
                    );
                    if (response.data.message.length >= 12) {
                        setMusicList(sortedMusicList.slice(0,12));
                    }
                }
                else {
                    setMusicList([response.data.message])
                }        
            })
        }

        // 앨범 리스트 불러오기
        axios.post("https://blue.kku.ac.kr:5050/album-list.php", {})
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            if (Array.isArray(response.data.message)) {
                if (response.data.message.length >= 6) {
                    setAlbumList(response.data.message.slice(0,6));
                }
            }
            else {
                setAlbumList([response.data.message])
            }        
        })
    }, []);

    
    const newClick = () => {
        if (!isLoggedIn) {
            axios.post("https://blue.kku.ac.kr:5050/music-list.php", {})
            .then(function(response) {
                console.log(JSON.stringify(response.data));
                if (Array.isArray(response.data.message)) {
                    console.log(response.data.message.length);
                    const sortedMusicList = response.data.message.sort((a, b) =>
                        b.reldate.localeCompare(a.reldate)
                    );
                    if (response.data.message.length >= 12) {
                        setMusicList(sortedMusicList.slice(0,12));
                    }
                }
                else {
                    setMusicList([response.data.message]);
                }        
            })
        }
        else{
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/music-list-login.php", {
                'email': email,
            })
            .then(function(response) {
                if (Array.isArray(response.data.message)) {
                    const sortedMusicList = response.data.message.sort((a, b) =>
                        b.reldate.localeCompare(a.reldate)
                    );
                    if (response.data.message.length >= 12) {
                        setMusicList(sortedMusicList.slice(0,12));
                    }
                }
                else {
                    setMusicList([response.data.message])
                }        
            })
        }
    };

    const popularClick = () => {
        if (!isLoggedIn) {
            axios.post("https://blue.kku.ac.kr:5050/musicListPopular.php", {})
            .then(function(response) {
                console.log(JSON.stringify(response.data));
                if (Array.isArray(response.data.message)) {
                    const sortedSongs = response.data.message.sort((a, b) => b.streamingcount - a.streamingcount);
                    if (response.data.message.length >= 12) {
                        setMusicList(sortedSongs.slice(0,12));
                    }
                }
                else {
                    setMusicList([response.data.message]);
                }     
            })
        }
        else{
            const aemail = localStorage.getItem('email');
            const email = aemail.replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/music-list-login.php", {
                'email': email,
            })
            .then(function(response) {
                if (Array.isArray(response.data.message)) {
                    console.log(response.data.message.length);
                    const sortedSongs = response.data.message.sort((a, b) => b.streamingcount - a.streamingcount);
                    if (response.data.message.length >= 12) {
                        setMusicList(sortedSongs.slice(0,12));
                    }
                }
                else {
                    setMusicList([response.data.message])
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
    
    const handleAddClick = (music) => {
        if (isLoggedIn) {
            AddMusic(music);
            console.log("로그인 성공");
        }
        else {
            alert("로그인을 해주세요!")
            // 로그인안됐을시 좋아요 x
        }
    }

    const handleClick = (title) => {             
        navigate("/album", { state: { title: title } });
    };

    
    return (
        <>
            <div className='main-window'>
                <Topbar />
                <MainBanner/>
                <div className='container'>
                    <div className='music-list'>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <h3 className='music-list-title'>Music List</h3>
                            <div style={{width:"50%", paddingTop:"30px"}}>
                                <button className='music-list-text-btn' onClick={() => navigate("/music-list", { state: { genre: "all" } })} >More</button>
                                <button className='music-list-text-btn' onClick={() => popularClick()}>Popular</button>
                                <button className='music-list-text-btn' onClick={() => newClick()}>New</button>
                            </div>
                        </div>
                        <hr className='list-div-line' style={{marginTop:"-20px"}}/>
                        <table className='music-list-table'>
                            <thead>
                                <tr>
                                    <th style={{width:"60px", fontWeight:"bold"}}></th>
                                    <th style={{width:"70px", fontWeight:"bold"}}>Music/Artist</th>
                                    <th style={{width:"32%", fontWeight:"bold"}}></th>
                                    <th style={{width:"calc(44%-130px)", fontWeight:"bold"}}>Album</th>
                                    <th style={{width:"8%", textAlign:"center", fontWeight:"bold"}}>Listen</th>
                                    <th style={{width:"8%", textAlign:"center", fontWeight:"bold"}}>Add</th>
                                    <th style={{width:"8%", textAlign:"center", fontWeight:"bold"}}>Like</th>
                                </tr>
                            </thead>
                            <tbody>
                                {musicList.map((music, index) => {
                                    const imagePath = `${process.env.PUBLIC_URL + music.img_route}`;
                                    return (
                                        <tr key={index}>
                                            <th className='music-list-number-text' style={{color:"#b9b9b9"}}>{index + 1}</th>
                                            <th><img className='music-list-album-img' onClick={() => handleClick(music.title)} alt={music.album} src={imagePath}/></th>
                                            <th>
                                                <button type='button' className='music-list-song-text' onClick={() => handleClick(music.title)}>{music.title}</button><br/>
                                                <span className='music-list-artist-text'>{music.artist}</span>
                                            </th>
                                            <th className='music-list-album-text'>{music.album}</th>
                                            <th><button type='button' className='music-list-btn' onClick={() => PlayMusic(music)}><MusicPlay/></button></th>
                                            <th><button type='button' className='music-list-btn' onClick={() => handleAddClick(music)}><MusicAdd/></button></th>
                                            <th><button type='button' className='music-list-btn'onClick={()=> handleLikeClick(music.title,index)} >{parseInt(music.mlike, 10) === 1 ? <MusicLikeClick/> : <MusicLike/>}</button></th>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className='album-list'>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                            <h3 className='music-list-title'>Album List</h3>
                            <button className='music-list-text-btn' style={{paddingTop:"10px"}} onClick={() => navigate("/album-list")}>More</button>
                        </div>
                        
                        <hr className='list-div-line' style={{marginTop:"-20px"}}/>
                        <div className='grid-container'>
                            {albumList.map((album, index) => {
                                
                                return (
                                    <div className='album-unit'>
                                        <img className='album-art' onClick={() => handleClick(album.album)} alt={album.album} src={process.env.PUBLIC_URL + album.img_route}/><br/>
                                        <span className='album-unit-album-name' onClick={() => handleClick(album.album)}>{album.album}</span><br/>
                                        <span className='album-unit-artist-name'>{album.artist}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainPage;
