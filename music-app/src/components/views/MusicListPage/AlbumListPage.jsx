import React, { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../../topbar/Topbar";
import { useNavigate } from "react-router-dom";
import "../SearchResultPage/SearchResultPage.css";

function AlbumListPage() {
    const navigate = useNavigate();
    const [albumList, setAlbumList] = useState([]);

    useEffect(() => {
        // 앨범 리스트 불러오기
        axios.post("https://blue.kku.ac.kr:5050/album-list.php", {})
        .then(function(response) {
            console.log(JSON.stringify(response.data));
            if (Array.isArray(response.data.message)) {
                setAlbumList(response.data.message);
            }
            else {
                setAlbumList([response.data.message])
            }        
        })
    }, [])

    const handleClick = (title) => {             
        navigate("/album", { state: { title: title } });
    };

    return (
        <div>
            <Topbar/>
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
                                            <img className='search-album-img' onClick={() => handleClick(album.album)} alt={album.album} src={process.env.PUBLIC_URL + album.img_route}/>
                                            <span className='search-album-text' onClick={() => handleClick(album.album)}>{album.album}</span><br/>
                                            <span className='search-album-artist-text'>{album.artist}</span> 
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    }
                </div>
                <table className='search-music-list-table'></table>  
        </div>
        
    );
}

export default AlbumListPage;







