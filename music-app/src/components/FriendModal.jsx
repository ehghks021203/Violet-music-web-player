import React, { useEffect ,useCallback, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'
import styled from 'styled-components'
import axios from 'axios';
import { ReactComponent as Add } from "../assets/imgs/Add.svg";
import { ReactComponent as CloseIcon } from "../assets/imgs/Close.svg";



function MypageProfileModal({ className, onClose, visible }) {
    const handleClose = () => {
        onClose?.();
    };
    const [nickname,setNickname] = useState("");
    const onChangePassword = useCallback(async (e) => {
    const currNickname = e.target.value;
    setNickname(currNickname);
}, []);

    
    const onSubmitSearch = (e) => {
        if (e.key === "Enter") {
          sendPassword();
        }
    };

    const sendPassword = useCallback(() => {
        const email = localStorage.getItem('email').replace(/^"(.*)"$/, '$1');
        if (!email) {
          // 이메일 값이 없는 경우에 대한 처리
          return;
        }
        axios.post("https://blue.kku.ac.kr:5050/friend.php", {
          "email": email,
          "nickname":nickname
        })
          .then(function (response) {
            console.log(JSON.stringify(response));
            console.log(response.data.status);
            if (response.data.message === "friend") {
              alert("친구 추가되었습니다.");
              handleClose();
              window.location.reload();
            }else if(response.data.message === "ifFriend"){
                alert("이미 친구 등록이 되어있습니다.");
                setNickname("");
            } 
            else {
                alert(nickname + "유저가 없습니다");
                setNickname("");
            }
          });
      }, [nickname]);
    
    

    return (
        <>
            <ModalOverlay visible={visible} />
            <ModalWrapper className={className} tapIndex="-1" visible={visible}>
                <ModalInner tapIndex="0" className="modal-inner">
                    <ContentTitle>친구 추가</ContentTitle>
                    <CloseButton onClick={handleClose}>
                        <CloseIcon />
                    </CloseButton>
                    <div style={{display: 'flex'}}>
                        <InputPassword type='text' placeholder="닉네임을 입력하세요" onChange={onChangePassword} onKeyPress={onSubmitSearch} value={nickname}/>
                        <CheckPasswordButton onClick={sendPassword}><Add /></CheckPasswordButton>
                    </div>
                </ModalInner>
            </ModalWrapper>
        </>
    )

    
}

MypageProfileModal.propTypes = {
    visible: PropTypes.bool,
}

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
    width: 290px;
    max-width: 519px;
    height: 150px;
    max-height: 701px; 
    top: 50%;
    transform: translateY(-50%);
    margin: 0 10px;
    padding: 40px 20px;
`

const CloseButton = styled.div`
    position: absolute;
    top: 2%;
    right: 0%;
    
    width: 10px;
    height: 13px;
    margin-top: 30px;
    margin-right: 40px;
    cursor: pointer;
`;

const ContentTitle = styled.div`
    margin-top: -15px;
    margin-left: 5px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 23px;
    color: #ececec;
`

const InputPassword = styled.input`
    border-style: solid;
    border-color: transparent;

    position: relative;
    margin-top: 25px;

    display: flex;
    border-radius: 10px;
    width: 190px;
    height: 40px;

    background: rgb(57, 63, 70);

    padding-left: 14px;
    text-align: left;
    font-size: 15px;
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

const CheckPasswordButton = styled.button`
    border-style: solid;
    border-color: transparent;

    margin-top: 20px;
    margin-left: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: transparent;
    width: 50px;
    height: 55px;
    cursor: pointer;
`

export default MypageProfileModal