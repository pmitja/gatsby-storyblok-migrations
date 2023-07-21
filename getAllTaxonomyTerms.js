import fetchDataFromURL from "./utils/fetchDataFromUrl.js";

const getAllTaxonomyTerms = async () =>
  await fetchDataFromURL(
    "https://www.agiledrop.com/jsonapi/taxonomy_term/blog_categories"
  );

export default getAllTaxonomyTerms;
