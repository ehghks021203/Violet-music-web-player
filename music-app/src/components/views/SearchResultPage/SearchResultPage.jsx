import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate ,useLocation } from 'react-router-dom';
import axios from 'axios';
import '../MainPage/MainPage.css';
import './SearchResultPage.css';
import Topbar from '../../topbar/Topbar';

import { ReactComponent as MusicPlay } from "../../../assets/imgs/Play.svg";
import { ReactComponent as MusicAdd } from "../../../assets/imgs/Add.svg";
import { ReactComponent as MusicLike } from "../../../assets/imgs/Like.svg";
import { ReactComponent as MusicLikeClick } from "../../../assets/imgs/LikeOn.svg";


function SearchResultPage({ PlayMusic, AddMusic }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [musicList, setMusicList] = useState([]);
    const [albumList, setAlbumList] = useState([]);
    const [artistList, setArtistList] = useState([]);
    const isLoggedIn = !!localStorage.getItem('token');
    const isMoreMusic = false;
    const isMoreAlbum = false;
    const isMoreArtist = false;
    
    // URL에서 파라미터 받아오기(검색어)
    const searchParams = new URLSearchParams(location.search)
    const search = searchParams.get('q');

    useEffect(() => {
        axios.post("https://blue.kku.ac.kr/php/search.php", {
        'search': search,
        })
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            // 비로그인 상태일 때 음악 검색 리스트 불러오기
            if (!isLoggedIn) {
                if (Array.isArray(response.data.music)) {
                    setMusicList(response.data.music);
                }else {
                setMusicList([response.data.music])
                }
            }
            // 로그인 상태일 때 음악 검색 리스트 불러오기
            else {
                const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
                axios.post("https://blue.kku.ac.kr/php/search-login.php", {
                    'search': search,
                    'email': email
                })
                .then(function(response){
                    console.log(response.data.message);
                    if (Array.isArray(response.data.music)) {
                        setMusicList(response.data.music);
                    }else {
                    setMusicList([response.data.music])
                    }
                })
            }
            if (Array.isArray(response.data.album)) {
                setAlbumList(response.data.album);
            }
            else {
                setAlbumList([response.data.album])
            }

            if (Array.isArray(response.data.artist)) {
                setArtistList(response.data.artist);
            }
            else {
                setArtistList([response.data.artist])
            }
        })
    }, [search]);

    const handleLikeClick = (title, index) => {
        if (isLoggedIn) {
            console.log("로그인 성공");
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr/php/likeCheck.php", {
              'title': title,
              'email': email
            })
            .then(function(response) {
              console.log(response.data.status);
              if (response.data.status === "success") {
                axios.post("https://blue.kku.ac.kr/php/likeDel.php", {
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
                axios.post("https://blue.kku.ac.kr/php/like.php", {
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

    const handleClick = (title) => {             
        navigate("/album", { state: { title: title } });
    };

    return (
        <div>
            <div className='main-window'>
                <Topbar />
                <div className='search-music-list'>
                    <h3 className='search-result-title'>Music</h3>
                    <hr className='search-list-div-line' style={{marginTop:"-20px"}}/>
                    {
                        musicList[0] === ""
                        ? <h4 className='search-none-result-text'>검색 결과가 존재하지 않습니다.</h4>
                        : (
                            <table className='search-music-list-table'>
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
                                                <th><img className='search-music-list-album-img' onClick={() => handleClick(music.title)} alt={music.album} src={process.env.PUBLIC_URL + music.img_route}/></th>
                                                <th>
                                                    <span className='search-music-list-song-text' onClick={() => handleClick(music.title)}>{music.title}</span><br/>
                                                    <span className='search-music-list-artist-text'>{music.artist}</span>
                                                    </th>
                                                <th className='search-music-list-album-text'>{music.album}</th>
                                                <th><button type='button' className='search-music-list-btn' onClick={() => PlayMusic(music)}><MusicPlay/></button></th>
                                                <th><button type='button' className='search-music-list-btn' onClick={() => handleAddClick(music)}><MusicAdd/></button></th>
                                                <th><button type='button' className='search-music-list-btn' onClick={() => {handleLikeClick(music.title, index)}} >{parseInt(music.mlike, 10) === 1 ? <MusicLikeClick/> : <MusicLike/>}</button></th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )
                    }
                </div>
                <div className='search-music-list'>
                    <h3 className='search-result-title'>Album</h3>
                    <hr className='search-list-div-line' style={{marginTop:"-20px"}}/>
                    {
                        albumList[0] === ""
                        ? <h4 className='search-none-result-text'>검색 결과가 존재하지 않습니다.</h4>
                        : (
 
                            <div className='search-album-list'>
                                {albumList.map((album, index) => {
                                    return (
                                        <div className='search-album-unit'>
                                            <img style={{cursor:'pointer'}}className='search-album-img' onClick={() => handleClick(album.album)} alt={album.album} src={process.env.PUBLIC_URL + album.img_route}/>
                                            <span className='search-album-text' onClick={() => handleClick(album.album)}>{album.album}</span><br/>
                                            <span className='search-album-artist-text'>{album.artist}</span> 
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                </div>
                <div className='search-music-list' style={{marginTop:"100px"}}>
                    <h3 className='search-result-title'>Artist</h3>
                    <hr className='search-list-div-line' style={{marginTop:"-20px"}}/>
                    {
                        artistList[0] === ""
                        ? <h4 className='search-none-result-text'>검색 결과가 존재하지 않습니다.</h4>
                        : (
                            <table className='search-music-list-table'>
                                <thead>
                                    <tr>
                                        <th style={{width:"70px", fontWeight:"bold"}}>Artist</th>
                                        <th style={{width:"calc(100% - 70px)", fontWeight:"bold"}}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artistList.map((artist, index) => {
                                        return (
                                            <tr key={index}>
                                                <th><img className='search-artist-img' alt={artist.artist} src={process.env.PUBLIC_URL + artist.img_route}/></th>
                                                <th>
                                                    <span className='search-artist-text'>{artist.artist}</span><br/>
                                                    <span className='search-artist-sub-text'>ARTIST</span>
                                                </th>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )
                    }
                </div>
                <table className='search-music-list-table'></table>
            </div>
        </div>
    );

}
export default SearchResultPage;