import StoryblokClient from "storyblok-js-client";

const createTaxonomyTerm = async(term) => {
  const Storyblok = new StoryblokClient({
    oauthToken: "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd",
  });

  await Storyblok.post("spaces/230321/stories/", {
    story: {
      name: term.attributes.name,
      slug: term.id,
      content: {
        component: "tags",
        name: term.attributes.name,
        id: term.id,
      },
      parent_id: "318382726",
    },
  });

  console.log("Done");
}

export default createTaxonomyTerm;