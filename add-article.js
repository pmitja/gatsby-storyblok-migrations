import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import json from "./allBlogPosts.json" assert { type: "json" };
import StoryblokClient from "storyblok-js-client";
import pkg from "storyblok-markdown-richtext";
const { markdownToRichtext } = pkg;
import TurndownService from "turndown";

const createArticle = (data) => {
  const blogUrl = `https://www.agiledrop.com/jsonapi/node/blog_post/${data.id}/relationships/field_media_cover?`;

  // Folder where image will be saved to.
  const folderName = "./images";

  // Get the filename of the current module file in context
  const __filename = fileURLToPath(import.meta.url);
  // Path to the file directory
  const __dirname = path.dirname(__filename);

  // Create the folder if it doesn't exist
  const folderPath = path.join(__dirname, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const Storyblok = new StoryblokClient({
    oauthToken: "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd",
  });

  const turndownService = new TurndownService();
  const { attributes } = data;

  const regex = /data-entity-uuid=['"](.*?)['"]/g;
  const entityUuids = [];

  let match;
  while ((match = regex.exec(attributes.body.value)) !== null) {
    const entityUuid = match[1];
    entityUuids.push(entityUuid);
  }
  console.log(entityUuids);
  
  // const regex = /data-entity-uuid="([^"]+)"/;
  // const match = regex.exec(attributes.body.value);
  // let uuidValue;

  // if (match && match.length > 1) {
  //   uuidValue = match[1];
  // } else {
  //   console.log("No match found.");
  // }

  const generateSlug = (string) => {
    return string.toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
  };

  function fetchDataFromURL(url) {
    return fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
  }

  async function saveImageToFolder(imageUrl, filePath) {
    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        response.pipe(file);

        response.on("end", () => {
          console.log(`Image downloaded and saved to ${filePath}`);
          resolve();
        });

        response.on("error", (error) => {
          console.error(`Error downloading the image: ${error}`);
          reject(error);
        });
      });
    });
  }

  function uploadImageToStoryblok(file, accessToken, spaceId, imageName) {
    const form = new FormData();
    for (const key in file.signed_request.fields) {
      form.append(key, file.signed_request.fields[key]);
    }
    form.append("file", fs.createReadStream(file.path));

    return new Promise((resolve, reject) => {
      form.submit(file.signed_request.post_url, (err, res) => {
        if (err) {
          console.error("Failed to upload image to Storyblok");
          reject(err);
        } else {
          console.log(
            "https://a.storyblok.com/" +
              file.signed_request.fields.key +
              " UPLOADED!"
          );
          
          const replacedString = attributes.body.value
            .replace(
              /<drupal-media/g,
              `<p><img src='https://a.storyblok.com/${file.signed_request.fields.key}' alt='image'`
            )
            .replace(/><\/drupal-media>/g, "></p>");

          const richtextObject = markdownToRichtext(
            turndownService.turndown(replacedString)
          );

          Storyblok.post("spaces/230321/stories/", {
            story: {
              name: attributes.title,
              slug: generateSlug(attributes.title),
              content: {
                component: "Article",
                article_title: "title",
                subtitle: "this is subtitle of ",
                content: richtextObject,
                image: {
                  filename:
                    "https://a.storyblok.com/f/230321/400x500/9da7b82b7a/cultural_institutions_dx_cover.png",
                },
              },
              parent_id: "309719183",
            },
          });
          resolve();
        }
      });
    });
  }

  function createAssetInStoryblok(accessToken, spaceId, imageName) {
    return axios
      .post(
        `https://api.storyblok.com/v1/spaces/${spaceId}/assets`,
        {
          filename: imageName,
          size: "400x500",
          asset_folder_id: null,
          title: path.parse(imageName).name,
          alt: path.parse(imageName).name,
        },
        {
          headers: { Authorization: accessToken },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Failed to create asset in Storyblok");
        throw error;
      });
  }

  entityUuids.forEach(entityUuid => { (async () => {
    try {
      const mediaUrl = `https://www.agiledrop.com/jsonapi/media/image/${entityUuid}?include=field_media_image`;
      const mediaData = await fetchDataFromURL(mediaUrl);
      const fileUrl = `https://www.agiledrop.com/jsonapi/file/file/${mediaData.data.relationships.field_media_image.data.id}`;
      const fileData = await fetchDataFromURL(fileUrl);

      const imageUrl = `https://www.agiledrop.com${fileData.data.attributes.uri.url}`;
      const imageName = fileData.data.attributes.filename;
      const fileName = path.basename(imageUrl);
      const filePath = path.join(folderPath, fileName);

      await saveImageToFolder(imageUrl, filePath);

      const accessToken =
        "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd";
      const spaceId = "230321";

      const assetData = await createAssetInStoryblok(
        accessToken,
        spaceId,
        imageName
      );

      await uploadImageToStoryblok(
        {
          signed_request: assetData,
          path: filePath,
        },
        accessToken,
        spaceId,
        imageName
      );

      console.log("Done");
    } catch (error) {
      console.error("Error:", error);
    }
  })();});
};

export default createArticle;