import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import StoryblokClient from "storyblok-js-client";
import pkg from "storyblok-markdown-richtext";
const { markdownToRichtext } = pkg;
import TurndownService from "turndown";
import getAuthorData from "./getAuthorUuid.js";

const createArticle = async (data) => {
  const folderName = "./images";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
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

  const generateSlug = (string) => {
    return string
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const fetchDataFromURL = async (url) => {
    try {
      const response = await fetch(url);
      return response.json();
    } catch (error) {
      throw error;
    }
  };

  const saveImageToFolder = async (imageUrl, filePath) => {
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
  };

  const uploadImageToStoryblok = async (file, accessToken, spaceId) => {
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
          newImgUrl.push("https://a.storyblok.com/" +
          file.signed_request.fields.key)
          resolve(file.signed_request.fields.key);
        }
      });
    });
  };

  const replaceDrupalMediaTags = async (data, array) => {
    let replacedString = data;
    const mediaTags = data.match(/<drupal-media(.*?)><\/drupal-media>/g);
    if (mediaTags) {
      mediaTags.forEach((tag, index) => {
        const imgTag = `<img src='${array[index]}' alt='image'>`;
        replacedString = replacedString.replace(tag, imgTag);
      });
    }
    return replacedString;
  };

  const postArticle = async () => {
    const string = await replaceDrupalMediaTags(
      attributes.body.value,
      newImgUrl
    );

    const richtextObject = markdownToRichtext(turndownService.turndown(string));
    const authorData = await getAuthorData(data.relationships.field_blog_author.data.id);
    const uuid = typeof authorData.stories[0] === "object" ? authorData.stories[0].uuid : "f4c15bf0-f304-46f6-b017-ed9fa41da8f1";
    const date = attributes.created.substring(0,10);

    console.log(data.relationships.field_category.data[0].id);

    await Storyblok.post("spaces/230321/stories/", {
      story: {
        name: attributes.title,
        slug: generateSlug(attributes.title),
        content: {
          component: "Article",
          article_title:
            attributes.title.charAt(0).toUpperCase() +
            attributes.title.slice(1),
          subtitle: "This is the subtitle of the article",
          postedOn: date,
          content: richtextObject,
          author: uuid,
          image: {
            filename: "https://a.storyblok.com/" + coverImgUrl,
            fieldtype: "asset",
            name: attributes.title,
            alt: "image alt"
          },
        },
        parent_id: "309719183",
      },
    });
  };

  const createAssetInStoryblok = async (accessToken, spaceId, imageName) => {
    try {
      const response = await axios.post(
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
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create asset in Storyblok");
      throw error;
    }
  };

  async function uploadCoverImageToStoryblok(
      file
    ) {
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
  
            coverImgUrl = file.signed_request.fields.key;
            resolve();
          }
        });
      });
    }

  const newImgUrl = [];
  let coverImgUrl;

  for (const entityUuid of entityUuids) {
    try {
      const mediaUrl = `https://www.agiledrop.com/jsonapi/media/image/${entityUuid}?include=field_media_image`;
      const mediaData = await fetchDataFromURL(mediaUrl);
      const fileUrl = `https://www.agiledrop.com/jsonapi/file/file/${mediaData.data.relationships.field_media_image.data.id}`;
      const fileData = await fetchDataFromURL(fileUrl);

      const imageUrl = `https://www.agiledrop.com${fileData.data.attributes.uri.url}`;

      const mediaCoverData = await fetchDataFromURL(
        `https://www.agiledrop.com/jsonapi/node/blog_post/${data.id}/relationships/field_media_cover?`
      );
      const coverMediaFieldUrl = `https://www.agiledrop.com/jsonapi/media/image/${mediaCoverData.data.id}?include=field_media_image`;

      const mediaFiledImage = await fetchDataFromURL(coverMediaFieldUrl);
      const coverFileUrl = `https://www.agiledrop.com/jsonapi/file/file/${mediaFiledImage.data.relationships.field_media_image.data.id}`;

      const blogCoverData = await fetchDataFromURL(coverFileUrl);
      const coverUrl = `https://www.agiledrop.com${blogCoverData.data.attributes.uri.url}`;

      const coverName = blogCoverData.data.attributes.filename;
      const imageName = fileData.data.attributes.filename;
      const coverFileName = path.basename(coverUrl);
      const coverPath = path.join(folderPath, coverFileName);
      const fileName = path.basename(imageUrl);
      const filePath = path.join(folderPath, fileName);

      await saveImageToFolder(imageUrl, filePath);
      await saveImageToFolder(coverUrl, coverPath);

      const accessToken =
        "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd";
      const spaceId = "230321";

      const assetData = await createAssetInStoryblok(
        accessToken,
        spaceId,
        imageName
      );

      const assetDataCover = await createAssetInStoryblok(
        accessToken,
        spaceId,
        coverName
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

      await uploadCoverImageToStoryblok(
        {
          signed_request: assetDataCover,
          path: coverPath,
        },
        accessToken,
        spaceId,
        coverName
      );
      console.log("Done");
    } catch (error) {
      console.error("Error:", error);
    }
    if (entityUuids.length === newImgUrl.length) {
      console.log(newImgUrl);
      await postArticle();
      console.log("POSTED!");
    }

  }

  if (entityUuids.length === 0) {
    try {
      const mediaCoverData = await fetchDataFromURL(
        `https://www.agiledrop.com/jsonapi/node/blog_post/${data.id}/relationships/field_media_cover?`
      );
      const coverMediaFieldUrl = `https://www.agiledrop.com/jsonapi/media/image/${mediaCoverData.data.id}?include=field_media_image`;

      const mediaFiledImage = await fetchDataFromURL(coverMediaFieldUrl);
      const coverFileUrl = `https://www.agiledrop.com/jsonapi/file/file/${mediaFiledImage.data.relationships.field_media_image.data.id}`;

      const blogCoverData = await fetchDataFromURL(coverFileUrl);
      const coverUrl = `https://www.agiledrop.com${blogCoverData.data.attributes.uri.url}`;

      const coverName = blogCoverData.data.attributes.filename;
      const coverFileName = path.basename(coverUrl);
      const coverPath = path.join(folderPath, coverFileName);

      await saveImageToFolder(coverUrl, coverPath);

      const accessToken =
        "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd";
      const spaceId = "230321";

      const assetDataCover = await createAssetInStoryblok(
        accessToken,
        spaceId,
        coverName
      );

      await uploadCoverImageToStoryblok(
        {
          signed_request: assetDataCover,
          path: coverPath,
        },
        accessToken,
        spaceId,
        coverName
      );

      console.log("Done");
    } catch (error) {
      console.error("Error:", error);
    }

    await postArticle();
    console.log("POSTED!");
  }
};

export default createArticle;
