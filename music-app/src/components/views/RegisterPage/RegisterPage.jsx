import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegisterPage.css';
import Modal from "../../Modal";


function RegisterPage() {
    const navigate = useNavigate();

    // <CheckBox>
    const [allCheck, setAllCheck] = useState("")
    const [ageCheck, setAgeCheck] = useState("")
    const [useCheck, setUseCheck] = useState("")
    const [marketingCheck, setMarketingCheck] = useState("")

    const allBtnEvent = () => {
        if (allCheck === false) {
            setAllCheck(true);
            setAgeCheck(true);
            setUseCheck(true);
            setMarketingCheck(true);
        } else {
            setAllCheck(false);
            setAgeCheck(false);
            setUseCheck(false);
            setMarketingCheck(false);
        }
    };

    const ageBtnEvent = () => {
        if (ageCheck === false) {
            setAgeCheck(true);
        } else {
            setAgeCheck(false);
        }
    };

    const useBtnEvent = () => {
        if (useCheck === false) {
            setUseCheck(true);
        } else {
            setUseCheck(false);
        }
    };

    const marketingBtnEvent = () => {
        if (marketingCheck === false) {
            setMarketingCheck(true);
        } else {
            setMarketingCheck(false);
        }
    };

    useEffect(() => {
        if (ageCheck === true && useCheck === true && marketingCheck === true) {
            setAllCheck(true);
        } else {
            setAllCheck(false);
        }
    }, [ageCheck, useCheck, marketingCheck])


    // </CheckBox>

    // <Modal>
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const onClickModalButton = () => {
        setModalIsOpen(true);
    };
    // </Modal>

    // 유효성 검사 함수
    const validateName = (name) => {
        return name
            .toLowerCase()
            .match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{1,8}$/)
    }

    const validateEmail = (email) => {
        return email
            .toLowerCase()
            .match(/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/);
    }

    const validatePassword = (password) => {
        return password
            .toLowerCase()
            .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,25}$/)
    }




    const [nickname, setNickname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [isCheckEmailFirst, setIsCheckEmailFirst] = useState(false);
    const [isCheckNicknameFirst, setIsCheckNicknameFirst] = useState(false);

    // 유효성 검사
    const isNicknameValid = validateName(nickname);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    // 닉네임
    const onChangeNickname = useCallback((e) => {
        const currNickname = e.target.value;
        setNickname(currNickname);
    }, []);

    //이메일 
    const onChangeEmail = useCallback(async (e) => {
        const currEmail = e.target.value;
        setEmail(currEmail);
    }, []);

    //비밀번호
    const onChangePassword = useCallback((e) => {
        const currPassword = e.target.value;
        setPassword(currPassword);
    }, []);

    //비밀번호 확인
    const onChangePasswordCheck = useCallback((e) => {
        const currPasswordCheck = e.target.value;
        setPasswordCheck(currPasswordCheck);
    }, []);
    //닉네임 중복체크
    const onChangeNicknameCheck = useCallback(() => {
        if (!isNicknameValid) {
            alert("닉네임 형식이 올바르지 않습니다.");
            return;
        }
        axios.post("https://blue.kku.ac.kr/php/nicknameCheck.php",{
            "nickname" : nickname
        })
        .then(function (response) {
            console.log(JSON.stringify(response));
            console.log(response.data.status)
            if (response.data.status === "fail") {
                    alert("닉네임을 사용 하실 수 없습니다");
                    
                    setIsCheckNicknameFirst(false);
            }
            else {
                alert("사용 가능한 닉네임입니다");
                setIsCheckNicknameFirst(true);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    //이메일 중복체크
    const onChangeEmailCheck = useCallback(() => {
        if (!isEmailValid) {
            alert("이메일 형식이 올바르지 않습니다.");
            return;
        }
        axios.post("https://blue.kku.ac.kr/php/emailCheck.php",{
            "email" : email
        })
        .then(function (response) {
            console.log(JSON.stringify(response));
            console.log(response.data.status)
            if (response.data.status === "fail") {
                    alert("이메일을 사용 하실 수 없습니다");
                    
                    setIsCheckEmailFirst(false);
            }
            else {
                alert("사용 가능한 이메일입니다");
                setIsCheckEmailFirst(true);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    })
    const handleRegister = useCallback(() => {
        if (!isNicknameValid) {
            alert("닉네임을 1글자 이상 9글자 미만으로 입력해주세요.");
            setIsCheckNicknameFirst(false);
            return;
        } else if (!isCheckEmailFirst) {
            alert("이메일 중복 체크를 먼저 해주세요.");
            setIsCheckEmailFirst(false);
            return;
        }else if (!isCheckNicknameFirst) {
            alert("닉네임 중복 체크를 먼저 해주세요.");
            return;
        }else if (!isEmailValid) {
            alert("이메일 형식이 올바르지 않습니다.");
            setIsCheckEmailFirst(false);
            return;
        } else if (!isPasswordValid) {
            alert("영문, 숫자, 특수기호 조합으로 10자리 이상 입력해주세요.");
            return;
        } else if (passwordCheck !== password) {
            alert("입력하신 비밀번호가 일치하지 않습니다.");
            return;
        } else if (ageCheck !== true || useCheck !== true) {
            alert("약관에 동의해주세요.");
        } else {
            const confirmed = window.confirm("입력하신 정보로 회원가입 하시겠습니까?");
            if (confirmed) {
                axios.post("https://blue.kku.ac.kr/php/register.php", {
                    "email": email,
                    "password": password,
                    "nickname" : nickname
            })
                // DB에 정보 INSERT
            .then(function (response) {
                console.log(JSON.stringify(response));
                console.log(response.data.status)
                if (response.data.status === "fail") {
                        alert("이메일 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.");
                }
                else {
                    alert("회원가입되었습니다. 로그인해주세요");
                    navigate("/login");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }
    })

    return (
        <div style={{backgroundColor:"#1F1F23", width:"100vw", height:"100vh"}}>
            {modalIsOpen && (<Modal visible={modalIsOpen} onClose={() => {setModalIsOpen(false);}}>
                <span className="terms-modal-summary">
                
                </span>
            </Modal>)}
            <div className="register-template">
                <span className="main-text">SIGN UP</span>
                <div style={{paddingTop:"144px",display:"flex"}}>
                    <input type="text" name="nickname" placeholder="Nickname" className="small-input-box" onChange={onChangeNickname} value={nickname} />
                    <button className="checkNicknameBtn"  onClick={onChangeNicknameCheck} value={nickname}>중복 확인</button>
                </div>
                <div style={{display:"flex"}}>
                    <input type="text" name="email" placeholder="Email" className="small-input-box" onChange={onChangeEmail} value={email} />
                    <button className="checkEmailBtn"  onClick={onChangeEmailCheck} value={email}>중복 확인</button>
                </div>
                
                <input type="password" name="password" placeholder="Password" className="password-input-box" onChange={onChangePassword} value={password} />
                <input type="password" name="password-check" placeholder="Password Check" className="password-input-box" onChange={onChangePasswordCheck} value={passwordCheck} />
                <div className="terms-form">
                    <label className="terms-title-text">
                        약관에 동의해주세요.
                    </label>
                    <hr></hr>
                    <div>
                        <div>
                            <input type="checkbox" id="all-check" checked={allCheck} onChange={allBtnEvent} />
                            <label className="terms-checkbox-text" for="all-check">전체동의</label>
                        </div>
                        <div>
                            <input type="checkbox" id="check2" checked={useCheck} onChange={useBtnEvent} />
                            <label className="terms-checkbox-text" for="check2">이용약관 <span>[필수]</span><button className="term-summary-button" onClick={onClickModalButton}>내용 보기</button></label>
                        </div>
                    </div>
                    
                </div>
                <button className="register-btn" onClick={handleRegister}>회원가입</button>
            </div>
        </div>
    );
}

export default RegisterPage;
