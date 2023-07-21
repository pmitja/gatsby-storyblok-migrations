import json from "./allBlogPosts.json" assert { type: "json" };

const index = json.data.findIndex((el) => el.id === "1835d95a-55f8-4793-9d02-ee0e13179fa2");
console.log(index); 

const data = json.data[index].attributes.body.value;

// const regex = /data-entity-uuid=['"](.*?)['"]/g;
// const entityUuids = [];

// let match;
// while ((match = regex.exec(data)) !== null) {
//   const entityUuid = match[1];
//   entityUuids.push(entityUuid);
// }

// entityUuids.forEach(entityUuid => console.log(entityUuid));
const array = [
  'f/230321/400x500/20770efb40/20230304_080732.jpg',
  'f/230321/400x500/3077b55f74/2022-6-boat_trip_1.jpeg',
  'f/230321/400x500/b9e0cdf58d/2022-3-25-_planica_ski_jumps_1.jpg',
  'f/230321/400x500/b13fd45b84/2022-3-18-welcome_spring_party_1.jpg',
  'f/230321/400x500/ea20264e44/2022-2-11-krvavec_1.jpg'
];

function replaceDrupalMediaTags(data, array) {
  const htmlCode = data;

  let replacedString = htmlCode;
  const mediaTags = htmlCode.match(/<drupal-media(.*?)><\/drupal-media>/g);
  if (mediaTags) {
    mediaTags.forEach((tag, index) => {
      const imgTag = `<img src='https://a.storyblok.com/${array[index]}' alt='image'>`;
      replacedString = replacedString.replace(tag, imgTag);
    });
    console.log(replacedString);
  }
  return replacedString;
}

replaceDrupalMediaTags(data, array);