import React from "react";
import { SheetJSFT, exmapleData, transformData } from "./utils";
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

// ideally use styled-components.com
import "./App.css";

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
};

type Props = {};

class App extends React.Component<Props, State> {
  state = {
    excelLoaded: false,
    openDeleteModal: false,
    openEditModal: false,
    data: null,
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
        this.setState({ data: newData, excelLoaded: true });
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    }
  };

  renderOptions = (option: Row) => {
    return (
      <div className={`questionWrap elementChild`} key={option[1].questionId}>
        <div className="questionHeader">
          <span className="questionHeaderTitle">{option[0]}</span>
          <div className="headerIcons">
            <IconButton
              aria-label="edit"
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
          <div className="questionMess">{option[1].questionText}</div>
          {/* TODO SELECT */}
        </div>
      </div>
    );
  };

  /* TODO Should be a component MesageItem */
  renderAnswer = (id: string, question: Row) => {
    if (id.includes("-")) return null;
    //const { data } = this.state;
    // const children = Object.keys(data).filter((item) => {
    //   if (item && item.includes(question.routeTo)) {
    //     return item;
    //   }
    //   return false;
    // });
    const answers = question.answers && question.answers.split("|");
    return (
      <>
        <div className={`questionWrap element`} key={question.questionId}>
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
            {answers &&
              answers.map((a) => (
                <div className="questionOption" key={id}>
                  {a}
                </div>
              ))}
          </div>
        </div>
        {/* {question.type === "SELECT" && (
          <div className="optionsWrap">
            {question.options.map((option) => this.renderOptions(option))}
          </div>
        )} */}
      </>
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
    const { excelLoaded, data, openDeleteModal, openEditModal } = this.state;
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

    return (
      <div className="App">
        {Object.keys(data).map((id) => this.renderAnswer(id, data[id]))}
        {/* <ConnectElements
          selector=".questionWrap"
          elements={[{ from: ".element", to: ".elementChild" }]}
          color="green"
        /> */}

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
