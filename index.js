const csv = require("csv-parser");
const fs = require("fs");
const { getSector, ODS, getRegion } = require("./utils.js");
const {
  sumatoria,
  media,
  getVar,
  dispersion,
  dispersionODS,
  oneArray
} = require("./math-utils");
const groups = [];

const setODS = ods => {
  const odsArray = [];

  ODS.forEach((data, i) => {
    if (ods.indexOf(data) !== -1) {
      odsArray.push(i);
    }
  });
  return odsArray;
};

const setData = people => {
  return people.map((data, i) => {
    return {
      id: i,
      group: 0,
      name: data.Nombre,
      lastName: data.Apellido,
      email: data["E-mail"],
      gender: data.Sexo,
      city: data["Ciudad de residencia"],
      regionName: data["Región de residencia"],
      region: getRegion(data["Región de residencia"]),
      sectorName: data["Con cuál de estas categorías te identificas"],
      sector: getSector(data["Con cuál de estas categorías te identificas"]),
      ODS: setODS(
        data[
          "Escoge 3 Objetivos de Desarrollo Sostenible (ODS) que sean de tu interés"
        ]
      )
    };
  });
};

const readCSV = () => {
  new Promise((resolver, rechazar) => {
    console.log("inicia promesa");
    const people = [];
    fs.createReadStream("asistentes.csv")
      .pipe(csv())
      .on("data", row => {
        people.push(row);
      })
      .on("end", () => {
        console.log("termina en ON PROMESA");

        main(setData(people));
      });
    console.log("termina promesa");
  });
};

const fitness = group => {
  // console.log(oneArray(group, "ods1"));
  // console.log("sector: " + dispersion(group, "sector"));
  return dispersionODS(group, "ods1");
  // console.log("region:" + dispersion(group, "region"));
};

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const main = people => {
  let i = 0;
  let aux = true;
  const groups = [];
  let count = 0;

  // while (count < 100) {
  //   people = shuffle(people);
  //   while (aux) {
  //     const group = [];
  //     for (let j = 0; j < 10; j++) {
  //       const person = people[Number(i + "" + j)];
  //       if (!person) {
  //         aux = false;
  //       } else {
  //         person.group = j + 1;
  //         group.push({
  //           name: person.name,
  //           id: person.id,
  //           sector: person.sector,
  //           ods1: person.ODS[0] || 0,
  //           ods2: person.ODS[1] || 0,
  //           ods3: person.ODS[2] || 0,
  //           gender: person.gender,
  //           region: person.region
  //         });
  //       }
  //     }
  //     groups.push(group);
  //     i++;
  //   }
  //   groups.forEach(a => {
  //     const val = fitness(a);
  //     if (val) {
  //       count = 200;
  //     }
  //   });
  // }
};

readCSV();
