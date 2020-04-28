import { Data } from "./App";

export const SheetJSFT = ["xlsx", "xlsb", "xlsm", "xls", "xml", "csv"]
  .map(function (x) {
    return "." + x;
  })
  .join(",");

export const transformData = (data: Array<any | undefined>) => {
  const newData = {};
  data.map((row, index) => {
    if (index === 0) {
      return false;
    }
    if (newData[row[2]]) {
      // TODO is here twice
      newData[`${row[2]}${-row[5]}`] = makeObject(row);
    }
    newData[row[2]] = makeObject(row);
    return false;
  });
  // @ts-ignore
  const returnData: Data = newData;
  return returnData;
};

const makeObject = (row) => ({
  topicId: row[0],
  notes: row[1],
  questionId: row[2],
  questionText: row[3],
  type: row[4],
  answerRouting: row[5],
  anonymityRouting: row[6],
  routeTo: row[7],
  answers: row[8],
  notificationSubject: row[9],
  notificationEmail: row[10],
  language: row[11],
  skipInExpress: row[12],
});

export const exmapleData = {
  950201: {
    topicId: 9502,
    notes: "",
    questionId: 950201,
    questionText:
      "Zdraví tě Arnold. Dneska s tebou chci probrat téma práce na dálku. Pojďme rovnou na to.",
    type: "TELL",
    answerRouting: "",
    anonymityRouting: "",
    routeTo: 950210,
    answers: "",
    notificationSubject: "",
    notificationEmail: "",
    language: "cs",
    skipInExpress: "FALSE",
  },

  950210: {
    topicId: 9502,
    notes: "",
    questionId: 950201,
    questionText: "Pracuješ v současné době z domova?",
    type: "SELECT",
    answerRouting: "",
    anonymityRouting: "",
    routeTo: "options",
    answers: "Ano|Ne|Aktuálně vůbec nepracuji",
    notificationSubject: "",
    notificationEmail: "",
    language: "cs",
    skipInExpress: "FALSE",
    options: [
      [
        "Ano",
        {
          topicId: 9502,
          notes: "",
          questionId: 950230,
          questionText:
            "A máš pro práci z domova všechno potřebné vybavení? Ať už jde o počítač, software, kvalitní připojení k internetu a vzdálené přístupy nebo vhodné prostory?",
          type: "TELL",
          answerRouting: "",
          anonymityRouting: "",
          routeTo: "options",
          answers: "Ano|Ne|Aktuálně vůbec nepracuji",
          notificationSubject: "",
          notificationEmail: "",
          language: "cs",
          skipInExpress: "FALSE",
        },
      ],
      [
        "Ne",
        {
          topicId: 9502,
          notes: "",
          questionId: 950212,
          questionText: "Co ti nyní v práci z domova brání?",
          type: "TELL",
          answerRouting: "",
          anonymityRouting: "",
          routeTo: "options",
          answers: "Ano|Ne|Aktuálně vůbec nepracuji",
          notificationSubject: "",
          notificationEmail: "",
          language: "cs",
          skipInExpress: "FALSE",
        },
      ],
      [
        "Aktuálně vůbec nepracuji",
        {
          topicId: 9502,
          notes: "",
          questionId: 950211,
          questionText:
            "Děkuji. Dneska si potřebuji povídat spíše s lidmi, kteří pracují. Věřím, že si příště popovídáme víc.",
          type: "TELL",
          answerRouting: "",
          anonymityRouting: "",
          routeTo: "options",
          answers: "Ano|Ne|Aktuálně vůbec nepracuji",
          notificationSubject: "",
          notificationEmail: "",
          language: "cs",
          skipInExpress: "FALSE",
        },
      ],
    ],
  },
};

// [
//   [
//     9502,
//     950201,
//     "Zdraví tě Arnold. Dneska s tebou chci probrat téma práce na dálku. Pojďme rovnou na to.",
//     "TELL",
//     950210,
//     "cs",
//     false,
//   ],

//   [
//     9502,
//     950210,
//     "Pracuješ v současné době z domova?",
//     "SELECT",
//     1,
//     950230,
//     "Ano|Ne|Aktuálně vůbec nepracuji",
//     "cs",
//     false,
//   ],
//   [
//     9502,

//     950210,
//     "Pracuješ v současné době z domova?",
//     "SELECT",
//     2,
//     950212,
//     "Ano|Ne|Aktuálně vůbec nepracuji",
//     "cs",
//     false,
//   ],
//   [
//     9502,
//     "",
//     950210,
//     "Pracuješ v současné době z domova?",
//     "SELECT",
//     3,
//     950211,
//     "Ano|Ne|Aktuálně vůbec nepracuji",
//     "cs",
//     false,
//   ],
// ];
