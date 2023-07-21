import createAuthor from "./createAuthor.js";
import getAllAuthors from "./getAllAuthors.js";


const users = await getAllAuthors();

async function processEntry(entry) {
  await createAuthor(entry);
}

async function processJsonData() {
  for (let index = 0; index < users.length; index++) {
    await processEntry(users[index].id);
  }
}

processJsonData()
  .then(() => {
    console.log("All entries processed successfully");
  })
  .catch((error) => {
    console.error("An error occurred while processing entries:", error);
  });
