import React, {useReducer, useRef} from "react";
import {Button} from "react-bootstrap";
import {defaultCode} from "./defaultInput";
import {getCookieValue} from "./usingCookiesNotify";

function RunSnippet() {
    return (
        <div style={{display: "flex"}}>
            <div className={'triangle'}></div>
            Run
        </div>
    );
}

function Text(p) {
    return(
         <p style={{marginBottom: p.bottomIndent}}>
                {p.children.toString()}
         </p>
    );
}
function getCurrRowCount(string){
     let rowCount=1;

     for(let a =0; a<string.length; a++) if(string[a]==='\n') rowCount++

      return rowCount

}

const regexes = [
    {r: /["'][^"'\n]*["']|["'].*/g, c: "s"},
    {r: /(?<!["'].*)\/\/.*|\/\/(?!.*["']).*/g, c: "co"},
    {r: /[{}]/g, c: "fB"},
    {r: /[()]/g, c: "br"},
    {r: /(?<![^\s])(new|return|void|final|public|private|protected|class|synchronized|static|import|instanceof)(?![^\s])/g, c: "kW"},
    {r: /(?<![^\s])(if|for|while|switch|case|default)(?![^\s(])/g, c: "oP"},
    {r: /(?<=&lt;).(?=>)/g, c: "g"}

];
function highlightText(str, index){

    const i = index===undefined ? 0 : index+1;
    return index===regexes.length-1 ? str : highlightText(str.replace(regexes[i].r, match => `<span class="${regexes[i].c} e">${match}</span>`),i)
}

async function saveCodeLines(code){
    document.cookie='CodeLines='+encodeURIComponent(code);
}
function TextAreaCodeInputOutput(params){
    const [state,action]=useReducer((state,action)=>action, null)
    const rowWithNumbersRef = useRef(null)
    const lensRef = useRef(null)
    const SaveToCookieCheckBox = useRef(null)
    const rowCount = useRef(getCurrRowCount(params.defaultValue))

    return(
        <>
            <Text bottomIndent={'1vh'}>{params.title}</Text>

            <div style={{width: '100%', height: '100%', position: "absolute", display: "flex", flexDirection: "row"}}>

                {params.saveCodeLinesCheckBox ? <form className={'form-checkbox'}>
                    <span>Save Code Field to cookie</span>
                    <input ref={SaveToCookieCheckBox} defaultChecked={getCookieValue('saveLines') === 'true'} type={"checkbox"} onChange={(e) => {
                        if(!e.target.checked) document.cookie='CodeLines='
                        document.cookie = 'saveLines=' + e.target.checked
                    }}/>
                </form> : <></> }

                {params.needRowsWithNumbers ? <div className={'rows_with_numbers'} ref={rowWithNumbersRef}
                                                   style={{backgroundColor: params.theme}}>{function () {
                    const arr = new Array(getCurrRowCount(params.defaultValue))
                    for (let a = 0; a < arr.length; a++) arr[a] = a + 1;
                    return arr.toString().replaceAll(',', '\n')
                                                   }()}</div> : <></>}

                <div className={'innerContainer'}>

                    {params.highlight ? <div ref={lensRef} className={'lens'}
                                             dangerouslySetInnerHTML={{__html: highlightText(params.defaultValue)}}></div> : <></>}

                    <textarea ref={params.inputAreaRef} onInput={(e) => {

                        lensRef.current.innerHTML = highlightText(e.currentTarget.value.replace(/[<&]/g, m => m === '<' ? "&lt;" : "&amp;"))

                        const cr = getCurrRowCount(e.currentTarget.value)

                        if (cr > rowCount.current) {
                            const rowNumArr = new Array(cr - rowCount.current)

                            for (let a = 0; a < rowNumArr.length; a++) rowNumArr[a] = rowCount.current += 1

                            if (rowNumArr.length !== 0) rowWithNumbersRef.current.textContent += '\n' + rowNumArr.toString().replaceAll(',', '\n')

                        } else if (cr < rowCount.current) {
                            let bound = 0;
                            if (rowCount.current - cr === 1) bound = rowWithNumbersRef.current.textContent.lastIndexOf('\n')
                            else for (let a = 1; a <= cr; a++) {
                                bound = rowWithNumbersRef.current.textContent.indexOf('\n', bound + 1)
                            }
                            rowCount.current = cr
                            rowWithNumbersRef.current.textContent=rowWithNumbersRef.current.textContent.substring(0, bound)
                        }

                        if (SaveToCookieCheckBox.current.checked) saveCodeLines(e.currentTarget.value)

                    }} onKeyDown={params.disabled ? e => e.preventDefault() : null} onScroll={params.needRowsWithNumbers ? (e) => {
                                  rowWithNumbersRef.current.scrollTop = e.currentTarget.scrollTop
                                  lensRef.current.scrollTop = e.currentTarget.scrollTop
                              } : null} className={'textAreaInputOutputCode'}
                              style={{backgroundColor: params.theme, color: params.highlight ? 'rgba(0,0,0,0%)' : null}}
                              defaultValue={params.defaultValue}></textarea>

                </div>

            </div>

        </>
    );
}

function CodeInputOutputFields(params) {
    const [state, action] = useReducer((state, action) => action, '')
    const textAreaRef = useRef(null)

    return (
        <>

            <div style={{marginTop: '1.5%'}}>

                <div className={'textAreaContainer'} style={{left: '2%', width: '52%'}}>

                    <TextAreaCodeInputOutput saveCodeLinesCheckBox highlight inputAreaRef={textAreaRef} needRowsWithNumbers title={'Code:'} theme={params.currTheme} defaultValue={getCookieValue('saveLines')==='true' ?
                        decodeURIComponent(getCookieValue('CodeLines', defaultCode)) : defaultCode}/>
                </div>

                <div className={'textAreaContainer'} style={{right: '2%', width: '40%'}}>
                    <Button onClick={(e) => {
                        const target = e.currentTarget
                         const ch = target.children[0]
                           target.disabled=true
                           target.textContent='Process...'
                       fetch(window.location.origin+'/JavaCompiler/CodeEditor',{method: 'POST', headers: {'Content-Type': 'application/json'},
                           body: JSON.stringify({sourceCode: textAreaRef.current.value})})
                           .then(fulfilled=>fulfilled.text(),reject=>null)
                           .then((result)=>{
                               target.disabled=false
                               target.replaceChildren(ch)
                               action(result !== null ? JSON.parse(result).result : 'Error occurred, reload page and try again')
                           })
                     }} className={'d-flex'} style={{position:"absolute",right:0, top:'-0.5%'}} variant={"primary"} size={"sm"}><RunSnippet/></Button>
                    <TextAreaCodeInputOutput disabled title={'Output:'} theme={params.currTheme} defaultValue={state}/>
                </div>

            </div>
        </>
    );
}

export default CodeInputOutputFields