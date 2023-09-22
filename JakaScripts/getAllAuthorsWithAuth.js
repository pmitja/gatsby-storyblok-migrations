import fs from 'fs';

// Replace these with your Drupal site's information
const drupalBaseUrl = 'https://www.agiledrop.com/';
const username = 'migrate';
const password = 'agiledropdev';

let url = `${drupalBaseUrl}migrate/get-all-members`;

const authHeaderValue = `Basic ${Buffer.from(
  `${username}:${password}`
).toString('base64')}`;

const office = {
  'f8875ad8-57c2-445e-92c2-0406734222d1': 'Ljubljana',
  '4800c68d-2caa-4c0b-8593-1762760a11eb': 'Maribor',
  '14ae8cb2-0ce0-4ba5-8ef1-cd9fb25384e6': 'Celje'
};

// Create authentication headers
const headers = {
  Authorization: authHeaderValue,
  Accept: 'application/vnd.api+json' // JSON:API content type
};

// Create the HTTP GET request
const requestOptions = {
  method: 'GET',
  headers
};

let authors = [];
let unpublishedAuthors = [];

let translations = {};

const getImgUrl = async (id) => {
  return new Promise((resolve, reject) => {
    const url = `https://www.agiledrop.com/jsonapi/node/team_member/${id}/field_team_member_photo`;
    console.log(url);

    // Send the request
    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          // Handle the JSON response here
          return response.json();
        } else {
          // Handle non-OK responses (e.g., 401 Unauthorized)
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then((data) => {
        const nestedUrl =
          data.data.relationships.field_media_image.links.related.href;
        return fetch(nestedUrl, requestOptions);
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then((data) => {
        resolve(data.data.attributes.uri.url);
      })
      .catch((error) => {
        // Handle errors here
        console.error('Error:', error.message);
        reject(error);
      });
  });
};

// Send the request
fetch(url, requestOptions)
  .then((response) => {
    if (response.ok) {
      // Handle the JSON response here
      return response.json();
    } else {
      // Handle non-OK responses (e.g., 401 Unauthorized)
      throw new Error('Request failed with status ' + response.status);
    }
  })
  .then(async (data) => {
    for (const e of data) {
      if (e.langcode[0]?.value !== 'en') {
        translations[e.uuid[0].value] = {
          ...translations[e.uuid[0].value],
          [e.langcode[0]?.value]: e.field_team_member_position[0].value
        };
        continue;
      }
      const author = {
        name: e.title[0]?.value,
        id: e.uuid[0].value,
        office:
          office[e.field_team_member_location[0]?.target_uuid] ??
          e.field_team_member_location[0]?.target_uuid,
        published: e.status[0].value,
        position: e.field_team_member_position[0].value,
        photo: {
          id: e.field_team_member_photo[0].target_id,
          url: null
        }
      };
      await getImgUrl(e.uuid[0].value).then((img) => {
        author.photo.url = img;
      });
      if (e.status[0].value) {
        authors.push(author);
      } else {
        unpublishedAuthors.push(author);
      }
    }


    authors.forEach((e) => {
      if (translations[e.id]) {
        e.position = { "en": e.position, ...translations[e.id] };
      }
    });

    unpublishedAuthors.forEach((e) => {
      if (translations[e.id]) {
        e.position = { "en": e.position, ...translations[e.id] };
      }
    });



    const authorsData = JSON.stringify(authors, null, 2); // The `null, 2` parameters make the JSON string formatted with 2 spaces for indentation
    const unpublishedData = JSON.stringify(unpublishedAuthors, null, 2); // The `null, 2` parameters make the JSON string formatted with 2 spaces for indentation

    // Write the JSON data to the file
    fs.writeFileSync('./data/authorsData.json', authorsData);
    fs.writeFileSync('./data/unpublishedData.json', unpublishedData);

    console.group();
    console.log('Node length published:', authors.length);
    console.log(authors);
    console.groupEnd();
    console.group();
    console.log('Node length unpublished:', unpublishedAuthors.length);
    // console.log(unpublishedAuthors);
    console.groupEnd();
  })
  .catch((error) => {
    // Handle errors here
    console.error('Error:', error.message);
  });
