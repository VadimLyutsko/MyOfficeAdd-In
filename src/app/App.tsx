import * as React from 'react';
import {ActionButton, DefaultButton} from '@fluentui/react';
import Header from '../taskpane/components/Header';
import HeroList, {HeroListItem} from '../taskpane/components/HeroList';
import Progress from '../taskpane/components/Progress';
import {CustomButton} from '../taskpane/components/customButton/CustomButton';

/* global Word, require */

export interface AppProps {
    title: string;
    isOfficeInitialized: boolean;
}

export interface AppState {
    listItems: HeroListItem[];
}

export default class App extends React.Component<AppProps, AppState> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            listItems: [],
        };
    }

    componentDidMount() {
        this.setState({
            listItems: [
                {
                    icon: 'Ribbon',
                    primaryText: 'My primaries',
                },
                // {
                //   icon: "Unlock",
                //   primaryText: "Unlock features and functionality",
                // },
                // {
                //   icon: "Design",
                //   primaryText: "Create and visualize like a pro",
                // },
            ],
        });
    }

    InsertParagraphClick = async () => {
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

    ApplyStyleClick = async () => {

        // document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);


        await Word.run(async (context) => {

            // TODO1: Queue commands to style text.
            const firstParagraph = context.document.body.paragraphs.getFirst();
            firstParagraph.style = 'Выделенная цитата';

            await context.sync();
        });
    }

    ApplyCustomStyleClick = async () => {

        // document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);


        await Word.run(async (context) => {

            // TODO1: Queue commands to apply the custom style.
            const lastParagraph = context.document.body.paragraphs.getLast();
            lastParagraph.style = 'MyCustomStyle';

            await context.sync();
        });
    }

    ChangeFontClick = async () => {

        // document.getElementById("apply-style").onclick = () => tryCatch(applyStyle);


        await Word.run(async (context) => {


            // TODO1: Queue commands to apply a different font.
            const secondParagraph = context.document.body.paragraphs.getFirst().getNext();
            secondParagraph.font.set({
                name: 'Courier New',
                bold: true,
                size: 24,
                color: 'yellow'
            });

            await context.sync();
        });
    }

     myOnClick  = async () => {

    }

    render() {
        const {title, isOfficeInitialized} = this.props;

        if (!isOfficeInitialized) {
            return (
                <Progress
                    title={title}
                    logo={require('../../assets/logo-filled.png')}
                    message="Please sideload your addin to see app body."
                />
            );
        }

        return (
            <div className="ms-welcome">
                <Header logo={require('../../assets/logoMy.jpg')} title={this.props.title} message="Hello, Kirill!"/>
                <HeroList message="Discover what Office Add-ins can do!" items={this.state.listItems}>

                    <p className="ms-font-l">
                        Click <b>Insert Paragraph</b> to insert it
                    </p>
                    <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                                   onClick={this.InsertParagraphClick}>
                        Insert Paragraph
                    </DefaultButton>

                    <CustomButton onClick={this.myOnClick} className={'CustomButtonStyle'}/>
                    {/*<ActionButton key={5}><ActionButton/>*/}

                    <p className="ms-font-l">
                        Click <b>Apply Style</b> to do it
                    </p>
                    <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                                   onClick={this.ApplyStyleClick}>
                        Apply Style
                    </DefaultButton>

                    <p className="ms-font-l">
                        Click <b>Apply Custom Style</b> to insert it
                    </p>
                    <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                                   onClick={this.ApplyCustomStyleClick}>
                        Apply Custom Style
                    </DefaultButton>

                    <p className="ms-font-l">
                        Click <b>Change Font</b> to insert it
                    </p>
                    <DefaultButton className="ms-welcome__action" iconProps={{iconName: 'ChevronRight'}}
                                   onClick={this.ChangeFontClick}>
                        Change Font
                    </DefaultButton>

                </HeroList>
            </div>
        );
    }
}
