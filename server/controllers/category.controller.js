const Category = require('../models/category.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');

module.exports.getAllCategories = (req, res, error) => {
  Category.find()
    .populate({
      path: 'thumbnail',
      populate: {
        path: 'image'
      }
    })
    .then(aCategories => {
      console.log(`getAllCategories() ${aCategories}`);
      if (aCategories) {
        res.status(200).json({
          message: `${aCategories.length} number of categories fetched successfully`,
          categories: aCategories
        });
      } else {
        res.status(404).json({
          message: `No categories found!`
        });
      }
    },
      reason => {
        res.status(500).json({
          message: `Error in getAllCategories because ${reason}`
        });
      });
};

module.exports.saveCategoryP = ({ name, label, thumbnail, minPostDetail, maxPostDetail }) => {
  const promise = new Promise((resolve, reject) => {
    ThumbnailController
      .save({ ...thumbnail })
      .then(savedThumbnail => {
        console.log(`Thumbnail saved ${savedThumbnail}`);
        const categoryToSave = new Category({
          name,
          label,
          thumbnail: savedThumbnail._id,
          minPostDetail,
          maxPostDetail
        });
        categoryToSave.save().then(aSavedCategory => {
          console.log(`Category saved ${categoryToSave}`);
          aSavedCategory
            .populate({
              path: 'thumbnail',
              populate: {
                path: 'image'
              }
            }, (error, aPopulatedCategory) => {
              if (error) {
                reject({
                  message: `Population of ${categoryToSave.name} failed. Reason ${error}`
                });
              } else {
                resolve({
                  message: `${categoryToSave.name} saved successfully`,
                  category: aPopulatedCategory
                });
              }
            })

        },
          reason => {
            reject({
              message: `Could not save Category ${categoryToSave.name} because ${reason}`
            })
          })
      })
      .catch(reason => { //Catch Thumbnail rejection
        reject({
          message: `Could not save Thumbnail ${thumbnail.header} because ${reason}`
        })
      });
  });
  return promise;
}

module.exports.saveCategory = (req, res, error) => {
  this
    .saveCategoryP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
};

module.exports.updateCategoryP = ({ id, name, label, thumbnail, minPostDetail, maxPostDetail }) => {
  const promise = new Promise((resolve, reject) => {
    const thumbnailToUpdate = { ...thumbnail };
    ThumbnailController
      .update(thumbnailToUpdate)
      .then(updatedData => {
        console.log(`Thumbnail updated ${thumbnailToUpdate}`);
        const categoryToSave = new Category({
          _id: id,
          name,
          label,
          thumbnail: thumbnailToUpdate.id,
          minPostDetail,
          maxPostDetail
        });
        console.log(`categoryToSave ${categoryToSave}`);
        Category
          .replaceOne({ _id: categoryToSave._id }, categoryToSave)
          .then(updatedData => {
            //populate
            categoryToSave
              .populate({
                path: 'thumbnail',
                populate: {
                  path: 'image'
                }
              },
                (error, aPopulatedCategory) => {
                  if (error) {
                    reject({
                      message: ` Population of ${categoryToSave.name} failed. Reason ${error}`
                    });
                  } else {
                    resolve({
                      message: `${categoryToSave.name} updated successfully`,
                      category: aPopulatedCategory
                    });
                  }
                });
          },
            reason => {
              reject({
                message: `Could not update Category ${categoryToSave.name} because ${reason}`
              })
            })
      },
        reason => {
          reject({
            message: `Could not update Thumbnail ${thumbnail.header} because ${reason}`
          })
        });

  });
  return promise;
}

module.exports.updateCategory = (req, res, error) => {
  this
    .updateCategoryP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.deleteCategoriesP = categoryIds => {
  const promise = new Promise((resolve, reject) => {
    let thumbnailIds = [];
    //Find thumbnail Ids
    Category
      .find({ _id: { $in: categoryIds } })
      .then(categories => {
        thumbnailIds = categories.map(aCategory => {
          return aCategory.thumbnail;
        });
        ThumbnailController
          .deleteMany(thumbnailIds)
          .then(deletedData => {
            Category.deleteMany({ _id: { $in: categoryIds } }).then(deletedData => {
              resolve({
                message: `Categories ${categoryIds} deleted successfully`,
                deletedCount: deletedData.deletedCount
              });
            },
              //Category error
              reason => {
                reject({
                  message: `Could not delete categories ${categoryIds} because ${reason}`
                })
              })
          }).catch(error => {
            //Thumbnail error
            reject({
              message: `Could not delete thumbnails ${thumbnailIds} because ${error}`
            })
          })
      })
      .catch(error => {
        //Find categories error
        reject({
          message: `Could not find categories ${categoryIds} because ${error}`
        })
      })
  })
  return promise;
}

module.exports.deleteCategories = (req, res, error) => {
  const categoryIds = req.params.ids.split(',');
  this
    .deleteCategoriesP(categoryIds)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}
