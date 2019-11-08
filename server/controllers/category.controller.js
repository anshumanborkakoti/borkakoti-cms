const Category = require('../models/category.schema');
const Thumbnail = require('../models/thumbnail.schema');
const Image = require('../models/image.schema');
const ImageController = require('../controllers/image.controller');
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

module.exports.saveCategory = (req, res, error) => {
  console.log({ ...req.body });
  const { name, label, thumbnail, minPostDetail, maxPostDetail } = req.body;
  const imageToSave = {
    ...thumbnail.image
  };
  ImageController
    .upsert(imageToSave)
    .then(savedImageData => {
      const thumbnailToSave = new Thumbnail({
        image: savedImageData._id,
        content: thumbnail.content,
        footer: thumbnail.footer,
        header: thumbnail.header,
        caption: thumbnail.caption
      });
      ThumbnailController
        .save(thumbnailToSave)
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
                  res.status(500).json({
                    message: `Population of ${categoryToSave.name} failed. Reason ${error}`
                  });
                } else {
                  res.status(200).json({
                    message: `${categoryToSave.name} saved successfully`,
                    category: aPopulatedCategory
                  });
                }
              })

          },
            reason => {
              res.status(500).json({
                message: `Could not save Category ${categoryToSave.name} because ${reason}`
              })
            })
        })
        .catch(reason => { //Catch Thumbnail rejection
          res.status(500).json({
            message: `Could not save Thumbnail ${thumbnail.header} because ${reason}`
          })
        });
    })
    .catch(reason => { //Catch image rejection
      res.status(500).json({
        message: `Could not save image ${imageToSave.publicId} because ${reason}`
      });
    });
};

module.exports.updateCategory = (req, res, error) => {
  console.log(req.body);
  const { id, name, label, thumbnail, minPostDetail, maxPostDetail } = req.body;
  const imageToSave = new Image({
    ...thumbnail.image,
    _id: thumbnail.image.id
  });
  console.log(`imageToSave ${imageToSave}`);
  ImageController
    .upsert(imageToSave)
    .then(updatedImageData => {
      console.log(`Image updated: ${updatedImageData}`);
      const thumbnailToUpdate = new Thumbnail({
        _id: thumbnail.id,
        image: updatedImageData._id,
        content: thumbnail.content,
        footer: thumbnail.footer,
        header: thumbnail.header,
        caption: thumbnail.caption
      });
      console.log(`thumbnailToUpdate ${thumbnailToUpdate}`);
      ThumbnailController
        .update(thumbnailToUpdate)
        .then(updatedData => {
          console.log(`Thumbnail updated ${thumbnailToUpdate}`);
          const categoryToSave = new Category({
            _id: id,
            name,
            label,
            thumbnail: thumbnailToUpdate._id,
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
                      res.status(500).json({
                        message: ` Population of ${categoryToSave.name} failed. Reason ${error}`
                      });
                    } else {
                      res.status(200).json({
                        message: `${categoryToSave.name} updated successfully`,
                        category: aPopulatedCategory
                      });
                    }
                  });
            },
              reason => {
                res.status(500).json({
                  message: `Could not update Category ${categoryToSave.name} because ${reason}`
                })
              })
        },
          reason => {
            res.status(500).json({
              message: `Could not update Thumbnail ${thumbnail.header} because ${reason}`
            })
          });
    },
      reason => {
        res.status(500).json({
          message: `Could not update image ${imageToSave.publicId} because ${reason}`
        })
      }
    );
}

module.exports.deleteCategories = (req, res, error) => {
  const categories = req.params.ids.split(',');
  let thumbnailIds = [];

  //Find thumbnail Ids
  Category
    .find({ _id: { $in: categories } })
    .then(categories => {
      thumbnailIds = categories.map(aCategory => {
        return aCategory.thumbnail;
      });
      ThumbnailController
        .deleteMany(thumbnailIds)
        .then(deletedData => {
          Category.deleteMany({ _id: { $in: categories } }).then(deletedData => {
            res.status(200).json({
              message: `Categories ${categories} deleted successfully`,
              deletedCount: deletedData.deletedCount
            });
          },
            //Category error
            reason => {
              res.status(500).json({
                message: `Could not delete categories ${categories} because ${reason}`
              })
            })
        }).catch(error => {
          //Thumbnail error
          res.status(500).json({
            message: `Could not delete thumbnails ${thumbnailIds} because ${error}`
          })
        })
    })
    .catch(error => {
      //Find categories error
      res.status(500).json({
        message: `Could not find categories ${categories} because ${error}`
      })
    })

}
