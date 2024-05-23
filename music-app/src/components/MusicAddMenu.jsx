import React, { useCallback, useEffect, useState } from "react";
import './MusicAddMenu.css';
import axios from 'axios';

import { ReactComponent as CloseIcon } from "../assets/imgs/Close.svg";


const MusicAddMenu = props => {
    const [name, setName] = useState("");
    const [playlist, setPlaylist] = useState([]);
    const [createPlaylistOn, setCreatePlaylistOn] = useState(false);
    const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');

    console.log(email)

    useEffect(() => {
        axios.post("https://blue.kku.ac.kr:5050/playlist-login.php", {
            'type':'list',
            'email': email
        })
        .then(function(response) {
            console.log(response.data)
            if (Array.isArray(response.data.message)) {
                setPlaylist(response.data.message);
                
            } else {
                setPlaylist([]);
            }
        })
    }, [createPlaylistOn])

    useEffect(() => {
        console.log(playlist)
    }, [playlist])


    // 유효성 검사 함수
    const validateName = (name) => {
        return name
            .toLowerCase()
            .match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{0,100}$/)
    }

    const isNameValid = validateName(name);

    const onChangeName = useCallback((e) => {
        const currName = e.target.value;
        setName(currName);
    }, []);


    const handleCreatePlaylist = useCallback((e) => {
        if (!isNameValid) {
            alert("플레이리스트 이름 형식이 잘못되었습니다.");
            return;
        } else {
            axios.post("https://blue.kku.ac.kr:5050/createPlaylist.php", {
                'playlist_name': name,
                'email': email
            })
            .then(function(response) {
                console.log(response.data.status)
                if (response.data.status === "success") {
                    props.setToastContext("플레이리스트가 생성되었습니다.");
                    props.setToast(true);
                    setCreatePlaylistOn(false);
                } else {
                    alert("중복되는 플레이리스트 이름이 존재합니다.");
                    return;
                }
            })
        } 
    });


    return (
        <div className="add-menu-background">
            
            {
                createPlaylistOn
                ? (
                    <div className="create-playlist-window-background">
                        <div className="create-playlist-window">
                            <h3 className="create-playlist-title">Create Playlist</h3>
                            <h3 className="create-playlist-text">Name</h3>
                            
                            <input type="text" className="create-playlist-name" onChange={onChangeName}></input>
                            <p className="create-playlist-subtext">최대: 100자</p>
                            <div style={{display:"flex", justifyContent:"right", marginTop:"20px"}}>
                                <button className="create-playlist-button" style={{backgroundColor:"transparent", color:"#ececec"}} onClick={() => {setCreatePlaylistOn(false)}}>Cancle</button>
                                <button className="create-playlist-button" style={{marginRight:"25px"}} onClick={handleCreatePlaylist}>Create</button>
                            </div>
                        </div>
                    </div>
                )
                : <div/>
            }
            <div className="add-menu">
                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
                    <h2 className="add-menu-playlist-title">Add Music</h2>
                    <button className="add-menu-close" onClick={() => {props.setMenuOpen(false)}}><CloseIcon /></button>
                </div>
                <div style={{overflowY:"auto", height:"280px"}}>
                    <button className="add-menu-playlist-button" onClick={() => {props.AddToNextUp()}}>
                        <img className="add-menu-playlist-img" src="/img/AddMusicList.jpg"/>
                        <div>
                            <h3 className="add-menu-playlist-name" style={{width:"120px", marginLeft:"36px", marginTop:"15px"}}>Add to Next up</h3>
                        </div>
                    </button>
                    {
                        playlist.map((p, index) => {
                            return (
                                <button className="add-menu-playlist-button" playlist={p} onClick={() => props.AddToPlaylist(p)}>
                                    <img className="add-menu-playlist-img" src={process.env.PUBLIC_URL + p.img_route !== "" ? p.img_route : "/img/albums/EmptyAlbum.jpg"}/>
                                    <div style={{display:"flex", flexDirection:"column"}}>
                                        <span className="add-menu-playlist-name">{p.playlist_name}</span>
                                        <span className="add-menu-playlist-tracks">{p.tracks} Tracks</span>
                                    </div>
                                </button>
                            )
                        })
                    }
                </div>

                
                <button className="add-menu-create-playlist-button" onClick={() => {setCreatePlaylistOn(true); setName("");}}>Create Playlist</button>
            </div>
        </div>
    )
};

export default MusicAddMenu;