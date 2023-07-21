import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllAuthors = async () => {
  let authors = [];
  const { data } = await fetchDataFromURL("https://www.agiledrop.com/jsonapi/node/team_member/");

  data.map((user) => {
    authors.push({ name: user.attributes.title, id: user.id });
    return authors;
  })
  return authors;
};

export default getAllAuthors;