import React from "react";
import { SheetJSFT, exmapleData, transformData, createLevels } from "./utils";
import { createEditor } from "./Rete/rete";
import * as XLSX from "xlsx";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import ConnectElements from "react-connect-elements";
import { Tree, TreeNode } from "react-organizational-chart";
import styled from "styled-components";

import "./App.css";

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid red;
`;

type NumString = number | string;

export type Row = {
  topicId: string;
  notes: undefined | NumString;
  questionId: NumString;
  questionText: undefined | NumString;
  type: undefined | NumString;
  answerRouting: undefined | NumString;
  anonymityRouting: undefined | NumString;
  routeTo: undefined | string;
  answers: undefined | string;
  notificationSubject: undefined | NumString;
  notificationEmail: undefined | NumString;
  language: undefined | NumString;
  skipInExpress: undefined | NumString;
};

export type Data = { number: Row } | null;

type State = {
  excelLoaded: boolean;
  openDeleteModal: boolean;
  openEditModal: boolean;
  data: Data;
  levelStructure: null | any;
};

type Props = {};

class App extends React.Component<Props, State> {
  state = {
    excelLoaded: false,
    openDeleteModal: false,
    openEditModal: false,
    data: null,
    levelStructure: null,
  };

  readFile = async (e: any) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        const bstr = e.target && e.target.result;
        const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const newData = transformData(data);
        const levelStructure = createLevels(newData);
        this.setState({
          data: newData,
          levelStructure,
          excelLoaded: true,
        });
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    }
  };

  /* TODO Should be a component MesageItem */
  renderAnswer = (id: string, question: Row) => {
    if (id === "END" || question.questionId === undefined) return null;
    const { data } = this.state;
    //if (id.includes("-")) return null;
    //const { data } = this.state;
    // const children = Object.keys(data).filter((item) => {
    //   if (item && item.includes(question.routeTo)) {
    //     return item;
    //   }
    //   return false;
    // });
    const children = Object.keys(data).filter((rowId) =>
      data[rowId].questionId.toString().includes(question.routeTo)
    );

    console.log("children", children);
    return (
      <TreeNode key={id} label={this.renderLabel(id, question)}>
        {children.length > 0 && (
          <>
            {children[0] && (
              <TreeNode
                label={this.renderLabel(children[0], data[children[0]])}
              >
                {this.renderAnswer(
                  data[children[0]].routeTo,
                  data[data[children[0]].routeTo]
                )}
              </TreeNode>
            )}
            {children[1] && (
              <TreeNode
                label={this.renderLabel(children[1], data[children[1]])}
              >
                {this.renderAnswer(
                  data[children[1]].routeTo,
                  data[data[children[1]].routeTo]
                )}
              </TreeNode>
            )}
            {children[2] && (
              <TreeNode
                label={this.renderLabel(children[2], data[children[2]])}
              >
                {this.renderAnswer(
                  data[children[2]].routeTo,
                  data[data[children[2]].routeTo]
                )}
              </TreeNode>
            )}
            {children[3] && (
              <TreeNode
                label={this.renderLabel(children[3], data[children[3]])}
              >
                {this.renderAnswer(
                  data[children[3]].routeTo,
                  data[data[children[3]].routeTo]
                )}
              </TreeNode>
            )}
            {children[4] && (
              <TreeNode
                label={this.renderLabel(children[4], data[children[4]])}
              >
                {this.renderAnswer(
                  data[children[4]].routeTo,
                  data[data[children[4]].routeTo]
                )}
              </TreeNode>
            )}
          </>
        )}

        {/* {id !== "950294" &&
          this.renderAnswer(data[].routeTo, data[question.routeTo])} */}
      </TreeNode>
    );
  };

  renderLabel = (id: string, question: Row) => {
    const answers = question.answers && question.answers.split("|");
    return (
      <div className="questionContainer">
        <div className="questionWrap">
          <div className="questionHeader">
            <span className="questionHeaderTitle">[{question.questionId}]</span>
            <div className="headerIcons">
              <IconButton
                aria-label="Edit"
                size="small"
                onClick={this.toggleEditModal}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={this.toggleDeleteModal}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </div>

          <div className="questionBody">
            <div className="questionMess">{question.questionText}</div>
            {question.answerRouting &&
              answers.map((answer) => (
                <div className="questionOption"> {answer}</div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  toggleDeleteModal = () =>
    this.setState({ openDeleteModal: !this.state.openDeleteModal });

  toggleEditModal = () =>
    this.setState({ openEditModal: !this.state.openEditModal });

  // cvs is not good, has no validation
  // datastructure !!!
  // show Rete demo + codepen
  // exporting to csv (should be saved in Database)
  // show edit, delete
  // ask if someone will look at the code (cleanup ?)
  // exporting

  render() {
    const {
      excelLoaded,
      data,
      openDeleteModal,
      openEditModal,
      levelStructure,
    } = this.state;
    console.log("data", data);

    // return (
    //   <div className="App">
    //     <div
    //       style={{ width: "100vw", height: "100vh" }}
    //       ref={(ref) => ref && createEditor(ref)}
    //     />
    //   </div>
    // );

    if (!excelLoaded) {
      return (
        <div className="App">
          <input
            type="file"
            className="form-control"
            id="file"
            accept={SheetJSFT}
            onChange={this.readFile}
          />
        </div>
      );
    }

    const firstId = "950201";

    return (
      <div className="App">
        {/*Object.keys(data).map((id) => this.renderAnswer(id, data[id])) */}
        {/* <ConnectElements
          selector=".questionWrap"
          elements={[{ from: ".element", to: ".elementChild" }]}
          color="green"
        /> */}

        <Tree
          nodePadding={"15px"}
          lineHeight={"45px"}
          lineWidth={"2px"}
          lineColor={"#00BFA4"}
          lineBorderRadius={"10px"}
          label={this.renderAnswer(firstId, data[firstId])}
        >
          {Object.keys(levelStructure[firstId]).map((childId) =>
            this.renderAnswer(childId, data[childId])
          )}
          {/* <TreeNode label={<StyledNode>Child 1</StyledNode>}>
            <TreeNode label={<StyledNode>Grand Child</StyledNode>} />
          </TreeNode>
          <TreeNode label={<StyledNode>Child 2</StyledNode>}>
            <TreeNode label={<StyledNode>Grand Child</StyledNode>}>
              <TreeNode label={<StyledNode>Great Grand Child 1</StyledNode>} />
              <TreeNode label={<StyledNode>Great Grand Child 2</StyledNode>} />
            </TreeNode>
          </TreeNode>
          <TreeNode label={<StyledNode>Child 3</StyledNode>}>
            <TreeNode label={<StyledNode>Grand Child 1</StyledNode>} />
            <TreeNode label={<StyledNode>Grand Child 2</StyledNode>} />
          </TreeNode>
         */}
        </Tree>

        <Dialog
          open={openDeleteModal}
          onClose={this.toggleDeleteModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleting this question will delete all children questions as well
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDeleteModal} color="primary">
              Cancel
            </Button>
            <Button onClick={this.toggleDeleteModal} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditModal}
          onClose={this.toggleEditModal}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Question Name"
              fullWidth
            />
            <TextField
              margin="dense"
              id="text  "
              label="Question Text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleEditModal} color="primary">
              Cancel
            </Button>
            <Button onClick={this.toggleEditModal} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
