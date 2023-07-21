function fetchDataFromURL(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
}

const getPodcast = async (podcastId) => {
  const podcastData = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/node/podcast/${podcastId}`);
  const { data } = podcastData;
  const podcastImage = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/media/image/${podcastData.data.relationships.field_podcast_cover.data.id}?include=field_media_image`)
  const { included: [{ id }] } = podcastImage;
  const podcastImageUrl = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/file/file/${id}`)
  const podcast = {
    "title": data.attributes.title,
    "postedOn": data.attributes.changed,
    "slug": data.attributes.path.alias,
    "audioSrc": data.attributes.field_buzzsprout_link.uri,
    "imageSrc": podcastImageUrl.data.attributes.uri.url,
    "imageName": podcastImage.data.attributes.name,
    "imageAlt": podcastImage.data.attributes.alt,
    "text": data.attributes.body.value,
    "transcript": data.attributes.field_transcript.value
  }
  return podcast;
}

export default getPodcast;

//e0acc4d7-35c3-487d-9c8d-07f62b3a0bca