import axios from 'axios'
import FormData from 'form-data'
import fs from "fs"

const file = './images/screenshot_2023-05-26_at_08.46.08.png'
const accessToken = "K6RW2uEVajTs0xXun1xdqQtt-197404-Uiag6Ka65eivh8S-uvdd" // Can be found at https://app.storyblok.com/#!/me/account
const spaceId = '230321'

const fileUpload = function(signed_request, success, failed) {
  var form = new FormData()
  for (var key in signed_request.fields) {
    form.append(key, signed_request.fields[key])
  }
  form.append('file', fs.createReadStream(file))
  form.submit(signed_request.post_url, function(err, res) {
    if (err) throw err
    console.log('https://a.storyblok.com/' + signed_request.fields.key + ' UPLOADED!')
  })
}

const signAsset = function(access_token) {
  axios.post('https://api.storyblok.com/v1/spaces/' + spaceId + '/assets', {
    // add the id to update an existing asset. 'id: 123,'
    filename: 'screenshot_2023-05-26_at_08.46.08.png',
    size: '400x500',
    asset_folder_id: null
  }, {
    headers: {'Authorization': access_token}
  })
  .then(function (response) {
    fileUpload(response.data, function() {
      console.log('Done')
    }, function() {
      console.log('Failed')
    })
  })
  .catch(function (error) {
    console.log(error)
  })
}

signAsset(accessToken)

// Storyblok.post('spaces/230321/assets/', {
//   "filename": file,
//   "size": "400x500"
// }).then(response => {
//   console.log(response)
// }).catch(error => { 
//   console.log(error)
// })