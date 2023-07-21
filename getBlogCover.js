import jsonData from "./allBlogPosts.json" assert { type: "json" };

const id = jsonData.data[0].id;

function fetchDataFromURL(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
}

(async () => {
  const mediaCoverData = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/node/blog_post/${id}/relationships/field_media_cover?`);
  const mediaFiledImage = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/media/image/${mediaCoverData.data.id}?include=field_media_image`);
  const blogCoverImgUrl = await fetchDataFromURL(`https://www.agiledrop.com/jsonapi/file/file/${mediaFiledImage.data.relationships.field_media_image.data.id}`)
  console.log(blogCoverImgUrl.data.attributes.uri.url);
})();