import fs from "fs";
import https from "https";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import FormData from "form-data";

const createAudioAsset = async (url) => {
  let postedImageUrl;
  const accessToken = "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd";
  const spaceId = "230321";

  // Folder where image will be saved to.
  const folderName = "./audio";

  // Get the filename of the current module file in context
  const __filename = fileURLToPath(import.meta.url);
  // Path to the file directory
  const __dirname = path.dirname(__filename);

  // Create the folder if it doesn't exist
  const folderPath = path.join(__dirname, folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const saveAudioToFolder = async (audioUrl, filePath) => {
    const file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      https.get(audioUrl, (response) => {
        response.pipe(file);

        response.on("end", () => {
          console.log(`Audio downloaded and saved to ${filePath}`);
          resolve();
        });

        response.on("error", (error) => {
          console.error(`Error downloading the audio: ${error}`);
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
          asset_folder_id: 249307,
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
    const audioFileName = path.basename(url);
    const audioPath = path.join(folderPath, audioFileName);
    await saveAudioToFolder(url, audioPath);

    const assetData = await createAssetInStoryblok(
      accessToken,
      spaceId,
      audioFileName
    );
  
    postedImageUrl = await uploadImageToStoryblok(
      {
        signed_request: assetData,
        path: audioPath,
      },
      accessToken,
      spaceId,
      audioFileName
    );

    console.log("Done");
  } catch (error) {
    console.error("Error:", error);
  }
};

export default createAudioAsset;
