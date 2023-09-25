import createAuthor from "./createAuthor.js";
import getAllAuthors from "./getAllAuthors.js";
import jsonData from "./JakaScripts/data/authorsData.json" assert { type: "json" };

const users = await getAllAuthors();

async function processEntry(entry) {
  await createAuthor(entry);
}

async function processJsonData() {
  for (let index = 0; index < jsonData.length; index++) {
    await processEntry(index);
  }
}

processJsonData()
  .then(() => {
    console.log("All entries processed successfully");
  })
  .catch((error) => {
    console.error("An error occurred while processing entries:", error);
  });
