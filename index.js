const csv = require("csv-parser");
const fs = require("fs");

const xl = require("excel4node");
let wb = new xl.Workbook();
let gruposAM = wb.addWorksheet("GRUPO AM");
let personasAM = wb.addWorksheet("PERSONAS AM");
let gruposPM = wb.addWorksheet("GRUPO PM");
let personasPM = wb.addWorksheet("PERSONAS PM");
let myNewExcelFile = "grupos.xlsx";

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

const deleteBadGrades = (array1, array2) => {
  let datos = array1;
  const datos2 = array2;

  let dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });
  dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });
  datos = datos.sort((elem1, elem2) => elem1.sector - elem2.sector);
  dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });
  dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });
  dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });
  dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });

  datos = datos.sort((elem1, elem2) => elem1.region - elem2.region);
  dato = datos.shift();
  dato.group.forEach(elem => {
    datos2.push(elem);
  });

  return { g: datos, p: datos2 };
};

const verificarFinal = groups => {
  const datos = groups.sort((elem1, elem2) => elem1.sector - elem2.sector);
  // console.log(datos[0].sector);
  const a = datos[0].sector > 1.6;
  return a;
};

// retorna el numero de personas que se repiten.
const searchInGrupoAM = (gruopAux, groupsAM, person) => {
  let count = 0;
  const groupAM = groupsAM.find(fgruop => {
    return fgruop.group.find(p => p.id === person.id);
  });

  if (groupAM && gruopAux) {
    const groupFinal = groupAM.group.concat(gruopAux);
    const uniques = groupFinal.unique();
    uniques.forEach(a => {
      if (groupFinal.filter(x => x === a).length > 1) {
        count++;
      }
    });
    return count;
  } else {
    return 0;
  }
};

const groupsCreate = (people, groupsAM = false) => {
  let countFinal = 0;
  let groups = [];
  let badGrade = 0;
  let FM = groupsAM ? true : false;
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

    console.log(
      "people: " + people2.length + "val: " + FM + "count: " + countFinal
    );
    for (let i = 0; i < 18; i++) {
      const auxGroup = [];
      people2.forEach(a => {
        if (auxGroup.length < 10) {
          // console.log(
          //   `${a.ods1} === ${i} || ${a.ods2} === ${i} || ${a.ods3} === ${i}`
          // );
          if (a.ODS.includes(i) && !a.status) {
            if (FM) {
              if (searchInGrupoAM(auxGroup, groupsAM, a) < 2) {
                auxGroup.push(a);
              }
            } else {
              auxGroup.push(a);
            }
          }
        }
      });
      if (auxGroup.length === 10) {
        const region = dispersion(auxGroup, "region");
        const sector = dispersion(auxGroup, "sector");

        if (sector > 1.8 && region > 0.8) {
          auxGroup.forEach(x => {
            const index = people2.findIndex(person => person.id === x.id);
            people2.splice(index, 1);
          });
          groups.push({ group: auxGroup, sector, region, ods: i });
        }
      }
      if (auxGroup.length < 10) {
        countFinal++;
      } else {
        badGrade++;
      }
      if (groups.length > 10) {
        if (verificarFinal(groups)) {
          // countFinal = 3000000000;
        }
      }
      if (badGrade > 10000) {
        console.log("ENTRO A ELIMINAR 2");
        const res = deleteBadGrades(groups, people2);
        groups = res.g;
        people2 = res.p;
        badGrade = 0;
      }
    }
  }
  return { groups, people: people2 };
};
const main = people => {
  const { groups: groupsAM, people: peopleAM } = groupsCreate(people);
  writeExcel(gruposAM, personasAM, groupsAM, peopleAM);

  const { groups: groupsPM, people: peoplePM } = groupsCreate(people, groupsAM);
  writeExcel(gruposPM, personasPM, groupsPM, peoplePM);

  wb.write(myNewExcelFile);

  console.log("CANTIDAD AM:" + groupsAM.length);
  console.log("CANTIDAD PM:" + groupsPM.length);
};

readCSV();
