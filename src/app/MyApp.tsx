import * as React from 'react';
import {DefaultButton} from '@fluentui/react';
import HeroList, {HeroListItem} from '../taskpane/components/HeroList';
import Progress from '../taskpane/components/Progress';
import {useAppDispatch, useAppSelector} from './store';
import {setHeroListPayloadAC} from '../heroList-reducer';
import context = Office.context;
import {setRequestPayloadAC} from '../request-reducer';

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
            paragraph.font.color = 'blue';
            dispatch(setHeroListPayloadAC())
            await context.sync();

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

                <p className="ms-font-l">
                    Click <b>Insert Paragraph</b> to insert it
                </p>

                <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                               onClick={InsertParagraphClick}>
                    Insert Paragraph
                </DefaultButton>

                <p className="ms-font-l">
                    Нажми <b>ухваить</b> чтобы выхватить текст из документа
                </p>

                <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                               onClick={requestClickHandler}>
                    Ухваить
                </DefaultButton>

            </HeroList>
            <div id={'message'}></div>

        </div>
    );

}