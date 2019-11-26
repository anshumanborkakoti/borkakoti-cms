const Thumbnail = require('../models/thumbnail.schema');
const ImageController = require('./image.controller');

module.exports.save = ({ image, header, content, caption, footer }) => {
  const promise = new Promise((resolve, reject) => {
    ImageController
      .upsert({ ...image })
      .then(savedImageData => {
        console.log(`Image of Thumbnail ${header} saved`);
        const thumbnailToSave = new Thumbnail({
          image: savedImageData._id,
          header,
          content,
          caption,
          footer
        });
        thumbnailToSave
          .save()
          .then(res => {
            console.log(`Thumbnail ${header} saved`);
            resolve(res);
          }).catch(error => {
            console.log(`Thumbnail ${header} could not be saved because ${error}`);
            reject(error);
          })
      })
      .catch(error => {
        console.log(`Image of Thumbnail ${header} could not be saved because ${error}`);
        reject(error);
      })
  });
  return promise;
};

module.exports.update = ({ id, image, header, content, caption, footer }) => {
  const promise = new Promise((resolve, reject) => {
    ImageController
      .upsert({ ...image })
      .then(updatedImageData => {
        console.log(`Image updated: ${updatedImageData}`);
        const thumbnailToUpdate = new Thumbnail({
          _id: id,
          image: updatedImageData._id,
          content,
          footer,
          header,
          caption
        });
        Thumbnail
          .replaceOne({ _id: id }, thumbnailToUpdate)
          .then(res => {
            console.log(`Thumbnail ${header} saved`);
            resolve(res);
          }).catch(error => {
            console.log(`Thumbnail ${header} could not be saved because ${error}`);
            reject(error);
          })
      })
      .catch(error => {
        console.log(`Image of Thumbnail ${header} could not be saved because ${error}`);
        reject(error);
      });
  });
  return promise;
}



module.exports.delete = thumbnailToDelete => {
  const promise = new Promise((resolve, reject) => {
    Thumbnail.deleteOne({ _id: thumbnailToDelete.id }).then(res => {
      console.log(`Image ${thumbnailToDelete.header} deleted`);
      resolve(res);
    }).catch(error => {
      console.log(`Image ${imageToSave.header} could not be deleted because ${error}`);
      reject(error);
    })
  });
  return promise;
};

module.exports.deleteMany = thumbnailIds => {
  const promise = new Promise((resolve, reject) => {
    Thumbnail
      .deleteMany({ _id: { $in: thumbnailIds } })
      .then(res => {
        console.log(`Thumbnails ${thumbnailIds} deleted. Deleted count ${res.deletedCount}`);
        resolve(res);
      }).catch(error => {
        console.log(`Thumbnails ${thumbnailIds} could not be deleted because ${error}`);
        reject(error);
      })
  });
  return promise;
};

module.exports.upsertMany = thumbnails => {
  return new Promise((resolve, reject) => {
    let images = [];
    thumbnails.forEach(aThumb => {
      images.push(aThumb.image);
    });
    ImageController
      .upsertMany([...images])
      .then(result => {
        //Set image Ids
        thumbnails.forEach((aThumb, aIndex) => {
          const publicId = aThumb.image.publicId;
          const returnedImage = result.images.find(aResultImage => aResultImage.publicId === publicId);
          aThumb.image = returnedImage._id.toJSON();
        });
        let builkWriteOpts = [];
        [...thumbnails].forEach(aThumb => {
          const { id, image, header, content, caption, footer } = aThumb;
          let writeOpt = {};
          const thumbToSave = {
            image,
            header,
            content,
            caption,
            footer
          };
          if (!!id) {
            //If Id exists, update
            thumbToSave._id = id;
            writeOpt = {
              updateOne: {
                filter: { _id: thumbToSave._id },
                update: thumbToSave
              }
            }

          } else {
            //Insert
            writeOpt = {
              insertOne: {
                document: thumbToSave
              }
            }
          }
          builkWriteOpts.push(writeOpt);
        });
        Thumbnail
          .bulkWrite(builkWriteOpts)
          .then(res => {
            //Return correct Ids
            const thumbIds = thumbnails.map((aThumbnail, aIndex) => {
              let id = aThumbnail.id;
              if (res.insertedIds && res.insertedIds[aIndex.toString()]) {
                id = res.insertedIds[aIndex.toString()];
              }
              return id;
            });
            const response = {
              bulwriteRes: res,
              thumbIds
            }
            console.log(`Thumbnails inserted. Response: ${response}`);
            resolve(response);
          }).catch(error => {
            console.log(`Thumbnails insertion failed because ${error}`);
            reject(error);
          })
      })
      .catch(error => {
        console.log(`Thumbnail insertion failed because ${error}`);
        reject(error);
      })
  });
}
