const Category = require('../models/category.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');
const PostController = require('../controllers/post.controller');
const Utils = require('../utils');


module.exports.getAllCategories = (req, res, error) => {
  Category.find()
    .populate({
      path: 'thumbnail',
      populate: {
        path: 'image'
      }
    })
    .then(aCategories => {
      if (aCategories) {
        res.status(200).json(
          Utils.getInfoResponse(
            `${aCategories.length} number of categories fetched successfully`,
            { categories: aCategories }
          )
        );
      } else {
        res.status(404).json(
          Utils.getErrorResponse(
            `No categories found!`,
            '404'
          )
        );
      }
    },
      reason => {
        res.status(500).json(
          Utils.getErrorResponse(
            `Error in getAllCategories`,
            reason
          )
        );
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
                reject(
                  Utils.getErrorResponse(
                    `Population of ${categoryToSave.name} failed.`,
                    error
                  )
                );
              } else {
                resolve(
                  Utils.getInfoResponse(
                    `${categoryToSave.name} saved successfully`,
                    { category: aPopulatedCategory }
                  )
                );
              }
            })

        },
          reason => {
            reject(
              Utils.getErrorResponse(
                `Could not save Category ${categoryToSave.name}.`,
                reason
              )
            )
          })
      })
      .catch(reason => { //Catch Thumbnail rejection
        reject(
          Utils.getErrorResponse(
            `Could not save Thumbnail ${thumbnail.header}.`,
            reason
          )
        )
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
                    reject(
                      Utils.getErrorResponse(
                        `Population of ${categoryToSave.name} failed.`,
                        error
                      )
                    );
                  } else {
                    resolve(
                      Utils.getInfoResponse(
                        `${categoryToSave.name} updated successfully`,
                        { category: aPopulatedCategory }
                      )
                    );
                  }
                });
          },
            reason => {
              reject(
                Utils.getErrorResponse(
                  `Could not update Category ${categoryToSave.name}.`,
                  reason
                )
              )
            })
      },
        reason => {
          reject(
            Utils.getErrorResponse(
              `Could not update Thumbnail ${thumbnail.header}.`,
              reason
            )
          )
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
    PostController
      .postCountP({
        category: { $in: categoryIds }
      })
      .then(aCount => {
        const count = parseInt(aCount);
        if (count > 0) {
          reject(
            Utils.getErrorResponse(
              `Cannot delete as there are ${count} posts associated with the ${categoryIds}`
            )
          );
        } else {
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
                    resolve(
                      Utils.getInfoResponse(
                        `Categories ${categoryIds} deleted successfully`,
                        { deletedCount: deletedData.deletedCount }
                      )
                    );
                  },
                    //Category error
                    reason => {
                      reject(
                        Utils.getErrorResponse(
                          `Could not delete categories ${categoryIds}`,
                          reason
                        )
                      )
                    })
                }).catch(error => {
                  //Thumbnail error
                  reject(
                    Utils.getErrorResponse(
                      `Could not delete thumbnails ${thumbnailIds}`,
                      error
                    )
                  )
                })
            })
            .catch(error => {
              //Find categories error
              reject(
                Utils.getErrorResponse(
                  `Could not find categories ${categoryIds}`,
                  error
                )
              )
            })
        }
      })
      .catch(error => {
        // Count posts error
        reject(
          Utils.getErrorResponse(
            `Could not find categories ${categoryIds}`,
            error
          )
        )
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
