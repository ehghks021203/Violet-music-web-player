import './App.css';
import axios from 'axios';
import React, { useCallback, useState, useRef } from 'react';
import { Route, Routes } from "react-router-dom";

import MainPage from './components/views/MainPage/MainPage';
import Sidebar from './components/sidebar/Sidebar';
import Player from './components/player/Player';
import MusicListPage from './components/views/MusicListPage/MusicListPage';
import AlbumListPage from './components/views/MusicListPage/AlbumListPage';
import SearchResultPage from './components/views/SearchResultPage/SearchResultPage';
import AlbumPage from './components/views/MusicPage/AlbumPage';
import PlaylistPage from './components/views/MusicPage/PlaylistPage';
import MyPage from './components/views/MyPage/MyPage';
import MusicAddMenu from './components/MusicAddMenu';
import Toast from './components/Toast';
import AboutUsPage from './components/views/TopPages/AboutUsPage';
import TermsOfUsePage from './components/views/TopPages/TermsOfUsePage';
import SupportPage from './components/views/TopPages/SupportPage';
import FriendModal from './components/FriendModal';

function App() {
	const [toast, setToast] = useState(false);
    const [toastContext, setToastContext] = useState("");
	const [music, setMusic] = useState({title:'노래를 선택해주세요', artist:'', img_route:'', genre:null, lyrics:'', mp3_route:'', album:'',});
	const [addMusic, setAddMusic] = useState({title:'노래를 선택해주세요', artist:'', img_route:'', genre:null, lyrics:'', mp3_route:'', album:'',})
	const [menuOpen, setMenuOpen] = useState(false);
	const [name, setName] = useState("");
	const [createPlaylistOn, setCreatePlaylistOn] = useState(false);
	

	// 플레이어 참조 변수
	const ref = useRef();
	
	// 음악을 실행하면 플레이어로 값을 넘겨주는 함수
	const PlayMusic = (value) => {
		ref.current.MusicAddAndPlay(value);	// 플레이어 컴포넌트 안의 MusicAddAndPlay 함수 실행
		setMusic(value);					// 현재 재생중인 음악 변경
	};

	// 음악을 추가하면 실행되는 함수
	const AddMusic = (value) => {
		setMenuOpen(true)		// 현재 재생목록에 추가할지 플레이리스트에 추가할지를 결정하는 모달 창 Open
		setAddMusic(value)		// 현재 추가하려는 음악 변수로 저장
	}

	// 음악을 재생목록에 추가하면 플레이어로 값을 넘겨주는 함수
	const AddToNextUp = () => {
		setMenuOpen(false);					// 모달 창 닫기
		ref.current.MusicAdd(addMusic);		// 플레이어 컴포넌트 안의 MusicAdd 함수 실행
	}

	const AddMusicAll = (value) => {
		for (let i = 0; i < value.length; i++) {
			ref.current.MusicAdd(value[i]);
		}
		setToastContext("재생목록에 추가되었습니다.");	  // 토스트 문구 지정
		setToast(true);		
	}

	// 음악을 플레이리스트에 추가하는 함수
	const AddToPlaylist = useCallback((p) => {
		console.log(addMusic);

		// playlist.php 실행(ADD)
		axios.post("https://blue.kku.ac.kr/php/playlist-login.php", {
			'type':'add',
            'playlist_no': p.no,
            'song_no': addMusic.song_no ? addMusic.song_no : addMusic.no
        })
        .then(function(response) {
			setMenuOpen(false);									// 모달 창 닫기
			setToastContext("플레이리스트에 추가되었습니다.");	  // 토스트 문구 지정
			setToast(true);										// 토스트 실행
        })

	})

	// 유효성 검사 함수
    const validateName = (name) => {
		// 문자가 ㄱ~ㅎ, 가~힣, a~z, A~Z, 0~9로 이루어져 있고, 1글자~100글자 사이인지 체크	
        return name
            .toLowerCase()
            .match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{0,100}$/)
    }

    const isNameValid = validateName(name);

	// Input 요소의 값이 변경되면 실행
    const onChangeName = useCallback((e) => {
        const currName = e.target.value;
        setName(currName);	// Input 요소 안의 값으로 변경
    }, []);

	// 플레이리스트 생성 함수
    const handleCreatePlaylist = useCallback((e) => {
		// 이름 형식이 잘못되었다면
        if (!isNameValid) {
            alert("플레이리스트 이름 형식이 잘못되었습니다.");	// 알림창 표시
            return;
        } 
		else {
			// 로컬 스토리지 안에 저장되어있는 이메일 값 받아오기
			const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
            // createPlaylist.php 실행
			axios.post("https://blue.kku.ac.kr/php/createPlaylist.php", {
                'playlist_name': name,
                'email': email
            })
            .then(function(response) {
                console.log(response.data.status)
				// php 내에서 중복되는 이름의 플레이리스트가 존재하는지 확인
                if (response.data.status === "success") {
                    setToastContext("플레이리스트가 생성되었습니다.");
                    setToast(true);
                    setCreatePlaylistOn(false);
                } else {
                    alert("중복되는 플레이리스트 이름이 존재합니다.");
                    return;
                }
            })
        } 
    });

	return (
			<div>
				{toast && <Toast setToast={setToast} text={toastContext} />}
				<div style={{display:"flex", minWidth:"1500px", height:"calc(100vh - 66px)", backgroundColor:"#0E0E10"}}>
					<Sidebar/>
					{menuOpen && <MusicAddMenu AddToNextUp={AddToNextUp} AddToPlaylist={AddToPlaylist} setMenuOpen={setMenuOpen} setToast={setToast} setToastContext={setToastContext}/>}
					{
						createPlaylistOn
						&& (
							<div className="create-playlist-window-background">
								<div className="create-playlist-window">
									<h3 className="create-playlist-title">Create Playlist</h3>
									<h3 className="create-playlist-text">Name</h3>
									
									<input type="text" className="create-playlist-name" onChange={onChangeName}></input>
									<h4 className="mypage-create-playlist-subtext">최대: 100자</h4>
									<div style={{display:"flex", justifyContent:"right", marginTop:"20px"}}>
										<button className="create-playlist-button" style={{backgroundColor:"transparent", color:"#ececec"}} onClick={() => {setCreatePlaylistOn(false)}}>Cancle</button>
										<button className="create-playlist-button" style={{marginRight:"25px"}} onClick={handleCreatePlaylist}>Create</button>
									</div>
								</div>
							</div>
						)
					}
					<div className='scroll'>
					<Routes>
						
						<Route path="/" element={<MainPage PlayMusic={PlayMusic}  AddMusic={AddMusic} />} />
						<Route path="/music-list" element={<MusicListPage PlayMusic={PlayMusic}  AddMusic={AddMusic} />} />
						<Route path="/album-list" element={<AlbumListPage />} />
						<Route path="/search" element={<SearchResultPage PlayMusic={PlayMusic}  AddMusic={AddMusic} />} />
						<Route path="/album" element={<AlbumPage PlayMusic={PlayMusic}  AddMusic={AddMusic} />} />
						<Route path="/playlist/:no" element={<PlaylistPage PlayMusic={PlayMusic}  AddMusic={AddMusic} AddMusicAll={AddMusicAll} />} />
						<Route path="/:user/:state" element={<MyPage createPlaylistOn={createPlaylistOn} setCreatePlaylistOn={setCreatePlaylistOn} PlayMusic={PlayMusic}  AddMusic={AddMusic} />} />
						<Route path="/about-us" element={<AboutUsPage />} />
						<Route path="/terms-of-use" element={<TermsOfUsePage />} />
						<Route path="/support" element={<SupportPage />} />
						<Route Path="/friend" element={<FriendModal />} />

					</Routes>
					</div>
				</div>
				<Player ref={ref} music={music} setToast={setToast} setToastContext={setToastContext}/>
			</div>
		);
	}

export default App;
