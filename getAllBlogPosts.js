import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllBlogPosts = async () => {
  let blogs = [];
  const { data } = await fetchDataFromURL("https://www.agiledrop.com/jsonapi/node/blog_post/?page%5Boffset%5D=500&page%5Blimit%5D=50");
  data.map((blog, index) => blog.attributes.langcode === "en" ? blogs.push(data[index]) : null);
  return blogs;
};

export default getAllBlogPosts;