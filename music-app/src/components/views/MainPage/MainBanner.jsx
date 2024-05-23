import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainBanner.css';

import { ReactComponent as BannerNext } from "../../../assets/imgs/BannerNext.svg";
import { ReactComponent as BannerPrev } from "../../../assets/imgs/BannerPrev.svg";


function MainBanner() {
    const navigate = useNavigate();
    const [totalGenre, setTotalGenre] = useState([]);
    const [musicList, setMusicList] = useState({
        'POP':[],
        'Electric':[],
        'Groovy':[]
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalIndex, setTotalIndex] = useState(0);
    const colorSet = {
        'POP':'#db7093',
        'Electric':'#3cb371',
        'Groovy':'#6495ed'
    }
    
    useEffect(() => {
        axios.post("https://blue.kku.ac.kr:5050/song-genre.php", {})
        .then(function(response) {
            setTotalGenre(response.data.message);
        })
        
    }, [])

    useEffect(() => {
        for (let i = 0; i < totalGenre.length; i++) {
            let genre = totalGenre[i].genre;
            axios.post("https://blue.kku.ac.kr:5050/music-list.php", {
                'genre':genre
            })
            .then(function(response) {
                console.log(response.data.message)
                if (Array.isArray(response.data.message)) {
                    const sortedMusicList = response.data.message.sort((a, b) =>
                        b.reldate.localeCompare(a.reldate)
                    );
                    if (response.data.message.length >= 8) {
                        setMusicList(musicList => ({...musicList, [genre] : sortedMusicList.slice(0,8)}));
                    }
                }
                else {
                    setMusicList(musicList => ({...musicList, [genre] : [response.data.message]}));
                }        
            })
        }


        function BannerSet() {
            setTotalIndex(totalGenre.length);
            const outer = document.querySelector('.banner-outer');
            const innerList = document.querySelector('.banner-inner-list');
            const inners = document.querySelectorAll('.banner-inner');
            let ci = 0;

            inners.forEach((inner) => {
                inner.style.width = `${outer.clientWidth}px`; // inner의 width를 모두 outer의 width로 만들기
            })

            innerList.style.width = `${outer.clientWidth * inners.length}px`; // innerList의 width를 inner의 width * inner의 개수로 만들기

            /*
            버튼에 이벤트 등록하기
            */
            const buttonLeft = document.querySelector('.banner-button-left');
            const buttonRight = document.querySelector('.banner-button-right');

            buttonLeft.addEventListener('click', () => {
                ci--;
                ci = ci < 0 ? 0 : ci; // index값이 0보다 작아질 경우 0으로 변경
                innerList.style.marginLeft = `-${outer.clientWidth * ci}px`; // index만큼 margin을 주어 옆으로 밀기
                setCurrentIndex(ci);
            });

            buttonRight.addEventListener('click', () => {
                ci++;
                ci = ci >= inners.length ? inners.length - 1 : ci; // index값이 inner의 총 개수보다 많아질 경우 마지막 인덱스값으로 변경
                innerList.style.marginLeft = `-${outer.clientWidth * ci}px`; // index만큼 margin을 주어 옆으로 밀기
                setCurrentIndex(ci);
            });
        }

        BannerSet();
        window.addEventListener("resize", BannerSet);
    }, [totalGenre])

    const handleClick = (title) => {             
        navigate("/album", { state: { title: title } });
    };

    return (
        <div className="main-banner">
            <div className="banner-outer">
                <div className="banner-inner-list">
                    {totalGenre&&
                        totalGenre.length !== 0
                        ? totalGenre.map((genre) => {
                            return (
                                <div className="banner-inner" style={{backgroundColor:colorSet[genre.genre]}}>
                                    <div>
                                        <h2 className="banner-title">{genre.genre} Music</h2>
                                        <h2 className="banner-subtitle">{genre.genre} 최신 음악</h2>
                                        <button className="banner-more-button" onClick={() => navigate("/music-list", { state: { genre: genre.genre } })}>더 보러 가기</button>
                                    </div>
                                    <div className="banner-music-list">
                                        {musicList[genre.genre]&&
                                            musicList[genre.genre].map((music) => {
                                            return (
                                                <button className="banner-music-button" onClick={() => handleClick(music.title)}>
                                                    <img className="banner-music-img" src={process.env.PUBLIC_URL + music.img_route}/>
                                                    <div style={{display:"flex", flexDirection:"column"}}>
                                                        <span className="banner-music-title">{music.title}</span>
                                                        <span className="banner-music-artist">{music.artist}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        
                                    </div>
                                </div>
                            );
                        })
                        : <div/>
                    }
                </div>

            </div>
            <button className="banner-button-left" style={{visibility:currentIndex !== 0 ? "visible" : "hidden"}}><BannerPrev/></button>
            <button className="banner-button-right" style={{visibility:currentIndex !== totalIndex - 1 ? "visible" : "hidden"}}><BannerNext/></button>
        </div>
    );
}

export default MainBanner;