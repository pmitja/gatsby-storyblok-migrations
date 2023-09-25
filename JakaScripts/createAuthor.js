import jsonData from "./data/authorsData.json" assert { type: "json" };
import StoryblokClient from "storyblok-js-client";
import { dirname, join } from "path";

import { fileURLToPath } from 'url';
import fs from "fs";
import axios from 'axios'; // axios is used but not imported
import FormData from 'form-data'; // FormData is used but not imported

const accessToken = "TyymPz0AyClgLsjm4L13GQtt-209820-Nbotwd-yErC5QUnvb9Ak";
const spaceId = "253231";

const authors = jsonData


const Storyblok = new StoryblokClient({
  accessToken: accessToken, // use the variable defined above
});

const createAssetInStoryblok = async (imageName, alt) => {
  try {
    const response = await axios.post(
      `https://api.storyblok.com/v1/spaces/${spaceId}/assets`,
      {
        filename: imageName,
        size: "400x500",
        asset_folder_id: 313241,
        title: imageName.split(".")[0],
        alt: alt,
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

const uploadImageToStoryblok = async (file) => {
  const form = new FormData();
  for (const key in file.signed_request.fields) {
    form.append(key, file.signed_request.fields[key]);
  }
  form.append("file", fs.createReadStream(file.path));

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: file.signed_request.post_url,
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(function (response) {
        console.log(
          "https://a.storyblok.com/" +
          file.signed_request.fields.key +
          " UPLOADED!"
        );
        resolve(file.signed_request.fields.key);
      })
      .catch(function (error) {
        console.error("Failed to upload image to Storyblok");
        reject(error);
      });
  });
};

const createAuthor = async (author) => {

  const imageFolder = '/images';
  const imageName = `${author.name}-${author.photo.id}.jpg`;

  // Get the directory path of the current module file
  const currentDir = dirname(fileURLToPath(import.meta.url));

  // Use `join` to create the complete file path
  const filePath = join(currentDir, imageFolder, imageName);
  console.log(filePath)
  const imgAlt = author.name + " Picture"

  try {

    const assetData = createAssetInStoryblok(imageName, imgAlt)

    const postedImageUrl = await uploadImageToStoryblok(
      {
        signed_request: assetData,
        path: filePath,
      },
      accessToken,
      spaceId
    );

    const slug = replaceSpecialChars(authorData.data.attributes.title); // replaceSpecialChars is not defined
    console.log(slug);


    await Storyblok.post(`spaces/${spaceId}/stories/`, {
      story: {
        name: author.name, // authorData is not defined
        slug: author.id, // id is not defined
        content: {
          component: "teamMember",
          name: author.name,
          position: author.position.en,
          positionSi: author.position.si,
          positionDe: author.position.de,
          includeInTeam: false,
          authorId: author.id,
          office: author.office,
          image: {
            filename: `https://a.storyblok.com/${postedImageUrl}`,
            fieldtype: "asset",
            name: imageName,
            alt: imgAlt
          },
        },
        parent_id: "374409670",
      },
    });

    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
  }


}

createAuthor(authors[0])

/* authors.forEach(async (e) => {


  await createAuthor(e)
  setTimeout(() => { }, 500)
}
) */

export default createAuthor;