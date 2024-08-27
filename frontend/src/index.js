import React, {useReducer} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import NavigationBar from "./NavigationBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import CodeInputOutputFields from "./CodeInputOutputFields";
import CookiesNotification, {getCookieValue} from "./usingCookiesNotify";

function Main() {
    const [state,action] = useReducer((state,action)=>action, getCookieValue('theme', 'dark'));

    return (
        <>
             <div theme={state} style={{position:"absolute",width:'100vw',height:'100vh', overflowY: "scroll"}} className={'generalColor'}>

                 <NavigationBar currTheme={state} setTheme={()=>{
                     const s = state === 'dark' ? 'light' : 'dark';
                     document.cookie='theme='+s;
                     action(s);
                 }}/>
                 <CodeInputOutputFields currTheme={state === 'dark' ? '#2b3035' : '#f1f1f1'}/>

                 <CookiesNotification/>
             </div>
        </>

    );

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Main/>
);

