import * as React from "react";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList, { HeroListItem } from "./HeroList";
import Progress from "./Progress";

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
          icon: "Ribbon",
          primaryText: "My primaries",
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
      const paragraph = context.document.body.insertParagraph("My new paragraph width my text. Lyutsko", Word.InsertLocation.start);

      // change the paragraph color to blue.
      // paragraph.font.color = "green";

      await context.sync();
    });
  };

  ApplyStyleClick = async () => {
    return Word.run(async (context) => {
      /**
       * Insert your Word code here
       */

          // insert a paragraph at the end of the document.
      const paragraph = context.document.body.insertParagraph("My new paragraph width my text. Lyutsko", Word.InsertLocation.start);

      // change the paragraph color to blue.
      // paragraph.font.color = "green";

      await context.sync();
    });
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Hello Y" />
        <HeroList message="Discover what Office Add-ins can do!" items={this.state.listItems}>

          <p className="ms-font-l">
            Click  <b>Insert Paragraph</b> to insert it
          </p>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.InsertParagraphClick}>
            Insert Paragraph
          </DefaultButton>

          <p className="ms-font-l">
            Click  <b>Apply Style</b> to do it
          </p>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.ApplyStyleClick}>
            Apply Style
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}
