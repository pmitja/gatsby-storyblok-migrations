import createArticle from "./done-version.js";
import getAllBlogPosts from "./getAllBlogPosts.js";

const blogs = await getAllBlogPosts();

async function processEntry(entry) {
  await createArticle(entry);
}

async function processJsonData() {
  for (let index = 0; index < blogs.length; index++) {
    console.log("[MIGRATION_INDEX]", index);
    await processEntry(blogs[index]);
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
//   await createArticle(entry);
// }

// async function processJsonData() {
//   await processEntry(blogs[1]);
// }

// processJsonData()
//   .then(() => {
//     console.log("All entries processed successfully");
//   })
//   .catch((error) => {
//     console.error("An error occurred while processing entries:", error);
//   });
