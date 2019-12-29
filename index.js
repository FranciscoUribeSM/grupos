const csv = require("csv-parser");
const fs = require("fs");
const { getSector, ODS, getRegion, writeExcel } = require("./utils.js");
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
  let aux = true;
  let countFinal = 0;
  const groups = [];
  let finish = false;
  let people2 = people.map(a => {
    return {
      status: false,
      ods1: a.ODS[0],
      ods2: a.ODS[1],
      ods3: a.ODS[2],
      ...a
    };
  });
  while (countFinal < 100000) {
    people2 = shuffle(people2);

    for (let i = 0; i < 18; i++) {
      const auxGroup = [];
      people2.forEach(a => {
        if (auxGroup.length < 10) {
          // console.log(
          //   `${a.ods1} === ${i} || ${a.ods2} === ${i} || ${a.ods3} === ${i}`
          // );
          if ((a.ods1 === i || a.ods2 === i || a.ods3 === i) && !a.status) {
            auxGroup.push(a);
          }
        }
      });
      if (auxGroup.length === 10) {
        const region = dispersion(auxGroup, "region");
        const sector = dispersion(auxGroup, "sector");
        console.log("region: " + region);
        console.log("sector: " + sector);
        if (sector > 1.9 && region > 1) {
          auxGroup.forEach(x => {
            const index = people2.findIndex(person => person.id === x.id);
            people2.splice(index, 1);
          });
          groups.push({ group: auxGroup, sector, region, ods: i });
        }
      }
      if (auxGroup.length < 10) {
        countFinal++;
      }
    }
  }
  console.log(countFinal);
  console.log(groups);
  console.log("people: " + people2.length);
  writeExcel(groups);
};

readCSV();
