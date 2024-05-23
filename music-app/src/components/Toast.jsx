import { useState, useEffect } from "react";
import './Toast.css'

function Toast({ setToast, text }) {
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        console.log('toast')
        setFadeIn(true);
        let timer = setTimeout(() => {
            // 2초 뒤, 토스트가 false가 되면서 알림창이 사라진다
            setFadeIn(false);
            setTimeout(() => {
                setToast(false);
            }, 500);
        }, 1500);

        return () => { clearTimeout(timer) }


    }, [setToast]);
    

    return (
        <div className={fadeIn ? "fade-in" : "fade-out"}>
            <div className="toast">
                <p className="toast-text">{text}</p>
            </div>
        </div>
    );
}

export default Toast;