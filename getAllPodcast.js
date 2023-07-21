import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllPodcast = async () => {
  let podcasts = [];
  const { data } = await fetchDataFromURL("https://www.agiledrop.com/jsonapi/node/podcast/");

  data.map((podcast) => {
    podcasts.push({ id: podcast.id });
    return podcasts;
  })
  return podcasts;
};

export default getAllPodcast;