import React, { useCallback, useState} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import axios from 'axios';

import { ReactComponent as CloseIcon } from "../assets/imgs/BigClose.svg";


function PasswordResetModal({ className, onClose, visible }) {
    const handleClose = () => {
        onClose?.();
    };
    const [email,setEmail] = useState("");
    const onChangeEmail = useCallback(async (e) => {
    const currEmail = e.target.value;
    setEmail(currEmail);
}, []);

    const sendEmail = useCallback(() => {
        axios.post("https://blue.kku.ac.kr:5050/PasswordReset.php", {
            "email": email
    })
    .then(function (response) {
        console.log(JSON.stringify(response));
        console.log(response.data.status)
        if (response.data.status === "login") {
            alert("이메일이 확인되었습니다. 메일로 임시비밀번호 발송하였습니다");
            onClose?.();
        }
        else {
            alert("이메일을 다시 확인해주세요");
        }
    }
    )
})
    return (
        <>
            <ModalOverlay visible={visible} />
            <ModalWrapper className={className} tapIndex="-1" visible={visible}>
                <ModalInner tapIndex="0" className="modal-inner">
                    <ContentTitle>비밀번호 찾기</ContentTitle>
                    <CloseButton onClick={handleClose}>
                        <CloseIcon/>
                    </CloseButton>
                    <InputEmail placeholder="이메일 입력" onChange={onChangeEmail} value={email}/>
                    <SendEmailButton onClick={sendEmail}>메일 전송하기</SendEmailButton>
                </ModalInner>
            </ModalWrapper>
        </>
    )
}





PasswordResetModal.propTypes = {
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
    width: 519px;
    max-width: 519px;
    height: 330px;
    max-height: 701px; 
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
    padding: 40px 20px;
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
    margin-top: 4px;
    padding-left: 30px;
    text-align: left;
    font-family: "SC Dream 6";
    font-size: 24px;
    color: #cecece;
`

const InputEmail = styled.input`
    border-style: solid;
    border-color: transparent;

    position: relative;
    margin-left: 30px;
    margin-top: 50px;

    border-radius: 10px;
    width: 400px;
    height: 55px;

    background: rgb(57, 63, 70);

    padding-left: 14px;
    text-align: left;
    font-size: 20px;
    font-family: "SC Dream 4";
    color: #ececec;

    &:focus {
        border-style: solid;
        border-color: transparent;

        outline: #ececec;
        outline-style: solid;
        outline-width: 3px;
    }
`

const SendEmailButton = styled.button`
    border-style: solid;
    border-color: transparent;

    position: relative;
    margin-top: 30px;
    margin-left: 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    background: rgb(123, 46, 187);
    font-family: "SC Dream 6";
    font-size: 20px;
    color: rgba(250,250,250,1);

    border-radius: 10px;
    width: 420px;
    height: 55px;
    cursor: pointer;
`

export default PasswordResetModal