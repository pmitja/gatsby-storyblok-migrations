import StoryblokClient from "storyblok-js-client";

const getAuthorData = async (slug) => {
  const Storyblok = new StoryblokClient({
    oauthToken: "e98BbkO3NT7NaGADlXOarQtt-197404-yMYPxznXVzkzxzrg_eJc",
  });

  const { data } = await Storyblok.get("spaces/229922/stories", {
    with_slug: `team-folder/${slug}`,
  });

  return data;
};
export default getAuthorData;
