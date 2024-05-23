import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordResetModal from '../../PasswordResetModal';
import './LoginPage.css';

function LoginPage() {
    // <Modal>
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onClickModalButton = () => {
        setModalIsOpen(true);
    };
    // </Modal>

    const onSubmitSearch = (e) => {
        if (e.key === "Enter") {
          handleRegister();
        }
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 이메일 
    const onChangeEmail = useCallback(async (e) => {
        const currEmail = e.target.value;
        setEmail(currEmail);
    }, []);

    // 비밀번호
    const onChangePassword = useCallback((e) => {
        const currPassword = e.target.value;
        setPassword(currPassword);
    }, []);

    const handleRegister = useCallback(() => {
        axios.post("https://blue.kku.ac.kr/php/login.php", {
            'email': email,
            'password': password
        })
            .then(function (response) {
                console.log(JSON.stringify(response));
                console.log(response.data.status)
                if (response.data.status === "fail") {
                        alert("이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.");
                        setPassword("");
                        setEmail("");
                }
                else {
                    console.log(response.data.message);
                    const {signdata, email, nickname} = response.data.message;
                    const token = response.data.token;
    
                    localStorage.setItem("signdata", JSON.stringify({signdata}));
                    localStorage.setItem("email", JSON.stringify(email));
                    localStorage.setItem("nickname", JSON.stringify(nickname));
                    localStorage.setItem("token", JSON.stringify(token)); 
                    
                    navigate("/");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [email, password, navigate])


    return (
        <div style={{backgroundColor:"#1F1F23", width:"100vw", height:"100vh"}}>
            {modalIsOpen && (<PasswordResetModal visible={modalIsOpen} onClose={() => {setModalIsOpen(false);}} />)}
            <div className="login-template">
                <div>
                    <span className="main-text">SIGN IN</span>
                    <span className="sub-text">E-mail Login</span>
                </div>
                <input type="text" name="email" placeholder="Email" onKeyPress={onSubmitSearch} className="email-input-box" onChange={onChangeEmail} value={email} />
                <input type="password" name="password" placeholder="Password" onKeyPress={onSubmitSearch} className="password-input-box" onChange={onChangePassword} value={password} />
                <button className="login-btn" onClick={handleRegister}>SIGN IN</button>   
                <div className="bottom-buttons-set">
                    <div style={{ width: 140 }}><button type='button' className='text-button' onClick={onClickModalButton}>Forgot Password</button></div>
                    <div className="div-line" style={{ width: 2 }}></div>
                    <div style={{ width: 140 }}><button type="button" className="text-button" onClick={() => navigate("/register")}>SIGN UP</button></div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
