import data from './allBlogPosts.json' assert { type: "json" };

const blogUrl = `https://www.agiledrop.com/jsonapi/node/blog_post/${data.data[0].id}/relationships/field_blog_cover?`;

function fetchDataFromURL(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      throw error;
    });
}

const jsonDataPromise = fetchDataFromURL(blogUrl);

jsonDataPromise.then(jsonData => {
  // Use jsonData as needed
  console.log(jsonData.links.related.href);

  fetchDataFromURL(jsonData.links.related.href)
    .then(json => {
      console.log(json.data.attributes.uri.url);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}).catch(error => {
  console.error('Error:', error);
});
