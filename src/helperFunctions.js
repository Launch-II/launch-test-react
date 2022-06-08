/**
 * @author Owen Rossi-Keen
 * https://owenrossikeen.com/
 */

// []==============[]
// [] DEPENDENCIES []
// []==============[]

// Dependencies
const ByteBuffer = require('ByteBuffer');
const CryptoJS = require('crypto-js');
// const readline = require('readline');
// const fs = require('fs');
// const recursive = require('recursive-readdir');

// []============[]
// [] NAMESPACES []
// []============[]

/** @namespace Definitions */
/** @namespace helperFunctions */
/** @namespace launchFunctions */

// []=============[]
// [] DEFINITIONS []
// []=============[]

/**
 * @memberof Definitions
 * The size of the prefix required to denote the size of a TobComm encoded string.
 */
const STRING_LENGTH_PREFIX_SIZE = 2;

/**
 * @memberof Definitions
 * A string containing TobComm valid characters. Currently unused.
 */
const SANCTIFIED_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// []==================[]
// [] HELPER FUNCTIONS []
// []==================[]

/**
 * @param {string} str
 * @returns ByteBuffer containing SHA256 encoded str
 * @memberof helperFunctions
 */
const stringToSHA256 = (str) => {
  const bb = new ByteBuffer(32);

  bb.writeString((CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex), 'hex'));
  bb.reset();
  return bb;
};

/**
 * @param {string} str
 * @returns Byte Array containing encoded str
 * @memberof helperFunctions
 */
const stringToByteBuffer = (str) => {
  const bb = new ByteBuffer(str.length);
  bb.writeString(str);
  return bb.buffer;
};

/**
 * @param {bytearray} bytearray
 * @returns Decoded 64-bit Floating Point number
 * @memberof helperFunctions
 */
const intFromBytes = (byteArray) => {
  if (byteArray.length !== 4) return console.log('Yikes!');
  const bb = new ByteBuffer(4).append(byteArray);

  return (
    (bb.buffer[0] << 24) +
    (bb.buffer[1] << 16) +
    (bb.buffer[2] << 8) +
    bb.buffer[3]
  );
};

const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const waitFor = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

const sequentialArray = (array, curIdx = 0) =>
  new Promise((resolve) => {
    const run = async (i) => {
      await array[i];
      i == array.length - 1 ? resolve() : run(i++);
    };

    run(curIdx);
  });
/**
 * Useful for rounding single-precision floats (such as those encoded in a Java application)
 * @param {number} float
 * @returns Number rounded to the 100ths place.
 * @memberof helperFunctions
 */
const roundFloat = (float) => Math.round(float * 100) / 100;

/**
 * @param {boolean} full - Whether or not function returns seconds. default: false.
 * @returns Formatted string time
 * @memberof helperFunctions
 */
const getTime = (full = false) => {
  // This is a hacky way to do it, but it works 🤷‍♀️

  let currentDate = new Date();

  if (full) return currentDate.toJSON().slice(0, 19).replace('T', ' || ');

  return currentDate.toJSON().slice(0, 19).split('T')[1];
};

/**
 * Iterates over all files (excluding node_modules and the like) to determine the (roughly estimated) number of lines of code in a given project
 * Asynchronous
 * @memberof helperFunctions
 */
// const projectAudit = async () => {
//   const countLines = async (filteredPaths) =>
//     new Promise((res, rej) => {
//       var totalLines = 0;
//       var filesRead = 0;
//       filteredPaths.forEach((filePath, idx) => {
//         let linesCount = 0;
//         readline
//           .createInterface({
//             input: fs.createReadStream(filePath),
//             output: process.stdout,
//             terminal: false,
//           })
//           .on('line', () => {
//             linesCount++;
//           })
//           .on('close', () => {
//             filesRead++;
//             totalLines = totalLines + linesCount;
//             if (filesRead == filteredPaths.length) res(totalLines);
//           });
//       });
//     });
//   const remove = (array, phrase) =>
//     array.filter((item) => item.indexOf(phrase) == -1);

//   // Get array of all file paths
//   const filePaths = await recursive('../../', [
//     (path) => {
//       var a = true;
//       if (
//         path.indexOf(
//           'node_modules' &&
//             path.indexOf('android') &&
//             path.indexOf('package') &&
//             path.indexOf('build') &&
//             path.indexOf('message') &&
//             path.indexOf('build') &&
//             path.indexOf('.mext')
//         ) == -1
//       ) {
//         a = false;
//       }
//       if (path.indexOf('node_modules')) return false;
//     },
//   ]);
//   // Filter out unwanted files
//   const filtered = remove(
//     remove(
//       remove(
//         remove(
//           remove(
//             remove(
//               filePaths.filter(
//                 (path, idx) =>
//                   path.slice(-3) == 'tml' ||
//                   path.slice(-3) == 'jsx' ||
//                   path.slice(-3) == '.js' ||
//                   path.slice(-3) == 'son' ||
//                   path.slice(-3) == 'tsx' ||
//                   path.slice(-3) == 'css' ||
//                   path.slice(-3) == 'txt' ||
//                   path.slice(-3) == '.md'
//               ),
//               'node_modules'
//             ),
//             'android'
//           ),
//           'package'
//         ),
//         'build'
//       ),
//       '.next'
//     ),
//     'message'
//   );
//   // Pass array of filtered files to counting function
//   let finalCount = await countLines(filtered);
//   // Log the final count
//   return finalCount;
// };

/**
 * Generates a crc32 checksum from a string
 * @param {string} str - The stringified data to be converted.
 * @returns crc32 checksum number
 * @memberof helperFunctions
 */
const crc32 = (str) => {
  for (var a, o = [], c = 0; c < 256; c++) {
    a = c;
    for (var f = 0; f < 8; f++) a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1;
    o[c] = a;
  }
  for (var n = -1, t = 0; t < str.length; t++)
    n = (n >>> 8) ^ o[255 & (n ^ str.charCodeAt(t))];
  return (-1 ^ n) >>> 0;
};
/**
 * Takes a parsed JSON object which contains numbers read as strings and converts those strings to numbers.
 * e.g. userID: "1234" would become userID: 1234.
 * Also has the nasty tendency to turn empty arrays into zeroes.
 * @param {object} object - The stringified data to be converted.
 * @returns Object with numbers, rather than strings.
 * @memberof helperFunctions
 */
const parsedJsonStringsToInt = (object) => {
  if (Array.isArray(object)) {
    return object.map((data) => parsedJsonStringsToInt(data));
  }
  var obj = object;
  for (var prop in obj) {
    if (Array.isArray(obj[prop])) {
      this.parsedJsonStringsToInt(obj[prop]);
    } else {
      switch (obj[prop]) {
        case 'true':
          obj[prop] = true;
          break;
        case 'false':
          obj[prop] = false;
          break;
        default:
          if (
            obj.hasOwnProperty(prop) &&
            obj[prop] !== null &&
            !isNaN(obj[prop])
          ) {
            obj[prop] = +obj[prop];
          }
          break;
      }
    }
  }
  return obj;
};
/**
 * Converts degrees to radians. Simple as.
 * @param {number} deg
 * @memberof helperFunctions
 */
const degreesToRadians = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Converts radians to degrees. Simple as.
 * @param {number} rad
 * @memberof helperFunctions
 */
const radiansToDegrees = (rad) => {
  return rad * (180 / Math.PI);
};

/**
 * Converts miles to kilometers. Simple as.
 * @param {number} miles
 * @memberof helperFunctions
 */
const milesToKilometers = (miles) => {
  return miles / 1.609;
};

/**
 * Converts kilometers to miles. Simple as.
 * @param {number} kilometers
 * @memberof helperFunctions
 */
const kilometersToMiles = (kilometers) => {
  return kilometers * 1.609;
};

/**
 * Converts a byte array into a hexadecimal string.
 * @param {bytearray} data - Data to be encoded
 * @param {number} length - The maximum number of bytes which will be read (left justified). Default: 32.
 * @memberof helperFunctions
 */
const bytesToHexString = (data, length = 32) => {
  let bb = new ByteBuffer(length).append(data).reset();
  return bb.toHex();
};

/**
 * Selects a pseudorandom value from the provided array.
 * Because I was sick of typing 'Math.' 200 times.
 * @param {array} arr - Array to be selected from.
 * @memberof helperFunctions
 */
const arrayRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Capitalizes a given string.
 * @param {string} str - String to be capitalized
 * @memberof helperFunctions
 */
const capitalizeString = (str) => str.replace(/^\w/, (c) => c.toUpperCase());

/**
 * Generates an ordinal suffix for a number.
 * e.g. 1 becomes 1st, 9 becomes 9th.
 * @param {number} i - The number for which an ordinal will be generated.
 * @returns The number concatenated with its ordinal.
 * @memberof helperFunctions
 */

const generateOrdinal = (i) => {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + 'st';
  }
  if (j == 2 && k != 12) {
    return i + 'nd';
  }
  if (j == 3 && k != 13) {
    return i + 'rd';
  }
  return i + 'th';
};

/**
 * Coarsely removes markdown tags from a string.
 * e.g. *Hello __world__* becomes Hello world
 * @param {string} str - The string with Markdown formatting
 * @returns The number without markdown tags
 * @memberof helperFunctions
 */

const removeMarkdownTags = (str) => {
  if (str === null || str === '') {
    return false;
  } else {
    str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }
};

/**
 * Formats a string to camelCase
 * e.g. Hello World becomes helloWorld.
 * @param {string} str
 * @returns camelCase string
 * @memberof helperFunctions
 */
const camelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

// []==================[]
// [] LAUNCH FUNCTIONS []
// []==================[]

/**
 * Reads a Short at the provided ByteBuffer's offset, reads a string of the length denoted by the read short.
 * This DOES iterate the ByteBuffer in the namespace where the function is called.
 * @param {ByteBuffer} bb - The ByteBuffer from which the string will be read.
 * @returns The string which was read.
 * @memberof launchFunctions
 */
const stringFromData = (bb) => {
  let lengthToRead = bb.readShort();

  const cString = bb.readString(lengthToRead);

  return cString;
};

/**
 * Converts a string to a ByteBuffer containing a short (representing the length of the converted string), followed by the converted string.
 * @param {string} str - The string which will be converted.
 * @returns ByteArray
 * @memberof launchFunctions
 */
const getStringData = (str) => {
  const bb = new ByteBuffer.allocate(getStringDataSize(str));
  let cString = this.stringToBytesBB(str);
  bb.writeShort(cString.length);
  bb.append(cString);

  return bb.buffer;
};

/**
 * Returns the byte-size of a short (representing the length of the string), followed by a byte-encoded string
 * @param {string} str - The string which will be measured.
 * @returns Number
 * @memberof launchFunctions
 */
const getStringDataSize = (str) => {
  return STRING_LENGTH_PREFIX_SIZE + this.stringToBytesBB(str).length;
};

/**
 * Sanitized the given name for profanity, as well as dangerous characters. Not currently functional.
 * @param {string} str - The string which will be sanitized.
 * @returns The sanitized string.
 * @memberof launchFunctions
 */
const sanitizeName = (str) => {
  // https://github.com/2Toad/Profanity
  let strName = str.trim();

  if (strName.length > 32) {
    strName = `NTL${Math.random()}-${Math.random() * 100 * Math.pi}`.slice(
      0,
      32
    );
  } else {
    if (strName.match('^.*[a-xzA-Z0-9][a-zA-Z0-9][a-zA-Z0-9].*$')) {
      strName = `RGX${Math.random()}-${Math.random() * 100 * Math.pi}`.slice(
        0,
        32
      );
    }
  }
  return strName;
};

/**
 * Cleans coarsely converted JSON game save (from XML) for use in Counterforce.
 * This is an ultra-specific function for Counterforce.
 * @param {object} json - The parsed JSON object.
 * @returns Cleaned object.
 * @memberof launchFunctions
 */
//
// const cleanJSONGameSave = (json) => {
//   // This is assuming you manually removed the top-level Game: {} and Ctrl+F find-and-replaced all underscores with nothing.
//   let parsedGame = this.parsedJsonStringsToInt(json);

//   let userTest;
//   let playerTest;
//   let mSiteTest;
//   let sSiteTest;

//   // I'm aware this is some of the worst code ever written. It works, and I (hopefully) won't have to use it frequently.

//   Object.keys(parsedGame).forEach((key, idx) => {
//     if (key == 'Users') {
//       let fixedUser = parsedGame[key].map((user) => {
//         // for each user
//         let faux = { ...user };
//         if (user?.Reports?.Report) {
//           if (Array.isArray(user?.Reports?.Report)) {
//             faux.Reports = [...user.Reports.Report];
//           } else {
//             faux.Reports = [user.Reports.Report];
//           }
//         }
//         return faux;
//       });
//       userTest = fixedUser;
//       return;
//     }
//     if (key == 'Players') {
//       let fixedPlayer = parsedGame[key].map((player) => {
//         let faux = { ...player };

//         if (player?.MissileSystem?.Slots?.Slot) {
//           if (player?.MissileSystem?.Slots?.Slot == '') {
//             faux.MissileSystem.Slots = [];
//           } else {
//             if (Array.isArray(player?.MissileSystem?.Slots?.Slot)) {
//               faux.MissileSystem.Slots = [...player.MissileSystem.Slots.Slot];
//             } else {
//               faux.MissileSystem.Slots = [player.MissileSystem.Slots.Slot];
//             }
//           }
//         }
//         if (player?.InterceptorSystem?.Slots?.Slot) {
//           if (player?.InterceptorSystem?.Slots?.Slot == '') {
//             faux.InterceptorSystem.Slots = [];
//           } else {
//             if (Array.isArray(player?.InterceptorSystem?.Slots?.Slot)) {
//               faux.InterceptorSystem.Slots = [
//                 ...player.InterceptorSystem.Slots.Slot,
//               ];
//             } else {
//               faux.InterceptorSystem.Slots = [
//                 player.InterceptorSystem.Slots.Slot,
//               ];
//             }
//           }
//         }
//         return faux;
//       });
//       playerTest = fixedPlayer;
//       return;
//     }
//     if (key == 'MissileSites') {
//       let fixedSite = parsedGame[key].map((site) => {
//         let faux = { ...site };

//         if (site?.MissileSystem?.Slots?.Slot) {
//           if (site?.MissileSystem?.Slots?.Slot == '') {
//             faux.MissileSystem.Slots = [];
//           } else {
//             if (Array.isArray(site?.MissileSystem?.Slots?.Slot)) {
//               faux.MissileSystem.Slots = [...site.MissileSystem.Slots.Slot];
//             } else {
//               faux.MissileSystem.Slots = [site.MissileSystem.Slots.Slot];
//             }
//           }
//         }
//         return faux;
//       });
//       mSiteTest = fixedSite;
//       return;
//     }
//     if (key == 'SAMSites') {
//       let fixedSite = parsedGame[key].map((site) => {
//         let faux = { ...site };

//         if (site?.InterceptorSystem?.Slots?.Slot) {
//           if (site?.InterceptorSystem?.Slots?.Slot == '') {
//             faux.InterceptorSystem.Slots = [];
//           } else {
//             if (Array.isArray(site?.InterceptorSystem?.Slots?.Slot)) {
//               faux.InterceptorSystem.Slots = [
//                 ...site.InterceptorSystem.Slots.Slot,
//               ];
//             } else {
//               faux.InterceptorSystem.Slots = [
//                 site.InterceptorSystem.Slots.Slot,
//               ];
//             }
//           }
//         }
//         return faux;
//       });
//       sSiteTest = fixedSite;
//       return;
//     }
//   });

//   fs.writeFileSync('./output.json', JSON.stringify(output));

//   let output = {
//     Users: userTest,
//     Alliances: parsedGame.AlliancesplayerTest,
//     Treaties: parsedGame.Treaties,
//     Players: playerTest,
//     Missiles: parsedGame.Missiles,
//     Interceptors: parsedGame.Interceptors,
//     MissileSites: mSiteTest,
//     SAMSites: sSiteTest,
//     SentryGuns: parsedGame.SentryGuns,
//     OreMines: parsedGame.OreMines,
//     Loots: parsedGame.Loots,
//     Radiations: parsedGame.Radiations,
//   };
//   return output;
// };

// []=========[]
// [] EXPORTS []
// []=========[]

module.exports.helperFunctions = {
  stringToSHA256,
  stringToByteBuffer,
  intFromBytes,
  roundFloat,
  getTime,
  crc32,
  parsedJsonStringsToInt,
  degreesToRadians,
  radiansToDegrees,
  milesToKilometers,
  kilometersToMiles,
  bytesToHexString,
  arrayRandom,
  capitalizeString,
  generateOrdinal,
  removeMarkdownTags,
  camelCase,
  convertBase64,
  waitFor,
  sequentialArray,
};

module.exports.launchFunctions = {
  //   cleanJSONGameSave,
  getStringDataSize,
  getStringData,
  stringFromData,
  sanitizeName,
};
