// ----------------------------------------
// CONSTANTS (DATA)
// ----------------------------------------

const FEMALE_FIRSTNAMES = [
  "Anna","Marie","Eliška","Adéla","Tereza","Lucie","Natálie","Sofie","Karolína","Veronika",
  "Jana","Petra","Kristýna","Barbora","Alena","Monika","Lenka","Ivana","Zuzana","Markéta",
  "Hana","Simona","Michaela","Lucie","Věra","Jitka","Renata","Eva","Dáša","Radka"
];

const MALE_FIRSTNAMES = [
  "Jan","Jakub","Tomáš","Martin","Lukáš","Petr","David","Michal","Filip","Adam",
  "Vojtěch","Matěj","Šimon","Ondřej","Vladislav","Marek","Stanislav","Jaroslav","Karel","František",
  "Václav","Roman","Zdeněk","Pavel","Jiří","Ladislav","Vít","Milan","Radek","Vladislav"
];

const FEMALE_SURNAMES = [
  "Nováková","Svobodová","Novotná","Dvořáková","Černá","Procházková","Kučerová","Veselá","Horáková","Němcová",
  "Pokorná","Benešová","Fialová","Krejčíová","Růžičková","Jelínková","Králová","Šimková","Adamová","Zelenková",
  "Vávrová","Marešová","Křížová","Doležalová","Čechová","Bartošová","Sýkorová","Konečná","Vondráčková","Kubíčková"
];

const MALE_SURNAMES = [
  "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
  "Pokorný","Beneš","Fiala","Krejčí","Růžička","Jelínek","Král","Šimek","Adam","Zelenka",
  "Vávra","Mareš","Kříž","Doležal","Čech","Bartoš","Sýkora","Konečný","Vondráček","Kubíček"
];

const WORKLOADS = [10, 20, 30, 40];
const GENDERS = ["male", "female"];


// ----------------------------------------
// MAIN
// ----------------------------------------

/**
 * Main entry point of the application.
 * Generates employee data and computes statistics.
 * @param {object} dtoIn - Input data containing count and age range
 * @returns {object} dtoOut - Computed statistics about employees
 */
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}


// ----------------------------------------
// GENERATE EMPLOYEES
// ----------------------------------------
/**
 * Generates a list of employees based on input.
 * @param {object} dtoIn - Input data with count and age range
 * @returns {Array<object>} List of generated employees
 */
export function generateEmployeeData(dtoIn) {
  const result = [];
  const usedBirthdates = new Set();

  for (let i = 0; i < dtoIn.count; i++) {

    const gender = getRandom(GENDERS);

    const { name, surname } = getPersonIdentity(gender);

    let birthdate;
    do {
      birthdate = generateBirthdate(dtoIn.age.min, dtoIn.age.max);
    } while (usedBirthdates.has(birthdate));

    usedBirthdates.add(birthdate);

    result.push({
      gender,
      name,
      surname,
      workload: getRandom(WORKLOADS),
      birthdate,
    });
  }

  return result;
}


// ----------------------------------------
// STATISTICS
// ----------------------------------------
/**
 * Computes statistics from employee list.
 *
 * @param {Array<object>} employees - List of employees
 * @returns {object} Calculated statistics
 */
export function getEmployeeStatistics(employees) {

  const total = employees.length;

  const workload10 = employees.filter(e => e.workload === 10).length;
  const workload20 = employees.filter(e => e.workload === 20).length;
  const workload30 = employees.filter(e => e.workload === 30).length;
  const workload40 = employees.filter(e => e.workload === 40).length;

  const ages = employees.map(e => getAge(e.birthdate));

  const averageAge = round1(
    ages.reduce((sum, a) => sum + a, 0) / total
  );

  const minAge = Math.floor(Math.min(...ages));
  const maxAge = Math.floor(Math.max(...ages));

  const medianAge = getMedian(ages);

  const workloads = employees.map(e => e.workload);
  const medianWorkload = getMedian(workloads);

  const female = employees.filter(e => e.gender === "female");

  const averageWomenWorkload = female.length
    ? round1(female.reduce((sum, e) => sum + e.workload, 0) / female.length)
    : 0;

  const sortedByWorkload = [...employees].sort(
    (a, b) => a.workload - b.workload
  );

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload,
  };
}


// ----------------------------------------
// HELPERS
// ----------------------------------------
/**
 * Returns a random element from array.
 *
 * @param {Array} arr - Input array
 * @returns {*} Random element
 */
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
/**
 * Returns name and surname based on gender.
 *
 * @param {string} gender - "male" or "female"
 * @returns {{name: string, surname: string}} Person identity
 */
function getPersonIdentity(gender) {
  if (gender === "male") {
    return {
      name: getRandom(MALE_FIRSTNAMES),
      surname: getRandom(MALE_SURNAMES),
    };
  }

  return {
    name: getRandom(FEMALE_FIRSTNAMES),
    surname: getRandom(FEMALE_SURNAMES),
  };
}
/**
 * Generates random birthdate based on age range.
 *
 * @param {number} minAge - Minimum age
 * @param {number} maxAge - Maximum age
 * @returns {string} Birthdate in ISO format
 */
function generateBirthdate(minAge, maxAge) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const DAYS_PER_YEAR = 365.25;
  const today = new Date();

  let minDays;
  let maxDays;

  if (minAge === maxAge) {
    minDays = Math.floor(minAge * DAYS_PER_YEAR - 1);
    maxDays = Math.floor(maxAge * DAYS_PER_YEAR + 1);
  } else {
    minDays = Math.floor(minAge * DAYS_PER_YEAR + 1);
    maxDays = Math.floor(maxAge * DAYS_PER_YEAR - 1);
  }

  if (minDays > maxDays) {
    throw new Error("Invalid age range");
  }

  const randomDays =
    Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;

  const birthdate = new Date(today.getTime() - randomDays * MS_PER_DAY);

  return birthdate.toISOString();
}
/**
 * Calculates age from birthdate.
 *
 * @param {string} birthdate - ISO date string
 * @returns {number} Age in years
 */
function getAge(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);

  const diffMs = today - birth;
  const age = diffMs / (1000 * 60 * 60 * 24 * 365.25);

  return age;
}
/**
 * Calculates median of numeric array.
 *
 * @param {number[]} arr - Array of numbers
 * @returns {number} Median value
 */
function getMedian(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}
/**
 * Rounds number to 1 decimal place.
 *
 * @param {number} num - Input number
 * @returns {number} Rounded number
 */
function round1(num) {
  return Math.round(num * 10) / 10;
}
