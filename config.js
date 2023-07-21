module.exports = {
  storyblok: {
    export: {
      previewToken: 'QtysU6pkQmlKQQCbQVK59gtt',         // for export -> Delivery API
      options: {                                  // Content Delivery Parameters
        // starts_with: '/your-folder-slug',      // folder you want to export as CSV,
        version: 'draft',                         // version of content that should be exported
        per_page: 100,                            // 100 is max atm
        page: 1                                   // can be upped as needed.
      }
    },
    import: {
      oauthToken: 'xrY4utGYaxl6pp67K52atwtt-197404-MmE7z3YNFoXf-isFxjy2',  // for import -> Management API,
      spaceId: 230321,                             // Space ID you want to import it
      parentFolderId: 309719183,                          // Folder of the Parent ID
      importFilePath: './import/import.csv',      // File that should be imported 
    }
  }
}

//const data = html.innerHTML.trim().split("\n").map(line => line.trim()).join("\n");