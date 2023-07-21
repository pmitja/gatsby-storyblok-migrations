import StoryblokClient from "storyblok-js-client";

const getAuthorData = async (slug) => {
  const Storyblok = new StoryblokClient({
    oauthToken: "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd",
  });

  const { data } = await Storyblok.get("spaces/230321/stories", {
    with_slug: `authors/${slug}`,
  });

  return data;
};
export default getAuthorData;
