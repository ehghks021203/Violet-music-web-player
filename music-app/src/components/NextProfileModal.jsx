import React, { useEffect ,useCallback, useState} from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import axios from 'axios';
import './MusicAddMenu.css';
import { ReactComponent as CloseIcon } from "../assets/imgs/BigClose.svg";
import { ReactComponent as CameraIcon } from "../assets/imgs/camera2.svg";

function NextProfileModal({ className, onClose, visible }) {
  const { user, state } = useParams();
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [userData, setUserData] = useState({
    email: '', 
    nickname: '', 
    sigdate: '', 
    img_route: ''
  });
  const [email,setEmail] = useState(localStorage.getItem('email').replace(/^"(.*)"$/, '$1') || "");
  const [modalpwIsOpen, setModalpwIsOpen] = useState(false);
  const [modalNickIsOpen, setModalNickIsOpen] = useState(false);
  const [modalHeight, setModalHeight] = useState(500);
  const [top,setTop] = useState("43%");
  const [isButtonVisible, setButtonVisible] = useState(true);



  
  const isLoggedIn = !!localStorage.getItem('token');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password
        .toLowerCase()
        .match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{10,25}$/)
  }

  const validateName = (name) => {
    return name
        .toLowerCase()
        .match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{1,8}$/)
  }

  const isPasswordValid = validatePassword(password);
  const isNicknameValid = validateName(nickname);
  const [isCheckNicknameFirst, setIsCheckNicknameFirst] = useState(false);

  useEffect(() => {
    console.log(userData.email);
    if (isLoggedIn) {
      axios.post("https://blue.kku.ac.kr:5050/userInfo.php", {
        "nickname": user,
      })
      .then(function(response){
        setUserData(response.data.message[0]);
      })
      .catch(function(error){
        console.log(error);
      });
    }
  }, [isLoggedIn, user]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const imageURL = URL.createObjectURL(file);
    

      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file) => {
    console.log(file);
    // 이미지 업로드를 위한 HTTP 요청을 보낼 수 있습니다.
    if (isLoggedIn) {
      const formData = new FormData();
      formData.append("nickname", user);
      formData.append("Img", file);

      axios.post("https://blue.kku.ac.kr:5050/userImg.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
          console.log(response.data.message);
          window.location.reload();// 자동새로고침
        });
    }
  };
  const onClickpwButton = () => {
    setModalpwIsOpen(true);
    setButtonVisible(false);
    setModalHeight(600);
    setTop("36%");
  };

  const onClickNickButton = () => {
    setModalNickIsOpen(true);
    setButtonVisible(false);
    setModalHeight(600);
    setTop("36%");
  };

  const handleClose = () => {
    onClose?.();
  };

  const onChangeNickname = useCallback((e) => {
    const currNickname = e.target.value;
    setNickname(currNickname);
  }, []);

  const onChangePassword = useCallback((e) => {
    const currPassword = e.target.value;
    setPassword(currPassword);
  }, []);

  const onChangePasswordCheck = useCallback((e) => {
    const currPasswordCheck = e.target.value;
    setPasswordCheck(currPasswordCheck);
  }, []);

  //닉네임 중복체크
  const onChangeNicknameCheck = () => {
    if (!isNicknameValid) {
        alert("닉네임 형식이 올바르지 않습니다.");
        return;
    }
    axios.post("https://blue.kku.ac.kr:5050/nicknameCheck.php",{
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
}

  const changeNickname = () => {
    if (!isNicknameValid) {
      alert("닉네임을 1글자 이상 9글자 미만으로 입력해주세요.");
      setIsCheckNicknameFirst(false);
      return;
    }else if (!isCheckNicknameFirst) {
      alert("닉네임 중복 체크를 먼저 해주세요.");
      setIsCheckNicknameFirst(false);
      return;
    }else{
    const confirmed = window.confirm("입력하신 닉네임으로 변경 하시겠습니까?");
    if (confirmed) {
        axios.post("https://blue.kku.ac.kr:5050/nicknameChange.php", {
            "email": userData.email,
            "nickname":nickname
    })
    .then(function (response) {
      console.log(JSON.stringify(response));
      console.log(response.data.status)
      if (response.data.status === "fail") {
              alert("error");
              setIsCheckNicknameFirst(false);
      }
      else {
          alert("닉네임이 변경되었습니다. 다시 로그인해주세요");
          navigate("/login");
      }
      })
      .catch(function (error) {
        console.log(error);
      });
  }}
  }

  const withDrawal = ()=>{
    const result = window.confirm("정말로 회원 탈퇴하시겠습니까?");
    if(result){
    axios.post("https://blue.kku.ac.kr:5050/withdraw.php", {
          "email": userData.email,
    })
    .then(function (response) {
      console.log(JSON.stringify(response));
      console.log(response.data.status)
      if (response.data.status === "fail") {
              alert("error");
      }else{
        localStorage.removeItem('token'); //로그아웃
        localStorage.removeItem('signdata'); // signdata 삭제
        localStorage.removeItem('email'); // email 삭제
        localStorage.removeItem('nickname'); // nickname 삭제
        localStorage.removeItem('likedList'); // localstorage likedList 삭제
        alert("회원탈퇴되었습니다.");
        navigate("/");
        window.location.reload();
      }
    })
    }else{
    }
  }
  const changePassword = () => {
  if (!isPasswordValid) {
      alert("영문, 숫자, 특수기호 조합으로 10자리 이상 입력해주세요.");
      return;
  } else if (passwordCheck !== password) {
      alert("입력하신 비밀번호가 잘못되었습니다.");
      return;
  }else {
    const confirmed = window.confirm("입력하신 비밀번호로 변경하시겠습니까?");
    if (confirmed) {
      axios.post("https://blue.kku.ac.kr:5050/passwordChange.php", {
          "email": userData.email,
          "password": password,
    })
    .then(function (response) {
      console.log(JSON.stringify(response));
      console.log(response.data.status)
      if (response.data.status === "fail") {
              alert("error");
      }
      else {
          alert("비밀번호가 변경되었습니다. 다시 로그인해주세요");
          localStorage.removeItem('token'); //로그아웃
          localStorage.removeItem('signdata'); // signdata 삭제
          localStorage.removeItem('email'); // email 삭제
          localStorage.removeItem('nickname'); // nickname 삭제
          localStorage.removeItem('likedList'); // localstorage likedList 삭제
          navigate("/login");
      }
      })
      .catch(function (error) {
          console.log(error);
      });
  }}
  }
  

  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper className={className} tapIndex="-1" visible={visible}>
        <ModalInner tapIndex="0" className="modal-inner" style={{height:modalHeight}}>
          <ContentTitle>My profile</ContentTitle>
          <ImageContainer>
            <div style={{display: 'flex',alignItems: 'center' }}>
              <img className='mypage-user-img'style={{display: 'flex',marginLeft:"20px",marginTop:"20px"}} src={ userData && userData.img_route !== "" ?process.env.PUBLIC_URL + userData.img_route : "/img/EmptyUser.jpg"}/>
            <label className="file-input-button" style={{border: '0',borderRadius: '30px',display:'flex'}}>
              <input type="file" onChange={handleImageChange} style={{display: 'none'}}/>
                <CameraIcon style={{position: 'absolute',left:'33%',top:top, width: '50px', height: '40px' ,cursor:'pointer'}}/>
            </label>
                <UserWithdrawal onClick={withDrawal}>회원 탈퇴</UserWithdrawal>
            </div>
            <div style={{ marginLeft: '30px', verticalAlign: 'top' }}>
              <span style={{ fontWeight: 'normal',fontFamily:'SC Dream 4', fontSize: '24px', color: '#ececec',marginTop:'30px',display:'block'}}>nickname: {user}</span><br/>
              <span style={{ fontWeight: 'normal', fontFamily: 'SC Dream 4', fontSize: '24px', color: '#ececec',display:'block' }}>email: {userData.email}</span>  
            </div>
          </ImageContainer>
          <ButtonContainer>
            {isButtonVisible && (
              <div style={{ display: 'flex', flexDirection: 'row'}}>
                <NicknameButton onClick={onClickNickButton}>닉네임 변경</NicknameButton>
                <PasswordButton onClick={onClickpwButton}>비밀번호 변경</PasswordButton>
              </div>
            )}
          </ButtonContainer>
          {modalNickIsOpen && (
            <div>
              <InputPassword style={{ width: '400px'}} type='text' placeholder="nickname" onChange={onChangeNickname} value={nickname}/>
              <div style={{ display:'flex'}}>
                <PwCheck style={{marginLeft: '30px', width: '190px'}} onClick={onChangeNicknameCheck}>중복 확인</PwCheck>
                <PwCheck style={{marginLeft: '25px', width: '190px'}} onClick={changeNickname}>확인</PwCheck>
              </div>
            </div>
          )}
          {modalpwIsOpen && (
            <div>
              <div style={{ display:'flex'}}>
                <InputPassword style={{ width: '400px'}} type='password' placeholder="Password" onChange={onChangePassword} value={password}/>
                </div>
            <div style={{ display:'flex'}}>
              <InputPassword type='password' placeholder="Password-check" onChange={onChangePasswordCheck} value={passwordCheck}/>
              <PwCheck style={{ width: '63px'}} onClick={changePassword}>확인</PwCheck>
            </div>
          </div>
          )}
          <CloseButton onClick={handleClose}><CloseIcon/></CloseButton>
        </ModalInner>
      </ModalWrapper>
    </>
  );
}

NextProfileModal.propTypes = {
  visible: PropTypes.bool,
};
const UserWithdrawal = styled.div`
    font-family: "SC Dream 4";
    font-size: 15px;

    border: 0;
    border-radius: 30px;
    background-color: #ececec;

    width: 80px;
    height: 25px;

    text-align: center;

    cursor:pointer;

    margin-bottom:90px;
    margin-left:150px;
`
// Add your styled components here for NextModal
const PwCheck = styled.div`
border-style: solid;
    border-color: transparent;

    
    margin-top: 20px;
    margin-left: 12px;
    display: flex;
    justify-content: center;
    align-items: center;

    background: rgb(123, 46, 187);
    font-family: "SC Dream 6";
    font-size: 15px;
    color: rgba(250,250,250,1);

    border-radius: 10px;
    width: 60px;
    height: 55px;
    cursor: pointer;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`


const NicknameButton = styled.div`
border-style: solid;
    border-color: transparent;

    position: relative;
    margin-top: 18px;
    margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    background: rgb(123, 46, 187);
    font-family: "SC Dream 6";
    font-size: 20px;
    color: rgba(250,250,250,1);

    border-radius: 10px;
    width: 170px;
    height: 55px;
    cursor: pointer;
`

const PasswordButton = styled.div`
border-style: solid;
    border-color: transparent;

    position: relative;
    margin-top: 18px;
    margin-left: 65px;
    display: flex;
    justify-content: center;
    align-items: center;

    background: rgb(123, 46, 187);
    font-family: "SC Dream 6";
    font-size: 20px;
    color: rgba(250,250,250,1);

    border-radius: 10px;
    width: 170px;
    height: 55px;
    cursor: pointer;
`

const ModalWrapper = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? "block" : "none")};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    overflow: auto:
    outline: 0;
`
const ImageContainer = styled.div`
  margin-top: 20px;
  margin-left: 20px;
  width: 440px;
  height: 300px;
  background-color: #3c4751;
  border-radius: 5%;
`;
const ModalOverlay = styled.div`
    box-sizing: border-box;
    display: ${(props) => (props.visible ? "block" : "none")};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
`

const ModalInner = styled.div`
    box-sizing: border-box;
    position: relative;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
    background-color: #252D36;
    border-radius: 5px;
    width: 519px;
    max-width: 519px;
    max-height: 721px; 
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
`
const InputPassword = styled.input`
    border-style: solid;
    border-color: transparent;

    position: relative;
    margin-left: 30px;
    margin-top: 20px;

    border-radius: 10px;
    width: 320px;
    height: 55px;

    background: rgb(57, 63, 70);

    padding-left: 14px;
    text-align: left;
    font-size: 20px;
    color: #ececec;

    &:focus {
        border-style: solid;
        border-color: transparent;

        outline: #ececec;
        outline-style: solid;
        outline-width: 3px;
    }

    &:placeholder {
        color:rgba(172, 172, 172, 1);
        font-family: "SC Dream 4";
    }
`
const CloseButton = styled.div`
position: absolute;
top: 2%;
right: 0%;

width: 26px;
height: 26px;
margin-top: 40px;
margin-right: 50px;
cursor: pointer;
`;

const ContentTitle = styled.div`
    padding-left: 30px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 30px;
    color: #ececec;
`
export default NextProfileModal;
