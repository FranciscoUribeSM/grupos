const sumatoria = (array, name) => {
  let total = 0;

  array.forEach(d => {
    const dat = name ? d[name] : d;
    total += Number(dat);
  });
  return total;
};

const media = (array, name) => {
  return Number(sumatoria(array, name)) / Number(array.length);
};
Array.prototype.unique = (function(a) {
  return function() {
    return this.filter(a);
  };
})(function(a, b, c) {
  return c.indexOf(a, b + 1) < 0;
});
const getVar = (array, name = false) => {
  const med = media(array, name);
  let totalSum = 0;
  array.forEach(d => {
    const dat = name ? d[name] : d;

    totalSum += Math.pow(dat - med, 2);
  });

  return totalSum / array.length;
};

const desEst = (array, name) => {
  return Math.sqrt(getVar(array, name));
};
const oneArray = (array, name) => {
  return array.map(a => a[name]);
};
const dispersion = (array, name) => {
  const uniques = oneArray(array, name).unique();
  const countArray = uniques.map(a => {
    return array.filter(x => x[name] === a).length;
  });
  if (countArray.length === 1) return 0;
  return countArray.length / Math.max(...countArray);
};

const searchValidateODS = (array, name) => {
  let validate = false;
  for (let i = 0; i < 18; i++) {
    console.log(array);
    validate = array.every(a => a.ods1 === i || a.ods2 === i || a.ods3 === i);
    if (validate) {
      break;
    }
  }
  return validate;
};
const dispersionODS = (array, name) => {
  const validate = searchValidateODS(array, name);

  if (validate) {
    console.log("es valida");
    console.log(array);
    return validate;
  }
  return false;
};

exports.sumatoria = sumatoria;
exports.media = media;
exports.getVar = getVar;
exports.desEst = desEst;
exports.dispersion = dispersion;
exports.dispersionODS = dispersionODS;
exports.oneArray = oneArray;
