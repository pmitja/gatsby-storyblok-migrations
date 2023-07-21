import createPodcast from "./createPodcast.js";
import getAllPodcast from "./getAllPodcast.js";


const podcasts = await getAllPodcast();

async function processEntry(entry) {
  await createPodcast(entry);
}


async function processJsonData() {
  for (let index = 0; index < 11; index++) {
    await processEntry(podcasts[index].id);
  }
}

processJsonData()
  .then(() => {
    console.log("All entries processed successfully");
  })
  .catch((error) => {
    console.error("An error occurred while processing entries:", error);
  });

// async function processEntry(entry) {
//   await createPodcast(entry);
// }

// async function processJsonData() {
//   await processEntry(podcasts[1].id);
// }

// processJsonData()
//   .then(() => {
//     console.log("All entries processed successfully");
//   })
//   .catch((error) => {
//     console.error("An error occurred while processing entries:", error);
//   });
