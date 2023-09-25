import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"

let rawData = fs.readFileSync("../data/unpublishedData.json")
const authors = JSON.parse(rawData)

// Folder where image will be saved to.
const folderName = "./imagesUnpublished";
// Get the filename of the current module file in context
const __filename = fileURLToPath(import.meta.url);
// Path to the file directory
const __dirname = path.dirname(__filename);

// Create the folder if it doesn't exist
const folderPath = path.join(__dirname, folderName);
const baseUrl = "https://www.agiledrop.com"

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

const saveStreamToFile = (url, filePath) => {


  // Path where you want to save the downloaded image

  axios.get(url, { responseType: 'stream' })
  .then((response) => {
      // Create a write stream to save the image data to a file
      const writer = fs.createWriteStream(filePath);
      console.log(response.data)
      // Pipe the image data from the response to the writer
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    })
    .then(() => {
      console.log('Image downloaded and saved to', filePath);
    })
    .catch((error) => {
      console.error('Error downloading image:', error);
    });

  }

  const saveImagesToFile = () => {

    authors.forEach(e => {

      const imagePath = folderPath + "/" + e.name + "-" + e.photo.id + '.jpg';
      saveStreamToFile(baseUrl + e.photo.url, imagePath)
      console.log(imagePath)
    }

    )


  }
  saveImagesToFile()