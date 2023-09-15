import StoryblokClient from "storyblok-js-client";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import https from "https";
import getPodcast from "./getPodcast.js";
import pkg from "storyblok-markdown-richtext";
const { markdownToRichtext } = pkg;
import TurndownService from "turndown";

const createPodcast = async (id) => {
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

  // function fetchDataFromURL(url) {
  //   return fetch(url)
  //     .then((response) => response.json())
  //     .catch((error) => {
  //       throw error;
  //     });
  // }
  const turndownService = new TurndownService();

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

  const createAssetInStoryblok = async (accessToken, spaceId, imageName) => {
    try {
      const response = await axios.post(
        `https://api.storyblok.com/v1/spaces/${spaceId}/assets`,
        {
          filename: imageName,
          size: "400x500",
          asset_folder_id: 286431,
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


  try {
    const podcastData = await getPodcast(id);
    
    const imageUrl = `https://www.agiledrop.com${podcastData.imageSrc}`;

    const imageName = podcastData.imageName;
    const fileName = path.basename(imageUrl);
    const filePath = path.join(folderPath, fileName);
    await saveImageToFolder(imageUrl, filePath);
    
  
    const assetData = await createAssetInStoryblok(
      accessToken,
      spaceId,
      imageName
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

    await Storyblok.post("spaces/241242/stories/", {
      story: {
        name: podcastData.title,
        slug: podcastData.slug.replace("/podcast/", ""),
        content: {
          component: "podcast",
          title: podcastData.title,
          audioSrc: podcastData.audioSrc,
          episodeNumber: podcastData.episodeNumber,
          postedOn: podcastData.postedOn.substring(0,10),
          text: markdownToRichtext(turndownService.turndown(podcastData.text)),
          transcript: markdownToRichtext(turndownService.turndown(podcastData.transcript)),
          image: {
            filename: `https://a.storyblok.com/${postedImageUrl}`,
            fieldtype: "asset",
            name: podcastData.imageName,
            alt: podcastData.imageAlt
          },
          googleSrc: podcastData.googleSrc,
          appleSrc: podcastData.appleSrc,
          spotifySrc: podcastData.spotifySrc,
          seo: {
            title: `${podcastData.title} • Agiledrop`,
            twitter_title: `${podcastData.title} • Agiledrop`,
            og_title: `${podcastData.title} • Agiledrop`,
            og_description: podcastData.summary,
            twitter_description: podcastData.summary,
            description: podcastData.summary,
            og_image: `https://a.storyblok.com/${postedImageUrl}`,
            twitter_image: `https://a.storyblok.com/${postedImageUrl}`,
            "plugin": "seo_metatags",
          }
        },
        parent_id: "350140404",
      },
    });

    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
  }
};

export default createPodcast;