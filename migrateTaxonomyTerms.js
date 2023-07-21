import createTaxonomyTerm from "./createTaxonomyTerm.js";
import getAllTaxonomyTerms from "./getAllTaxonomyTerms.js";


const terms = await getAllTaxonomyTerms();

(async function migrate () {
  terms.data.map((term) => {
    createTaxonomyTerm(term);
  })
})(); 