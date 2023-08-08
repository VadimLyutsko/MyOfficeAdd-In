import * as React from 'react';
import {DefaultButton} from '@fluentui/react';
import HeroList, {HeroListItem} from '../taskpane/components/HeroList';
import Progress from '../taskpane/components/Progress';
import {useAppDispatch, useAppSelector} from './store';
import {setHeroListPayloadAC} from '../heroList-reducer';
import {setRequestPayloadAC} from '../request-reducer';
import {gptTC} from '../api/openAI-reducer';


export type AppProps = {
    title: string;
    isOfficeInitialized: boolean;
    listItems: HeroListItem[];
}


export const MyApp: React.FC<AppProps> = ({title, isOfficeInitialized}) => {
    const dispatch = useAppDispatch()
    const listItems = useAppSelector(state => state.heroList.listItems)
    const requestData = useAppSelector(state => state.request.requestData)
    const openAIRequestData = useAppSelector(state => state.openAIRequestData)

    const InsertParagraphClick = async () => {
        return Word.run(async (context) => {
            /**
             * Insert your Word code here
             */

                // insert a paragraph at the end of the document.
            const paragraph = context.document.body.insertParagraph('My new paragraph width my text. Lyutsko', Word.InsertLocation.start);

            // change the paragraph color to blue.
            paragraph.font.color = 'black';
            dispatch(setHeroListPayloadAC())
            await context.sync();
        });
    };

    const requestClickHandler = async () => {
        return Word.run(async (context) => {
// Ниже я выхватываю выделенные в тексте слова
            Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
                if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                    write('Action failed. Error: ' + asyncResult.error.message);
                } else {
                    if (typeof asyncResult.value === 'string') {

                        dispatch(setRequestPayloadAC(asyncResult.value))
                    }
                    // Здесь я их запоминаю
                    write(
                        asyncResult.value);
                }
            });

//Ниже я вставляю их в нужное мне место в надстройке по Id
            function write(message) {
                document.getElementById('message').innerText += message;
                dispatch(gptTC(message))
            }

            // Беру уже задиспатченный текст из стейта (который до этого был выделен в ворде и вставляю).
            const paragraph = context.document.body.insertParagraph(requestData, Word.InsertLocation.start);

            // Меняю цвет, тут все ясно.
            paragraph.font.color = 'green';
            dispatch(setHeroListPayloadAC())

            await context.sync();

        });

    }

    // const requestHandler = () => {
    //     dispatch(gptTC())
    // }

    const exampleClickHandler = async () => {
        return Word.run(async (context) => {
            /**
             * Insert your Word code here
             */

                // insert a paragraph at the end of the document.
            const paragraph = context.document.body.insertParagraph(openAIRequestData.choices[0].text, Word.InsertLocation.start);

            // change the paragraph color to blue.
            paragraph.font.color = 'cadetblue';
            dispatch(setHeroListPayloadAC())
            await context.sync();
        });
    };













// To initialize or onReady function is required for all add-ins.
//     Office.initialize = function (reason) {
    Office.initialize = function () {

        // Checks for the DOM to load using the jQuery ready method.
        $(document).ready(function () {

            // Run sendFile when Submit is clicked.
            $('#submit').click(function () {
                sendFile();
            });

            // Update status.
            updateStatus("Ready to send file.");
        });
    }

// Create a function for writing to the status div.
    function updateStatus(message) {
        let statusInfo = $('#status');
        statusInfo[0].innerHTML += message + "<br/>";
    }

// Get all the content from a PowerPoint or Word document in 100-KB chunks of text.
    function sendFile() {
        Office.context.document.getFileAsync(Office.FileType.Compressed,
            { sliceSize: 100000 },
            function (result) {

                if (result.status === Office.AsyncResultStatus.Succeeded) {

                    // Get the File object from the result.
                    let myFile = result.value;
                    let state = {
                        file: myFile,
                        counter: 0,
                        sliceCount: myFile.sliceCount
                    };

                    updateStatus("Getting file of " + myFile.size + " bytes");
                    getSlice(state);
                } else {
                    updateStatus(result.status);
                }
            });
    }

// Get a slice from the file and then call sendSlice.
    function getSlice(state) {
        state.file.getSliceAsync(state.counter, function (result) {
            if (result.status == Office.AsyncResultStatus.Succeeded) {
                updateStatus("Sending piece " + (state.counter + 1) + " of " + state.sliceCount);
                sendSlice(result.value, state);
            } else {
                updateStatus(result.status);
            }
        });
    }

    // Моя функция для декодированния
    function myEncodeBase64(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(
            atob(str)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join(""),
        );
    }

    // b64DecodeUnicode("4pyTIMOgIGxhIG1vZGU="); // "✓ à la mode"
    // b64DecodeUnicode("Cg=="); // "\n"

    function sendSlice(slice, state) {
        let data = slice.data;

        // If the slice contains data, create an HTTP request.
        if (data) {

            // Encode the slice data, a byte array, as a Base64 string.
            // NOTE: The implementation of myEncodeBase64(input) function isn't
            // included with this example. For information about Base64 encoding with
            // JavaScript, see https://developer.mozilla.org/docs/Web/JavaScript/Base64_encoding_and_decoding.
            let fileData = myEncodeBase64(data);

            // Create a new HTTP request. You need to send the request
            // to a webpage that can receive a post.
            let request = new XMLHttpRequest();

            // Create a handler function to update the status
            // when the request has been sent.
            request.onreadystatechange = function () {
                if (request.readyState == 4) {

                    updateStatus("Sent " + slice.size + " bytes.");
                    state.counter++;

                    if (state.counter < state.sliceCount) {
                        getSlice(state);
                    } else {
                        closeFile(state);
                    }
                }
            }

            request.open("POST", "[Your receiving page or service]");
            request.setRequestHeader("Slice-Number", slice.index);

            // Send the file as the body of an HTTP POST
            // request to the web server.
            request.send(fileData);
        }
    }

    function closeFile(state) {
        // Close the file when you're done with it.
        state.file.closeAsync(function (result) {

            // If the result returns as a success, the
            // file has been successfully closed.
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                updateStatus("File closed.");
            } else {
                updateStatus("File couldn't be closed.");
            }
        });
    }
















    if (!isOfficeInitialized) {
        return (
            <Progress
                title={title}
                logo={require('../../assets/logoMy.jpg')}
                message="Please sideload your addin to see app body."
            />
        );
    }

    return (
        <div className="ms-welcome">

            {/*<Header logo={require('../../assets/logoMy.jpg')} title={title} message="Hello, Kirill!"/>*/}
            <HeroList message="Self-made Office add-in" items={listItems}>

                {/*<p className="ms-font-l">*/}
                {/*    Нажми <b>Запрос на сервер</b> чтобы послать запрос*/}
                {/*</p>*/}

                {/*<DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}*/}
                {/*               onClick={requestClickHandler}>*/}
                {/*    Check text*/}
                {/*</DefaultButton>*/}


                {/*<p className="ms-font-little">*/}
                {/*    /!*Нажми *!/*/}
                {/*    /!*<b>Вставить исправленный вариант</b>*!/*/}
                {/*    Вставить исправленный вариант*/}
                {/*    /!*чтобы вставить ответ на запрос*!/*/}
                {/*</p>*/}

                {/*<DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}*/}
                {/*               onClick={exampleClickHandler}>*/}
                {/*    Вставить исправленный вариант*/}
                {/*</DefaultButton>*/}
                <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                               onClick={sendFile}>
                    sendFile
                </DefaultButton>
                sendFile
            </HeroList>
            <div className="myDivAddIn" id={'message'}>
                {/*<p> У околицы села, весь в кучевых облаках и отраженном камыше, лениво курился пруд. Ярко зелеными*/}
                {/*    клубами поднимались из земли ветлы. Одна ветла низпадала в пруд и теперь по ней можно было ходить. В*/}
                {/*    большом пруде она потерялась, утратила свое горделивое величие, её хватило только на то, что бы*/}
                {/*    достать верхушкой до того места, где кончались прибрежные камыши.*/}
                {/*</p>*/}
                {/*<p> Прочные досчатые мостики с перильцами уводили от берега на глубину при которой не видно дна, хотя*/}
                {/*    мне*/}
                {/*    никогда не приходилось встречать пруда, со столь чистой прозрачной водой. Это не мешало впрочем*/}
                {/*    водится*/}
                {/*    тут всякой живности. </p>*/}

                <div id='status'></div>

                {/*<p>Вот пробирается, ползет по подводному стеблю ногатое <span className="mySpanInMyDiv">,</span> усатое*/}
                {/*    существо, похожее на макрицу. Это*/}
                {/*    водяной*/}
                {/*    ослик. А вот причудливо, завитушками вниз, скользит по поверхности воды <span*/}
                {/*        className="mySpanInMyDiv">улитка</span> прудовик. Для неё*/}
                {/*    поверхность воды <span className="mySpanInMyDiv">-</span> потолок, она и движется по нему, как бы*/}
                {/*    вниз головой. Отделившись от черной глубины <span className="mySpanInMyDiv">,</span>*/}
                {/*    несется, как стрела, снарядик. Это ничто иное, как тигр подводных джунглей - жук-пловунец <span*/}
                {/*        className="mySpanInMyDiv">-</span>. Он*/}
                {/*    бросается*/}
                {/*    на рыбу <span className="mySpanInMyDiv">,</span> гигантскую по сравнению с ним, и подчас одолевает*/}
                {/*    её. А если и не одолеет один, то запах*/}
                {/*    крови*/}
                {/*    <span className="mySpanInMyDiv">соберет</span> армию собратьев, и тогда уж рыбе быть расстерзанной.*/}
                {/*</p>*/}

                {/*<p>Словно шарик ртути, пролитой на стекло, <span className="mySpanInMyDiv">изумрудно</span>-черные,*/}
                {/*    катаются и юлят вертячки. Как <span className="mySpanInMyDiv">циркачи</span> на*/}
                {/*    резиновой сетке, пляшут на упругой поверхности воды водомерки. </p>*/}

                {/*<p> К пруду подошла с карзиной женщина и стала поласкать белье невдалеке от нас. Она рассказала, что*/}
                {/*    пруд*/}
                {/*    совсем, было, зарос, но в прошлом году его эскаватором рассчистили. «Омолодился пруд-то, наш», -*/}
                {/*    сказала*/}
                {/*    женщина. </p>*/}

                {/*<p>Две девочки и мальченка-бутуз, все трое русоголовые, синеглазые забрались на упавшую ветлу, и затеяли*/}
                {/*    там игру. В последствие мальченка-бутуз свалился в воду, после чего ему было приказанно сидеть на*/}
                {/*    берегу. </p>*/}

                {/*<p> День начался. Мы уложили вещи, и двинулись в глубь леса. </p>*/}

            </div>

        </div>
    );

}
