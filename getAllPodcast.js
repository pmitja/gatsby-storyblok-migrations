import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllPodcast = async () => {
  let podcasts = [];
  const { data } = await fetchDataFromURL("https://www.agiledrop.com/jsonapi/node/podcast/?page%5Boffset%5D=100&page%5Blimit%5D=50");

  data.map((podcast) => {
    podcasts.push({ id: podcast.id });
    return podcasts;
  })
  return podcasts;
};

export default getAllPodcast;