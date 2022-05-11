// import MaskData from "maskdata";

// function mask(field) {
//     // console.log(field);
//     try {
//         let masked;
//         if (field) {
//             const maskOptions = {
//                 // Character to mask the data. default value is '*'
//                 maskWith: "*",
//             };
//             if (!isNaN(field)) {
//                 // if( field.toString().length % 2 ===  )
//                 maskOptions.unmaskedEndDigits = 3;
//                 maskOptions.unmaskedStartDigits = 3;
//                 masked = MaskData.maskPhone(field, maskOptions);
//             } else {
//                 maskOptions.unmaskedStartCharacters = 3;
//                 maskOptions.unmaskedEndCharacters = 2;
//                 maskOptions.maxMaskedCharactersBeforeAtTheRate = 10;
//                 maskOptions.maxMaskedCharactersAfterAtTheRate = 0;
//                 masked = MaskData.maskEmail(field, maskOptions);
//             }
//             return masked;
//         }
//         return field;
//     } catch (err) {
//         console.log(err); // refactor error function
//     }
// }

// module.exports = mask;
