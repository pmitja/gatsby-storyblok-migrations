import createArticle from "./done-version.js";
import jsonData from "./allBlogPosts.json" assert { type: "json" };

// async function processEntry(entry) {
//   await createArticle(entry);
// }

// async function processJsonData() {
//   for (let index = 0; index < jsonData.data.length; index++) {
//     await processEntry(jsonData.data[index]);
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
  await createArticle(entry);
}

async function processJsonData() {
  await processEntry(jsonData.data[0]);
}

processJsonData()
  .then(() => {
    console.log("All entries processed successfully");
  })
  .catch((error) => {
    console.error("An error occurred while processing entries:", error);
  });
