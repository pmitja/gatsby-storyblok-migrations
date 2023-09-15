import jsonData from "./allBlogPosts.json" assert { type: "json" };
import StoryblokClient from "storyblok-js-client";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import https from "https";

const createAuthor = async (id) => {
  let postedImageUrl;

  const accessToken = "l6x9OIC4JIHRuGcGR6c2VAtt-197404-i7kfRwgsbaYyCaJU8Lfd";
  const spaceId = "241242";

  const folderName = "./images";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const folderPath = path.join(__dirname, folderName);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  function fetchDataFromURL(url) {
    return fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
  }

  const Storyblok = new StoryblokClient({
    oauthToken: "l6x9OIC4JIHRuGcGR6c2VAtt-197404-i7kfRwgsbaYyCaJU8Lfd",
  });

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

  const createAssetInStoryblok = async (accessToken, spaceId, imageName, alt) => {
    try {
      const response = await axios.post(
        `https://api.storyblok.com/v1/spaces/${spaceId}/assets`,
        {
          filename: imageName,
          size: "400x500",
          asset_folder_id: 286421,
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

          resolve(file.signed_request.fields.key);
        }
      });
    });
  };

  const replaceSpecialChars = (inputString) => {
    const charMap = {
      'š': 's',
      'ž': 'z',
      'ć': 'c',
      'č': 'c'
      // Add more mappings as needed
    };
  
    let result = '';
    for (const char of inputString) {
      result += charMap[char] || char;
    }
  
    return result;
  };

  try {
    const authorData = await fetchDataFromURL(
      `https://www.agiledrop.com/jsonapi/node/team_member/${id}`
    );
    const mediaFiledImage = await fetchDataFromURL(
      `https://www.agiledrop.com/jsonapi/media/image/${authorData.data.relationships.field_team_member_photo.data.id}?include=field_media_image`
    );
    const authorImage = await fetchDataFromURL(
      `https://www.agiledrop.com/jsonapi/file/file/${mediaFiledImage.data.relationships.field_media_image.data.id}`
    );
  
    const imageUrl = `https://www.agiledrop.com${authorImage.data.attributes.uri.url}`;
  
    const imageName = authorImage.data.attributes.filename;
    const fileName = path.basename(imageUrl);
    const filePath = path.join(folderPath, fileName);
    await saveImageToFolder(imageUrl, filePath);
  
    const alt = `${authorData.data.attributes.title}, ${authorData.data.attributes.field_team_member_position}`;
  
    const assetData = await createAssetInStoryblok(
      accessToken,
      spaceId,
      imageName,
      alt
    );
  
    postedImageUrl = await uploadImageToStoryblok(
      {
        signed_request: assetData,
        path: filePath,
      },
      accessToken,
      spaceId,
      imageName
    );

    const slug = replaceSpecialChars(authorData.data.attributes.title);
    console.log(slug);

    await Storyblok.post("spaces/241242/stories/", {
      story: {
        name: authorData.data.attributes.title,
        slug: id,
        content: {
          component: "teamMember",
          name: authorData.data.attributes.title,
          position: authorData.data.attributes.field_team_member_position,
          authorId: id,
          image: {
            filename: `https://a.storyblok.com/${postedImageUrl}`,
            fieldtype: "asset",
            name: authorImage.data.attributes.title,
            alt: authorImage.data.attributes.alt
          },
        },
        parent_id: "350133011",
      },
    });

    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
  }
};

export default createAuthor;