import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Topbar.css';

import { ReactComponent as Search } from "../../assets/imgs/Search.svg";


export default function Topbar() {
    const navigate = useNavigate();
    const [search,setSearch] = useState("");

    const onSubmitSearch = (e) => {
        if (e.key === "Enter") {
          onClick();
        }
    };
    const onClick = useCallback(() => {
        if (search === "") {
            alert("검색어를 입력해주세요!");
        } else {
            navigate("/search?q=" + search);
        }
    })

    return (
        <div className='top-bar'>
            <div className='searchContainer'>
                <input className='search-bar' value={search} type="text" placeholder='Search for artists, bands, tracks' onKeyPress={onSubmitSearch} onChange={(e) => setSearch(e.target.value)}></input>
                <button className='search-button' type='submit' onClick={onClick}><Search/></button>
                <button className='top-text-button' style={{marginRight:"5%"}} onClick={() => navigate('/support')}>Support</button>
                <button className='top-text-button' onClick={() => navigate('/terms-of-use')}>Terms Of Use</button>
                <button className='top-text-button' style={{marginLeft:"2%"}} onClick={() => navigate('/about-us')}>About Us</button>
            </div>
        </div>
    );
}
