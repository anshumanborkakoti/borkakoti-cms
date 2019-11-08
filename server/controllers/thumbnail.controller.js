const Thumbnail = require('../models/thumbnail.schema');

module.exports.save = thumbnailToSave => {
  const promise = new Promise((resolve, reject) => {
    thumbnailToSave.save().then(res => {
      console.log(`Thumbnail ${thumbnailToSave.header} saved`);
      resolve(res);
    }).catch(error => {
      console.log(`Thumbnail ${thumbnailToSave.header} could not be saved because ${error}`);
      reject(error);
    })
  });
  return promise;
};

module.exports.update = thumbnailToUpdate => {
  const promise = new Promise((resolve, reject) => {
    Thumbnail
      .replaceOne({ _id: thumbnailToUpdate._id }, thumbnailToUpdate)
      .then(res => {
        console.log(`Thumbnail ${thumbnailToUpdate.header} saved`);
        resolve(res);
      }).catch(error => {
        console.log(`Thumbnail ${thumbnailToUpdate.header} could not be saved because ${error}`);
        reject(error);
      })
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
    Thumbnail.deleteMany({ _id: { $in: thumbnailIds } }).then(res => {
      console.log(`Thumbnails ${thumbnailIds} deleted. Deleted count ${res.deletedCount}`);
      resolve(res);
    }).catch(error => {
      console.log(`Thumbnails ${thumbnailIds} could not be deleted because ${error}`);
      reject(error);
    })
  });
  return promise;
};
