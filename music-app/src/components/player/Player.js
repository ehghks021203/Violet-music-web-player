import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Parser from 'html-react-parser';
import axios from 'axios';
import './Player.css';
import Toast from '../Toast'

import { ReactComponent as PlayerPrevious } from "../../assets/imgs/player/Previous.svg";
import { ReactComponent as PlayerPlay } from "../../assets/imgs/player/Play.svg";
import { ReactComponent as PlayerPause } from "../../assets/imgs/player/Pause.svg";
import { ReactComponent as PlayerNext } from "../../assets/imgs/player/Next.svg";
import { ReactComponent as PlayerShuffle } from "../../assets/imgs/player/Shuffle.svg";
import { ReactComponent as PlayerShuffleOn } from "../../assets/imgs/player/ShuffleOn.svg";
import { ReactComponent as PlayerReplay } from "../../assets/imgs/player/Replay.svg";
import { ReactComponent as PlayerReplayOn } from "../../assets/imgs/player/ReplayOn.svg";
import { ReactComponent as PlayerVolume } from "../../assets/imgs/player/MusicVolume.svg";
import { ReactComponent as PlayerMute } from "../../assets/imgs/player/MusicMute.svg";
import { ReactComponent as PlayerLike } from "../../assets/imgs/player/Like.svg";
import { ReactComponent as PlayerLikeClick } from "../../assets/imgs/LikeOn.svg";
import { ReactComponent as PlayerLyrics } from "../../assets/imgs/player/Lyrics.svg";
import { ReactComponent as PlayerTimer } from "../../assets/imgs/player/Timer.svg";
import { ReactComponent as MusicDelete } from "../../assets/imgs/Delete.svg";


function Dropdown({ setPlayerTimer }) {
    return (
        <>
            <li className='player-timer-dropdown-content' onClick={() => setPlayerTimer('10 sec')}>10 sec</li>
            <li className='player-timer-dropdown-content' onClick={() => setPlayerTimer('30 sec')}>30 sec</li>
            <li className='player-timer-dropdown-content' onClick={() => setPlayerTimer('1 min')}>1 min</li>
            <li className='player-timer-dropdown-content' onClick={() => setPlayerTimer('5 min')}>5 min</li>
            <li className='player-timer-dropdown-content' onClick={() => setPlayerTimer('10 min')}>10 min</li>
            <li className='player-timer-dropdown-content' onClick={() => setPlayerTimer('30 min')}>30 min</li>
        </>
    )
}

export const Player = forwardRef((props, ref) => {
    // 음악 플레이어 관련 변수
    const [musicPlayer, setMusicPlayer] = useState(new Audio());
    const [music, setMusic] = useState({title:'노래를 선택해주세요', artist:'', img_route:'', genre:'none', lyrics:'', mp3_route:'', album:'',});
    const [isMusicEnd, setIsMusicEnd] = useState(false);
    const [musicList, setMusicList] = useState([]);
    const [songIndex, setSongIndex] = useState(0);
    const [totalSongCount, setTotalSongCount] =  useState(1);
    const [musicPlayOrder, setMusicPlayOrder] = useState([]);
    const [shuffleIndex, setShuffleIndex] = useState(0);
    const [play, setPlay] = useState(false);
    const [replay, setReplay] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [volume, setVolume] = useState(0.5);

    // 플레이리스트 관련 변수
    const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
    const [isPlaylistFadeIn, setIsPlaylistFadeIn] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [playerTimer, setPlayerTimer] = useState('');

    // 가사 관련 변수
    const [isLyricOpen, setIsLyricOpen] = useState(false);
    const [isLyricFadeIn, setIsLyricFadeIn] = useState(false);
    
    const isLoggedIn = !!localStorage.getItem('token');
    

    // 상위 컴포넌트에서 사용할 함수 지정
    useImperativeHandle(ref, () => ({
        MusicAddAndPlay,
        MusicAdd
    }))

    // 렌더링 후 1회 실행되는 함수
    useEffect(() => {
        const progressContainer = document.getElementById('progress-container');
        const progress = document.getElementById("progress");
        const timerCurrent = document.getElementById("current");
        const timerDuration = document.getElementById("duration");

        // 음악 총 길이 세팅 
        function SetTotalTime(e) {
            const { duration } = e.srcElement;

            let totalMin = Math.floor(duration / 60);
            if (totalMin < 10) totalMin = `0${totalMin}`;
            let totalSec = Math.floor(duration % 60);
            if (totalSec < 10) totalSec = `0${totalSec}`;
            timerDuration.innerText = `${totalMin}:${totalSec}`;
        }

        // 음악 재생바(프로그레스바) 및 재생시간 갱신
        function UpdateProgress(e) {
            const {duration, currentTime} = e.srcElement;
            const progressPer = (currentTime / duration) * 100;

            progress.style.width = `${progressPer}%`;

            let currentMin = Math.floor(currentTime / 60);
            if (currentMin < 10) currentMin = `0${currentMin}`;
            let currentSec = Math.floor(currentTime % 60);
            if (currentSec < 10) currentSec = `0${currentSec}`;
            timerCurrent.innerText = `${currentMin}:${currentSec}`

            if (progressPer >= 100) {
                setTimeout(() => {
                    // 0.5초 뒤 다음 곡 재생
                    setIsMusicEnd(true);
                }, 500);
            }
        }

        // 음악 재생바 클릭 함수
        function ChangeProgress(e) {
            const width = e.target.clientWidth;     // 전체 너비
            const offsetX = e.offsetX;              // 현재의 x 좌표값
            const duration = musicPlayer.duration;  // 음악 재생 길이

            // musicPlayer가 재생하고 있는 음악이 존재할 때
            if (musicPlayer.src !== "") {
                musicPlayer.currentTime = (offsetX / width) * duration;
            }
        }

        musicPlayer.addEventListener('loadeddata', SetTotalTime);
        musicPlayer.addEventListener('timeupdate', UpdateProgress);
        progressContainer.addEventListener('click', ChangeProgress);
    }, [])


    // 음악 재생목록에 추가 후 재생
    function MusicAddAndPlay(music) {
        setMusic(music);
        setMusicList(musicList => {
            return [...musicList, music]
        });

        setTimeout(() => {
            if (shuffle) { setSongIndex(musicPlayOrder.indexOf(totalSongCount)); }
            else { setSongIndex(totalSongCount); }   
        }, 20);
        props.setToastContext("재생목록에 추가되었습니다.");
        props.setToast(true);    
        if(isLoggedIn){
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/mypage.php", {
                'title': music.title,
                'email': email
            })
            .then(function(response) {
                // 여기 코드 뭔지 설명해주실분
                console.log(response.data);
            })
        }    
    }

    function MusicAdd(music) {
        // 만약 재생목록이 비어있다면
        if (musicList.length === 0) {
            setMusic(music);    // 현재 음악을 새로 추가한 음악으로 지정
            musicPlayer.src = music.mp3_route;
        }
        // 음악 리스트에 새로 추가한 음악을 넣어줌
        setMusicList(musicList => {
            return [...musicList, music]
        });

        // 재생 목록에 추가가 완료됨을 알리는 토스트 알림창
        props.setToastContext("재생목록에 추가되었습니다.");
        props.setToast(true);  
    }

    // 새로운 음악 재생
    function SpecificMusicPlay(music) {
        musicPlayer.src = music.mp3_route;

        // 음악 재생
        var playPromise = musicPlayer.play();
        // Play 시 발생하는 예외 처리문
        if (playPromise !== undefined) { playPromise.then((_) => {}).catch((error) => {}); }
        
        // 현재 재생중인 음악 변수에 저장
        setMusic(music);
        setPlay(true);    
    }

    // 현재 재생중인 음악 이어서 재생
    function MusicPlay() {
        // 음악 재생
        var playPromise = musicPlayer.play();
        // Play 시 발생하는 예외 처리문
        if (playPromise !== undefined) { playPromise.then((_) => {}).catch((error) => {}); }
        setPlay(true);
    }

    // 현재 재생죽인 음악 일시정지
    function MusicPause() {
        // 음악 일시정지
        musicPlayer.pause();
        setPlay(false);
    }

    // 다음 트랙
    function NextMusic() {
        if (shuffle) { 
            if (shuffleIndex >= totalSongCount) { 
                setShuffleIndex(0);
                setSongIndex(musicPlayOrder[0]); 
            } else if (shuffleIndex < 0) { 
                setShuffleIndex(totalSongCount - 1); 
                setSongIndex(musicPlayOrder[totalSongCount - 1]); 
            } else {
                setSongIndex(musicPlayOrder[shuffleIndex + 1]); 
                setShuffleIndex(shuffleIndex + 1);
            }
        } else { 
            setSongIndex(songIndex + 1); 
        }
    }

    // 이전 트랙
    function PrevMusic() {
        setSongIndex(songIndex - 1);
    }

    // 음악이 끝나면 다음 트랙으로
    useEffect(() => {
        if (isMusicEnd) { 
            NextMusic();
            setIsMusicEnd(false);
        }
        
    }, [isMusicEnd])

    // song Index가 변경되면 실행
    useEffect(() => {
        if (musicList.length !== 0) {
            if (songIndex >= totalSongCount) { 
                setSongIndex(0); 
            } else if (songIndex < 0) { 
                setSongIndex(totalSongCount - 1); 
            } else { 
                SpecificMusicPlay(musicList[songIndex]); 
            }
        }
         
     }, [songIndex])


    // 반복재생
    useEffect(() => {
        musicPlayer.loop = replay;
    }, [replay])


    // 셔플
    useEffect(() => {
        if (shuffle) {
            var arr = new Array();
            var temp = Array.from(new Array(musicList.length), (x, i) => i);
            for (let i = 0; i < musicList.length; i++) {
                if (i === 0) {
                    arr.push(songIndex);
                    temp = temp.filter((e) => e !== songIndex);
                } else {
                    const randomPos = Math.floor(Math.random() * (temp.length));
                    arr.push(temp[randomPos]);
                    temp.splice(randomPos, 1);
                }
            }
            setMusicPlayOrder(arr);
            setShuffleIndex(0);
        }
    }, [shuffle, musicList])


    // 볼륨 조절
    useEffect(() => {
        musicPlayer.volume = volume;
    }, [volume])


    // 자동 종료 타이머
    useEffect(() => {
        let playerTimerValue = 0;

        if (playerTimer !== '') {
            props.setToastContext('타이머가 설정되었습니다.');
            props.setToast(true);

            switch (playerTimer) {
                case '10 sec':
                    playerTimerValue = 10_000;
                    break;
                case '30 sec':
                    playerTimerValue = 30_000;
                    break;
                case '1 min':
                    playerTimerValue = 60_000;
                    break;
                case '5 min':
                    playerTimerValue = 300_000;
                    break;
                case '10 min':
                    playerTimerValue = 600_000;
                    break;
                case '30 min':
                    playerTimerValue = 1_800_000;
                    break;
            }
            
            setTimeout(() => {
                MusicPause();
                props.setToastContext('음악이 자동 종료 되었습니다.');
                props.setToast(true);
                setPlayerTimer('');
            }, playerTimerValue);
        }
        
    }, [playerTimer]);



    useEffect(() => {
        if (musicList.length !== 0) {
            setTotalSongCount(musicList.length);
            setMusicPlayOrder();
        }
    }, [musicList])

    const handleLikeClick = () => {
        if (isLoggedIn) {
            const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            axios.post("https://blue.kku.ac.kr:5050/likeCheck.php", {
                'title': music.title,
                'email': email
            })
            .then(function(response) {
                if (response.data.status === "success") {
                    axios.post("https://blue.kku.ac.kr:5050/likeDel.php", {
                        'title': music.title,
                        'email': email
                    })
                    .then(function(response) {
                        const updatedMusicList = [...musicList];
                        const updatedMusic = { ...music, mlike: '0' }; // mlike 속성 추가
                        const musicIndex = updatedMusicList.findIndex(item => item.title === updatedMusic.title);
                        if (musicIndex !== -1) {
                            updatedMusicList[musicIndex] = updatedMusic;
                            setMusicList(updatedMusicList);
                            setMusic(updatedMusic);
                        }
                    });
                } else {
                    axios.post("https://blue.kku.ac.kr:5050/like.php", {
                        'title': music.title,
                        'email': email
                    })
                    .then(function(response) {
                        const updatedMusicList = [...musicList];
                        const updatedMusic = { ...music, mlike: '1' }; // mlike 속성 추가
                        const musicIndex = updatedMusicList.findIndex(item => item.title === updatedMusic.title);
                        if (musicIndex !== -1) {
                            updatedMusicList[musicIndex] = updatedMusic;
                            setMusicList(updatedMusicList);
                            setMusic(updatedMusic);
                        }
                    });
                }
            });
        } else {
            alert("로그인을 해주세요!");
            // 로그인 안됐을 시 좋아요 x
        }
    };

    function handleListInit() {
        setMusicList([]);
        setMusic(({
            title:'노래를 선택해주세요', 
            artist:'', 
            img_route:'', 
            genre:'none', 
            lyrics:'',
            mp3_route:'', 
            album:'',
        }));
        MusicPause();
        musicPlayer.src = '';
    }

    function handlePlaylistOpen() {
        if (isPlaylistOpen) {
            setIsPlaylistFadeIn(false);
            setTimeout(() => {
                setIsPlaylistOpen(false);
            }, 500);
        } else {
            setIsPlaylistFadeIn(true);
            setIsPlaylistOpen(true);
        }
    }

    function handleLyricClick() {
        if (isLyricOpen) {
            setIsLyricFadeIn(false);
            setTimeout(() => {
                setIsLyricOpen(false);
            }, 500);
        } else {
            setIsLyricFadeIn(true);
            setIsLyricOpen(true);
        }
    }

    const handleDeleteMusic = (index, list) => {
        if (list.length === 1) {
            handleListInit();
        } else {
            list.splice(index, 1);
            setMusicList(list);
            setTimeout(() => {
                if (songIndex === index) {
                    if (shuffle) { setSongIndex(musicPlayOrder.indexOf(totalSongCount)); }
                else { setSongIndex(totalSongCount); }   
                }
                
            }, 20);
            
        }
        
        props.setToastContext("재생목록에서 삭제되었습니다.");
        props.setToast(true);
    }

    

    return (
        <div>
            <div id='progress-container' className='player-music-bar'>
                <div className="progress" id="progress"></div>
                <div className="progress-container" id="progress-container"></div>
            </div>
            {isPlaylistOpen &&
            <div className={isPlaylistFadeIn ? 'player-playlist-fade-in':'player-playlist-fade-out'}>
                <div className='player-playlist'>
                    <div className='player-playlist-top-bar'>
                        <h2 className='player-playlist-text'>현재 재생목록</h2>
                        <PlayerTimer style={{marginTop:"8px", marginRight:"2px"}}/>
                        <div className='player-timer-dropdown'>
                            <ul className='player-timer-dropdown-button' onClick={() => {setOpenDropdown(!openDropdown)}}>
                                {playerTimer === '' ? '-' : playerTimer}
                                {openDropdown && <Dropdown setPlayerTimer={setPlayerTimer}/>}
                            </ul>
                        </div>
                        <button className='player-playlist-delete-button' onClick={handleListInit}>Clear</button>
                    </div>
                    {
                        musicList.length === 0
                        ? <h2 className='player-playlist-empty-text'>노래를 추가해주세요.</h2>
                        : <div className='player-playlist-list'>
                            {musicList.map((music, index) => {
                                const imagePath = `${process.env.PUBLIC_URL + music.img_route}`;
                                return (
                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <button className='player-playlist-unit-button' onClick={() => {setSongIndex(index)}}>
                                            <img className='player-song-img' src={imagePath}/>
                                            <div className='player-song-info'>
                                                <span className='player-song-title'>{music == {} ? '노래를 선택해주세요' : music.title}</span><br/>
                                                <span className='player-artist-name'>{music.artist}</span>
                                            </div>
                                        </button>
                                        <button className='player-song-delete-button' onClick={() => handleDeleteMusic(index, musicList)}><MusicDelete/></button>
                                    </div>
                                );
                            })}
                        </div>
                    }
                </div>
            </div>
            }

            {isLyricOpen &&
            <div className={isLyricFadeIn ? 'player-lyric-fade-in':'player-lyric-fade-out'}>
                <div className='player-lyric'>
                    {music.lyrics !== ''
                    ?   <span className='player-lyric-text'>{Parser(music.lyrics)}</span>
                    :   <span className='player-lyric-text'>가사가 존재하지 않습니다.</span>
                    }
                    
                </div>
            </div>
            }
            
            


            <div className='player'>
            
                
                <div className='player-first-area'>
                    <button className='player-playlist-open-button' onClick={handlePlaylistOpen}>
                        <img className='player-song-img' src={process.env.PUBLIC_URL + music.img_route !== "" ? music.img_route : "/img/albums/EmptyAlbum.jpg"}/>
                        <div className='player-song-info'>
                            <span className='player-song-title'>{music == {} ? '노래를 선택해주세요' : music.title}</span><br/>
                            <span className='player-artist-name'>{music.artist}</span>
                        </div>
                    </button>
                    <button type='button' className='player-small-btn' onClick={() => {handleLikeClick()}}>{parseInt(music.mlike, 10) === 1 ? <PlayerLikeClick/> : <PlayerLike/>}</button>
                    <button type='button' className='player-small-btn' onClick={() => {handleLyricClick()}}><PlayerLyrics style={{marginTop:"1px", marginLeft:"-30px"}}/></button> 
                </div>
                <div className='player-second-area'>
                    <button id='replay' type='button' className='player-small-btn' onClick={() => {setReplay(!replay)}}>{replay ? <PlayerReplayOn/> : <PlayerReplay/>}</button>
                    <button id='prev' type='button' className='player-small-btn' onClick={PrevMusic}><PlayerPrevious/></button>
                    <button type='button' className='player-btn' onClick={play ? MusicPause : MusicPlay}>{play ? <PlayerPause/> : <PlayerPlay/>}</button>
                    <button type='button' className='player-small-btn' onClick={NextMusic}><PlayerNext/></button>
                    <button id='shuffle' type='button' className='player-small-btn' onClick={() => {setShuffle(!shuffle)}}>{shuffle ? <PlayerShuffleOn/> : <PlayerShuffle/>}</button>
                </div>
                <div className='player-third-area'>
                    <div className='player-time-text'>
                        <span id='current'>00:00</span> 
                        <span> / </span>
                        <span id='duration'>01:00</span>
                    </div>
                    <div style={{display:"flex"}}>
                        <div className='player-volume'>{volume > 0 ? <PlayerVolume/> : <PlayerMute style={{marginTop:"-3px"}}/>}</div>
                        <input className='player-volume-bar' type='range' min={0} max={1}
                            color='gray' step={0.02} value={volume}
                            style={{marginTop:"26px", height:"3px", backgroundColor:"purple"}}
                            onChange={(event) => {setVolume(event.target.valueAsNumber);}}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
});

export default Player;