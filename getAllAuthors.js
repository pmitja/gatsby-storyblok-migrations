import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllAuthors = async () => {
  let authors = [];
  const { data } = await fetchDataFromURL("https://www.agiledrop.com/jsonapi/node/team_member/?page%5Boffset%5D=100&page%5Blimit%5D=50");

  data.map((user) => {
    authors.push({ name: user.attributes.title, id: user.id });
    return authors;
  })
  return authors;
};

export default getAllAuthors;