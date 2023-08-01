import * as React from 'react';
import {DefaultButton} from '@fluentui/react';
import HeroList, {HeroListItem} from '../taskpane/components/HeroList';
import Progress from '../taskpane/components/Progress';
import {useAppDispatch, useAppSelector} from './store';
import {setHeroListPayloadAC} from '../heroList-reducer';
import {setRequestPayloadAC} from '../request-reducer';
import {fetchJokeTC} from '../api/someExampleAPI-reducer';

/* global Word, require */

export type AppProps = {
    title: string;
    isOfficeInitialized: boolean;
    listItems: HeroListItem[];
}


export const MyApp: React.FC<AppProps> = ({title, isOfficeInitialized}) => {
    const dispatch = useAppDispatch()
    const listItems = useAppSelector(state => state.heroList.listItems)
    const requestData = useAppSelector(state => state.request.requestData)
    const catFact = useAppSelector(state => state.exampleCatData)

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
            }

            // Беру уже задиспатченный текст из стейта (который до этого был выделен в ворде и вставляю).
            const paragraph = context.document.body.insertParagraph(requestData, Word.InsertLocation.start);

            // Меняю цвет, тут все ясно.
            paragraph.font.color = 'green';
            dispatch(setHeroListPayloadAC())
            await context.sync();

        });

    }


    // При вызове диспатчим санку - делаем запрос, а ответ сохраняем в наш стейт (в Redux)
    const exampleRequest = () => {
        const thunk = fetchJokeTC()
        dispatch(thunk)
        // dispatch(fetchJokeTC())
    }
    // При вызове вставляем полученный ответ из нашего стейта (из Redux)
    const exampleClickHandler = async () => {
        return Word.run(async (context) => {
            /**
             * Insert your Word code here
             */

                // insert a paragraph at the end of the document.
            const paragraph = context.document.body.insertParagraph(catFact.fact, Word.InsertLocation.start);

            // change the paragraph color to blue.
            paragraph.font.color = 'cadetblue';
            dispatch(setHeroListPayloadAC())
            await context.sync();
        });
    };


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
                {/*    Click <b>Insert Paragraph</b> to insert it*/}
                {/*</p>*/}

                {/*<DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}*/}
                {/*               onClick={InsertParagraphClick}>*/}
                {/*    Проверить работу Redux*/}
                {/*</DefaultButton>*/}

                {/*<p className="ms-font-l">*/}
                {/*    Нажми <b>ухваить</b> чтобы выхватить текст из документа*/}
                {/*</p>*/}

                {/*<DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}*/}
                {/*               onClick={requestClickHandler}>*/}
                {/*    Ухваить*/}
                {/*</DefaultButton>*/}


                <p className="ms-font-l">
                    Нажми <b>Запрос на сервер</b> чтобы послать запрос
                </p>

                <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                               onClick={exampleRequest}>
                    Запрос на сервер
                </DefaultButton>


                <p className="ms-font-l">
                    Нажми <b>Вставить ответ</b> чтобы вставить ответ на запрос
                </p>

                <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                               onClick={exampleClickHandler}>
                    Вставить ответ
                </DefaultButton>

            </HeroList>
            <div id={'message'} style={{
                width: '75%',
                backgroundColor: '#d9d5af',
                height: '25vh',
                margin: '50px auto',
                padding: '25px'
            }}></div>

        </div>
    );

}
