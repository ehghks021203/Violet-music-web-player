import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../MainPage/MainPage.css';
import './MusicPage.css';
import Topbar from '../../topbar/Topbar';

import { ReactComponent as MusicPlay } from "../../../assets/imgs/Play.svg";
import { ReactComponent as MusicAdd } from "../../../assets/imgs/Add.svg";
import { ReactComponent as MusicLike } from "../../../assets/imgs/Like.svg";
import { ReactComponent as MusicDelete } from "../../../assets/imgs/Delete.svg";
import { ReactComponent as MusicLikeClick } from "../../../assets/imgs/LikeOn.svg";


function PlaylistPage({ PlayMusic, AddMusic, AddMusicAll }) {
    const { no } = useParams();
    const navigate = useNavigate();
    const [shouldShowButton,setShouldShowButton] = useState(false);
    const [playlist, setPlaylist] = useState({});
    const [musicList, setMusicList] = useState([]);
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        axios.post("https://blue.kku.ac.kr:5050/playlist.php", {
            'type':'page',
            'playlist_no': no
        })
        .then(function(response) {
            setPlaylist(response.data.message[0]);
        })
        if(isLoggedIn){
            // 플레이리스트 정보 받아오기
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');

            // 플레이리스트 음악 목록 받아오기
            axios.post("https://blue.kku.ac.kr:5050/playlist-login.php", {
                'type':'song',
                'playlist_no': no,
                'email': email,
            })
            .then(function(response) {
                if (Array.isArray(response.data.message)) {
                    setMusicList(response.data.message);
                }
                else{
                    setMusicList([response.data.message]);
                }
            })
        } else {
            // 플레이리스트 음악 목록 받아오기
            axios.post("https://blue.kku.ac.kr:5050/playlist.php", {
                'type':'song',
                'playlist_no': no,
            })
            .then(function(response) {
                console.log(response.data)
                if (Array.isArray(response.data.message)) {
                    setMusicList(response.data.message);
                }
                else{
                    setMusicList([response.data.message]);
                }
            })
        }
    }, [musicList]);

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
                        console.log(response.data.message);
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

    useEffect(() => {
        if (isLoggedIn) {
            const name = localStorage.getItem('nickname').replace(/^"(.*)"$/, '$1');
            if (playlist.nickname === name) {
                setShouldShowButton(true);
            }
        }
    }, [playlist]);

    const DeleteMusic = (song_no) => {
        if (isLoggedIn) {
            if (window.confirm("선택한 노래를 플레이리스트에서 삭제하겠습니까?")) {
                const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
                // 플레이리스트 노래 제거거
                axios.post("https://blue.kku.ac.kr:5050/playlist-login.php", {
                    'type':'song-delete',
                    'playlist_no': no,
                    'no': song_no
                })

                // 플레이리스트 음악 목록 받아오기
                axios.post("https://blue.kku.ac.kr:5050/playlist-login.php", {
                    'type':'song',
                    'playlist_no': no,
                    'email': email,
                })
                .then(function(response) {
                    console.log(response.data)
                    if (Array.isArray(response.data.message)) {
                        setMusicList(response.data.message);
                    }
                    else{
                        setMusicList([response.data.message]);
                    }
                })
            }
        }
    }

    const DeletePlaylist = (playlist_no) => {
        if (isLoggedIn) {
            const nickname = localStorage.getItem('nickname').replace(/^"(.*)"$/, '$1');
            if (window.confirm("플레이리스트를 삭제하겠습니까?")) {
                // 플레이리스트 노래 제거거
                axios.post("https://blue.kku.ac.kr:5050/playlist-login.php", {
                    'type':'delete',
                    'playlist_no': no,
                })
                window.alert("플레이리스트가 삭제되었습니다.");
                navigate("/" + nickname + "/playlists");
            }
        }

    }


    return (
        <div className='main-window'>
            <Topbar />
            <div className='album-info-area'>
                <img className='album-info-img' src={process.env.PUBLIC_URL + playlist.img_route !== "" ? playlist.img_route : "/img/albums/EmptyAlbum.jpg"}/>
                <div className='album-info-text'>
                    <span className='playlist-info-title-text'>{playlist.playlist_name}</span><br/><br/>
                    <span className='playlist-info-user-text'>{playlist.nickname}</span>
                    <span className='playlist-info-user-text'> | </span>
                    <span className='playlist-info-count-text'>{playlist.tracks} Tracks</span><br/><br/>
                    {shouldShowButton && <button className="musicpage-delete-playlist-button" onClick={() => DeletePlaylist(playlist.no)}>Delete Playlist</button>}
                </div>
                
            </div>
            <div className='MP-music-list'>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <h3 className='music-list-title'>Music List ({playlist.tracks})</h3>
                        {musicList[0] !== "" && <button className="musicpage-add-to-playlist-button" onClick={() => AddMusicAll(musicList)}>재생목록에 추가</button>}
                    </div>
                    <hr className='list-div-line' style={{marginTop:"-20px"}}/>
                    {
                        musicList[0] === ""
                        ? <h4 className='musicpage-none-result-text'>플레이리스트에 노래가 존재하지 않습니다.</h4>
                        : shouldShowButton
                        ? (
                            <table className='music-list-table'>
                                <thead>
                                    <tr>
                                        <th style={{width:"60px", fontWeight:"bold"}}></th>
                                        <th style={{width:"70px", fontWeight:"bold"}}>Music/Artist</th>
                                        <th style={{width:"32%", fontWeight:"bold"}}></th>
                                        <th style={{width:"calc(44%-130px)", fontWeight:"bold"}}>Album</th>
                                        <th style={{width:"6%", textAlign:"center", fontWeight:"bold"}}>Listen</th>
                                        <th style={{width:"6%", textAlign:"center", fontWeight:"bold"}}>Add</th>
                                        <th style={{width:"6%", textAlign:"center", fontWeight:"bold"}}>Like</th>
                                        <th style={{width:"6%", textAlign:"center", fontWeight:"bold"}}>Delete</th>
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
                                                <th><button type='button' className='music-list-btn' onClick={() => AddMusic(music)}><MusicAdd/></button></th>
                                                <th><button type='button' className='music-list-btn' onClick={() => {handleLikeClick(music.title, index)}}>{parseInt(music.mlike, 10) === 1 ? <MusicLikeClick/> : <MusicLike/>}</button></th>
                                                <th><button type='button' className='music-list-btn' onClick={() => DeleteMusic(music.no)}><MusicDelete/></button></th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )
                        : (
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
                                                <th><button type='button' className='music-list-btn' onClick={() => AddMusic(music)}><MusicAdd/></button></th>
                                                <th><button type='button' className='music-list-btn' onClick={() => {handleLikeClick(music.title, index)}}>{parseInt(music.mlike, 10) === 1 ? <MusicLikeClick/> : <MusicLike/>}</button></th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )
                    }
                <table className='music-list-table'></table>
            </div>
        </div>
    );
}

export default PlaylistPage;