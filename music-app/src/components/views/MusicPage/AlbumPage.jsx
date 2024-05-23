import React, { useState, useEffect} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import '../MainPage/MainPage.css';
import './MusicPage.css';
import Topbar from '../../topbar/Topbar';

import { ReactComponent as MusicPlay } from "../../../assets/imgs/Play.svg";
import { ReactComponent as MusicAdd } from "../../../assets/imgs/Add.svg";
import { ReactComponent as MusicLike } from "../../../assets/imgs/Like.svg";
import { ReactComponent as MusicLikeClick } from "../../../assets/imgs/LikeOn.svg";


function AlbumPage({ PlayMusic, AddMusic }) {
    const navigate = useNavigate();
    const [musicList, setMusicList] = useState([]);
    const [albumInfo, setAlbumInfo] = useState("");  
    const location = useLocation();
    const title = location.state.title;
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        if(!isLoggedIn){
        axios.post("https://blue.kku.ac.kr:5050/song-page.php", {
        "title":title,
        })
        .then(function(response) {
            console.log(JSON.stringify(response.data.message));
            setMusicList(response.data.message)
        })
        }
        else{
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/album-login.php", {
            "title":title,
            "email":email
        })
        .then(function(response) {
            console.log(JSON.stringify(response.data.message));
            setMusicList(response.data.message)
        })
        }
        axios.post("https://blue.kku.ac.kr:5050/album.php", {
            "title": title
        })
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            setAlbumInfo(response.data.message);
        })
        
    }, []);
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
            // 로그인안됬을시 좋아요 x
        }
    }

    return (
        <div className='main-window'>
            <Topbar />
            <div className='album-info-area'>
                <img className='album-info-img'src={albumInfo[0]}/>
                <div className='album-info-text'>
                    <span className='album-info-title-text'>{albumInfo[1]}</span><br/><br/>
                    <span className='album-info-artist-text'>{albumInfo[4]}</span><br/><br/>
                    <span className='album-info-genre-text'>{albumInfo[2]}</span><br/>
                    <span className='album-info-regdate-text'>{albumInfo[3]}</span>
                </div>
            </div>
            <h3 className='album-info-title'>Album Info</h3>
            <hr className='list-div-line' style={{width:'90%', marginTop:'-20px'}}/>
            <span className='album-info-summary' >{albumInfo[5]}</span>


            <div className='MP-music-list'>
                    <h3 className='music-list-title'>Music List</h3>
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
                                return (
                                    <tr key={index}>
                                        <th className='music-list-number-text'>{index + 1}</th>
                                        <th><img className='music-list-album-img' alt={music.album} src={process.env.PUBLIC_URL + music.img_route}/></th>
                                        <th>
                                            <span className='music-list-song-text'>{music.title}</span><br/>
                                            <span className='music-list-artist-text'>{music.artist}</span>
                                            </th>
                                        <th className='music-list-album-text'>{music.album}</th>
                                        <th><button type='button' className='music-list-btn' onClick={() => PlayMusic(music)}><MusicPlay/></button></th>
                                        <th><button type='button' className='music-list-btn' onClick={() => handleAddClick(music)}><MusicAdd/></button></th>
                                        <th><button type='button' className='music-list-btn'onClick={() => {handleLikeClick(music.title,index)}}>{parseInt(music.mlike, 10) === 1 ? <MusicLikeClick/> : <MusicLike/>}</button></th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        </div>
    );
}

export default AlbumPage;