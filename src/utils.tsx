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
      newData[`${row[2]}_${row[5]}`] = makeObject(row);
    } else {
      newData[row[2]] = makeObject(row);
    }
    return false;
  });
  // @ts-ignore
  const returnData: Data = newData;

  return returnData;
};

export const createLevels = (data: Data) => {
  //let startingPoint = "950201";
  // const structure = {
  //   [startingPoint]: {},
  // };
  //let routeTo = data[startingPoint].routeTo;

  // const structure2 = {};
  // const method2 = Object.keys(data).map((id) => {

  //   if (startingPoint === data[id].questionId) {
  //     structure2[data[id].questionId] = {};
  //     const { routeTo } = data[id];
  //     Object.keys(data).map(id2 => {
  //       routeTo
  //     })
  //   }
  // });

  // method 1
  // const children = Object.keys(data).filter((id) => {
  //   const child = data[id].questionId.toString().includes(routeTo);
  //   if (child) {
  //     console.log("data[id].questionId", data[id].questionId);
  //     return child;
  //   }
  //   return false;
  // });
  // children.map((id) => {
  //   if (Object.keys(structure).length === 1) {
  //     structure[startingPoint][id] = {};
  //     structure[startingPoint][id][data[id].routeTo] = {};
  //   }
  //   return false;
  // });
  // console.log("children", children);
  // console.log("structure", structure);

  return {
    950201: {
      950210: {
        950230: {
          950231: {
            950240: {
              950242: {
                950250: {
                  950251: {
                    950252: {
                      950270: {
                        950271: {
                          950272: {
                            950290: {
                              950291: {
                                950293: {
                                  950294: {},
                                },
                              },
                            },
                            "950290_2": {},
                            "950290_3": {},
                            "950290_4": {},
                          },
                        },
                      },
                    },
                  },
                },
                "950250_2": {},
                "950250_3": {},
                "950250_4": {},
                "950250_5": {},
              },
            },
            "950240_2": {},
            "950240_3": {},
          },
        },
        "950230_2": {
          950232: {},
        },
        "950230_3": {
          950232: {},
        },
        "950230_4": {
          950232: {},
        },
      },
      "950210_2": {
        950212: {},
      },
      "950210_3": {
        950211: {},
      },
    },
  };
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
