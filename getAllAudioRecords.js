import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllAudioRecords = async (podcastId) => {
  const allFiles = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/file/file?filter[filemime]=audio/mpeg`);
  const { data } = allFiles;
  let audioFiles = []
  data.map((audioData) => {
    audioFiles.push({"url": "https://www.agiledrop.com" + audioData.attributes.uri.url})
  })
  return audioFiles;
}

export default getAllAudioRecords;
