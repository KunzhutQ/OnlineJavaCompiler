import React, {useReducer} from 'react';
import {Button} from "react-bootstrap";


function getCookieValue(cookieToSearch, onNull){

    const a = document.cookie.match(new RegExp('(?<='+ cookieToSearch + '=)[^;]{1,}'))
    return a!==null ? a[0] : onNull;
}
function CookiesNotification(){
       const [state,action]=useReducer(()=>getCookieValue('acceptCookies'), getCookieValue('acceptCookies'));

    return(
        <>
            {state!=="1" ?
         <div className={'cookieNotifyWindow'}>
             <span>This site using cookies for better coding experience.</span>
             <div className={'gradientButton'} onClick={(e)=>{
                 document.cookie='acceptCookies=1';
                 action();
             }}>Got it!</div>
         </div> : <></> }
        </>
    );
}

export default CookiesNotification;
export {getCookieValue};