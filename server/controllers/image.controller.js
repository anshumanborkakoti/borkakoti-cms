const Image = require('../models/image.schema');

/**
 * Save new or update
 */
module.exports.upsert = ({ publicId, secureUrl, url, format, tags }) => {
  const imageToSave = {
    publicId,
    secureUrl,
    url,
    format,
    tags
  };
  const promise = new Promise((resolve, reject) => {
    console.log('imageToSave...');
    console.log(imageToSave);
    Image
      .findOneAndUpdate({ publicId: imageToSave.publicId }, imageToSave, {
        upsert: true
      }).then(res => {
        if (!res) {
          //Res is null when upserted
          Image
            .findOne({ publicId: imageToSave.publicId })
            .then(findResult => {
              console.log(`Image ${imageToSave.publicId} upserted. Response : ${findResult}`);
              resolve(findResult);
            })
            .catch(error => {
              console.log(`Image ${imageToSave.publicId} could not be upserted because ${error}`);
              reject(error);
            });
        } else {
          console.log(`Image ${imageToSave.publicId} upserted. Response : ${res}`);
          resolve(res);
        }
      }).catch(error => {
        console.log(`Image ${imageToSave.publicId} could not be upserted because ${error}`);
        reject(error);
      });
  });
  return promise;
}

module.exports.delete = imageToDelete => {
  const promise = new Promise((resolve, reject) => {
    Image.deleteOne({ _id: imageToDelete.id }).then(res => {
      console.log(`Image ${imageToSave.publicId} deleted`);
      resolve(res);
    }).catch(error => {
      console.log(`Image ${imageToSave.publicId} could not be deleted because ${error}`);
      reject(error);
    })
  });
  return promise;
}
