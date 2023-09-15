import StoryblokClient from "storyblok-js-client";

const getAuthorData = async (slug) => {
  const Storyblok = new StoryblokClient({
    oauthToken: "l6x9OIC4JIHRuGcGR6c2VAtt-197404-i7kfRwgsbaYyCaJU8Lfd",
  });

  const { data } = await Storyblok.get("spaces/229922/stories", {
    with_slug: `team/${slug}`,
  });

  return data;
};
export default getAuthorData;
