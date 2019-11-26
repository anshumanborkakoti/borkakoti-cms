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
    console.log(`imageToSave... ${imageToSave}`);
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

module.exports.upsertMany = aImagesToUpsertArray => {
  if (!Array.isArray(aImagesToUpsertArray) || aImagesToUpsertArray.length === 0) {
    console.log('[Image.upsertMany()] Array is empty');
    return Promise.reject('The images are not an array or the array is empty');
  }
  return new Promise((resolve, reject) => {
    let builkWriteOpts = [];
    [...aImagesToUpsertArray].forEach(aImage => {
      const { publicId, secureUrl, url, format, tags } = aImage;
      const imageToSave = {
        publicId,
        secureUrl,
        url,
        format,
        tags
      };
      builkWriteOpts.push({
        updateOne: {
          filter: { publicId: imageToSave.publicId },
          update: imageToSave,
          upsert: true
        }
      });
    });
    Image
      .bulkWrite(builkWriteOpts)
      .then(response => {
        console.log(`Images ${aImagesToUpsertArray} upserted successfully!`);
        const imgIds = aImagesToUpsertArray.map(aImage => {
          return aImage.publicId;
        }, []);
        Image
          .find({ publicId: { $in: imgIds } }, 'publicId _id', { lean: true })
          .then(images => {
            resolve({
              response,
              images
            });
          }).catch(error => {
            console.log(`Images ${imgIds} could not be fetched because ${error}`);
            reject(error);
          })

      })
      .catch(error => {
        console.log(`Images ${aImagesToUpsertArray} could not be upserted because ${error}`);
        reject(error);
      })
  });
}
