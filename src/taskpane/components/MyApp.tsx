import * as React from 'react';
import {ActionButton, DefaultButton} from '@fluentui/react';
import Header from './Header';
import HeroList, {HeroListItem} from './HeroList';
import Progress from './Progress';
import {CustomButton} from './customButton/CustomButton';

/* global Word, require */

export type AppProps = {
    title: string;
    isOfficeInitialized: boolean;
    listItems: HeroListItem[];
}

export type AppState = {
    listItems: HeroListItem[];
}


// export default class MyApp extends React.F<AppProps, AppState> {
export const MyApp: React.FC<AppProps> = ({title, isOfficeInitialized, listItems}) => {
    // isOfficeInitialized=false
    listItems = [

    ]

    // componentDidMount() {
    //     this.setState({
    //         listItems: [
    //             {
    //                 icon: 'Ribbon',
    //                 primaryText: 'My primaries',
    //             },
    //             // {
    //             //   icon: "Unlock",
    //             //   primaryText: "Unlock features and functionality",
    //             // },
    //             // {
    //             //   icon: "Design",
    //             //   primaryText: "Create and visualize like a pro",
    //             // },
    //         ],
    //     });
    // }

    const InsertParagraphClick = async () => {
        return Word.run(async (context) => {
            /**
             * Insert your Word code here
             */

                // insert a paragraph at the end of the document.
            const paragraph = context.document.body.insertParagraph('My new paragraph width my text. Lyutsko', Word.InsertLocation.start);

            // change the paragraph color to blue.
            paragraph.font.color = 'black';

            await context.sync();
        });
    };

    // ApplyStyleClick = async () => {
    //
    //     // document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);
    //
    //
    //     await Word.run(async (context) => {
    //
    //         // TODO1: Queue commands to style text.
    //         const firstParagraph = context.document.body.paragraphs.getFirst();
    //         firstParagraph.style = 'Выделенная цитата';
    //
    //         await context.sync();
    //     });
    // }
    //
    // ApplyCustomStyleClick = async () => {
    //
    //     // document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);
    //
    //
    //     await Word.run(async (context) => {
    //
    //         // TODO1: Queue commands to apply the custom style.
    //         const lastParagraph = context.document.body.paragraphs.getLast();
    //         lastParagraph.style = 'MyCustomStyle';
    //
    //         await context.sync();
    //     });
    // }
    //
    // ChangeFontClick = async () => {
    //
    //     // document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);
    //
    //
    //     await Word.run(async (context) => {
    //
    //
    //         // TODO1: Queue commands to apply a different font.
    //         const secondParagraph = context.document.body.paragraphs.getFirst().getNext();
    //         secondParagraph.font.set({
    //             name: 'Courier New',
    //             bold: true,
    //             size: 24,
    //             color: 'yellow'
    //         });
    //
    //         await context.sync();
    //     });
    // }

    const myOnClick = async () => {

    }


    if (!isOfficeInitialized) {
        return (
            <Progress
                title={title}
                logo={require('./../../../assets/logo-filled.png')}
                message="Please sideload your addin to see app body."
            />
        );
    }

    return (
        <div className="ms-welcome">

            {/*<Header logo={require('./../../../assets/logoMy.jpg')} title={title} message="Hello, Kirill!"/>*/}
            <HeroList message="Self-made Office add-in" items={listItems}>

                <p className="ms-font-l">
                    Click <b>Insert Paragraph</b> to insert it
                </p>

                <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                               onClick={InsertParagraphClick}>
                    Insert Paragraph
                </DefaultButton>

            </HeroList>

        </div>
    );

}
