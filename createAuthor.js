// import jsonData from "./allBlogPosts.json" assert { type: "json" };
import StoryblokClient from "storyblok-js-client";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import https from "https";
import jsonData from "./JakaScripts/data/authorsData.json" assert { type: "json" };

const createAuthor = async (id) => {
  let postedImageUrl;

  const accessToken = "uGTf6gvzWVrGG7q8zervUgtt-197404-MYhbxsvoec3vKtLy7Gd-";
  const spaceId = "229922";
  
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
    oauthToken: accessToken,
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
          asset_folder_id: 281474,
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
    // const authorData = await fetchDataFromURL(
    //   `https://www.agiledrop.com/jsonapi/node/team_member/${id}`
    // );
    // const mediaFiledImage = await fetchDataFromURL(
    //   `https://www.agiledrop.com/jsonapi/media/image/${authorData.data.relationships.field_team_member_photo.data.id}?include=field_media_image`
    // );
    // const authorImage = await fetchDataFromURL(
    //   `https://www.agiledrop.com/jsonapi/file/file/${mediaFiledImage.data.relationships.field_media_image.data.id}`
    // );
  
    if (jsonData[id].photo.id !== 54) {
    const imageUrl = `https://www.agiledrop.com${jsonData[id].photo.url}`;
  
    const imageName = jsonData[id].name + "-" + jsonData[id].photo.id + '.jpg';
    const fileName = path.basename(imageUrl);
    const filePath = path.join(folderPath, fileName);
    await saveImageToFolder(imageUrl, filePath);
  
    const alt = `${jsonData[id].name} Picture}`;
  
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

    const slug = replaceSpecialChars(jsonData[id].name);
    console.log(slug);id
    await Storyblok.post("spaces/229922/stories/", {
      story: {
        name: jsonData[id].name,
        slug: jsonData[id].id,
        content: {
          component: "teamMember",
          name: jsonData[id].name,
          position: jsonData[id].position.en,
          positionSi: jsonData[id].position.sl,
          positionDe: jsonData[id].position.de,
          includeInTeam: false,
          authorId: jsonData[id].id,
          office: jsonData[id].office,
          image: {
            filename: `https://a.storyblok.com/${postedImageUrl}`,
            fieldtype: "asset",
            name: imageName,
            alt: `${jsonData[id].name} Picture}`
          },
        },
        parent_id: "344661287",
      },
    });
  } else {
    await Storyblok.post("spaces/229922/stories/", {
      story: {
        name: jsonData[id].name,
        slug: jsonData[id].id,
        content: {
          component: "teamMember",
          name: jsonData[id].name,
          position: jsonData[id].position,
          includeInTeam: false,
          authorId: jsonData[id].id,
          image: {
            filename: `https://a.storyblok.com/f/229922/240x300/de39279172/unknown.jpg`,
            fieldtype: "asset",
            name: "Unknown",
            alt: `Unknown Picture`
          },
        },
        parent_id: "344661287",
      },
    });
  }

    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
  }
};

export default createAuthor;