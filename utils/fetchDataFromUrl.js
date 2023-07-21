function fetchDataFromURL(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      throw error;
    });
}

export default fetchDataFromURL;