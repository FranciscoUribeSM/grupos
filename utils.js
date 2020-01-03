const writeExcel = (ws, ws2, array, people) => {
  array.forEach((d, i) => {
    d.group.forEach((person, j) => {
      ws.cell(i * 12 + (j + 1), 1).number(i);
      ws.cell(i * 12 + (j + 1), 2).string(person.name);
      ws.cell(i * 12 + (j + 1), 3).string(person.lastName);
      ws.cell(i * 12 + (j + 1), 4).string(getODS(person.ODS).join("\n"));
      ws.cell(i * 12 + (j + 1), 5).string(person.sectorName);
      ws.cell(i * 12 + (j + 1), 6).string(person.regionName);
    });
    ws.cell(i * 12 + 11, 2).string("dispersión sector");
    ws.cell(i * 12 + 11, 3).number(d.sector);
    ws.cell(i * 12 + 11, 4).string("dispersión region");
    ws.cell(i * 12 + 11, 5).number(d.region);
    ws.cell(i * 12 + 11, 6).string("ods");
    ws.cell(i * 12 + 11, 7).string(ODS[d.ods]);
  });

  people.forEach((person, i) => {
    ws2.cell(i + 1, 1).string(person.name);
    ws2.cell(i + 1, 2).string(person.lastName);
    ws2.cell(i + 1, 3).string(getODS(person.ODS).join("\n"));
    ws2.cell(i + 1, 4).string(person.sectorName);
    ws2.cell(i + 1, 5).string(person.regionName);
  });
};

const getODS = ods => {
  const arrayODS = [];
  ods.forEach(a => {
    arrayODS.push(ODS[a]);
  });

  return arrayODS;
};

const getSector = option => {
  switch (option) {
    case "Servicio Público":
      return 0;
    case "Sector Privado":
      return 1;
    case "Sociedad Civil":
      return 2;
    case "Agente de cambio Balloon (Fellows Escuderos Balloon+)":
      return 3;
    case "Emprendedor Balloon":
      return 4;
    case "Academia":
      return 5;
    case "Equipo Balloon Latam":
      return 6;
  }
};
const getRegion = option => {
  switch (option) {
    case "Región del Maule":
      return 7;
    case "Región Metropolitana de Santiago":
      return 20;
    case "Región de La Araucanía":
      return 9;
    case "Región del Biobío":
      return 8;
    case "Región de Los Lagos":
      return 10;
    case "Región de Valparaíso":
      return 5;
    case "Región del Libertador General Bernardo OHiggins":
      return 4;
    case "Internacional":
      return 21;
    case "Región de Magallanes y la Antártica Chilena":
      return 12;
    case "Región de Arica y Parinacota":
      return 15;
    case "Región de Antofagasta":
      return 2;
  }
};

const ODS = [
  "Fin de la pobreza",
  "Hambre cero",
  "Salud y bienestar",
  "Educación de calidad",
  "Igualdad de género",
  "Agua limpia y saneamiento",
  "Energía asequible y no contaminante",
  "Trabajo decente y crecimiento económico",
  "Industria innovación e infraestructura",
  "Reducción de las desigualdades",
  "Ciudades y comunidades sostenibles",
  "Producción y consumo responsables",
  "Acción por el clima",
  "Vida submarina",
  "Vida de ecosistemas terrestres",
  "Paz justicia e instituciones sólidas",
  "Alianzas para lograr los objetivos"
];
exports.getSector = getSector;
exports.ODS = ODS;
exports.getRegion = getRegion;
exports.writeExcel = writeExcel;
