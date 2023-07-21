import createAudioAsset from "./createAudioAsset.js";
import getAllAudioRecords from "./getAllAudioRecords.js";


const audioUrls = await getAllAudioRecords();
console.log(audioUrls[0].url);
// async function processEntry(entry) {
//   await createAudioAsset(entry);
// }

// async function processJsonData() {
//   for (let index = 0; index < audioUrls.length; index++) {
//     await processEntry(audioUrls[index].url);
//   }
// }

// processJsonData()
//   .then(() => {
//     console.log("All entries processed successfully");
//   })
//   .catch((error) => {
//     console.error("An error occurred while processing entries:", error);
//   });


  async function processEntry(entry) {
    await createAudioAsset(entry);
  }
  
  async function processJsonData() {
    await processEntry(audioUrls[0].url);
  }
  
  processJsonData()
    .then(() => {
      console.log("All entries processed successfully");
    })
    .catch((error) => {
      console.error("An error occurred while processing entries:", error);
    });
  