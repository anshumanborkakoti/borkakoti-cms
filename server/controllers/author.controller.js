const Author = require('../models/author.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');
const ImageController = require('../controllers/image.controller');
const Thumbnail = require('../models/thumbnail.schema');
const Image = require('../models/image.schema');

module.exports.getAuthors = (req, res, next) => {
  Author
    .find()
    .populate({
      path: 'details',
      populate: {
        path: 'image'
      }
    })
    .then(authors => {
      res.status(200).json({
        message: `Fetched ${authors.length} authors in getAuthors()`,
        authors
      });
    }, reason => {
      res.status(500).json({
        message: 'Fetch authors failed!',
        reason
      });
    });
};

module.exports.saveAuthor = (req, res, next) => {
  const { name, username, password, email, address, roles, details } = req.body;
  const imageToSave = {
    ...details.image
  };
  ImageController
    .upsert(imageToSave)
    .then(savedImageData => {
      const detailsToSave = new Thumbnail({
        image: savedImageData._id,
        content: details.content,
        footer: details.footer,
        header: details.header,
        caption: details.caption
      });
      ThumbnailController
        .save(detailsToSave)
        .then(savedDetails => {
          console.log(`Thumbnail saved ${savedDetails}`);
          const tosave = new Author({
            name,
            username,
            password,
            email,
            address,
            roles,
            details: savedDetails._id
          });
          tosave
            .save()
            .then(
              author => {
                author.populate({
                  path: 'details',
                  populate: {
                    path: 'image'
                  }
                }, (error, populatedAuthor) => {
                  if (error) {
                    res.status(500).json({
                      message: `Population of Author ${tosave.name} failed. Reason ${error}`
                    });
                  } else {
                    res.status(200).json({
                      message: `${tosave.name} saved successfully`,
                      author: populatedAuthor
                    });
                  }
                })
              }, reason => {
                res.status(500).json({
                  message: 'Save author failed!',
                  reason
                });
              })
        })
        .catch(reason => { //Catch Thumbnail rejection
          res.status(500).json({
            message: `Could not save Thumbnail ${detailsToSave.header} because ${reason}`
          })
        });
    })
    .catch(reason => { //Catch image rejection
      res.status(500).json({
        message: `Could not save image ${imageToSave.publicId} because ${reason}`
      });
    });

}

module.exports.updateAuthor = (req, res, error) => {
  console.log(req.body);
  const { name, username, password, id: authorId, email, address, roles, details } = req.body;
  const imageToSave = new Image({
    ...details.image,
    _id: details.image.id
  });
  console.log(`imageToSave ${imageToSave}`);
  ImageController
    .upsert(imageToSave)
    .then(updatedImageData => {
      console.log(`Image updated: ${updatedImageData}`);
      const thumbnailToUpdate = new Thumbnail({
        _id: details.id,
        image: updatedImageData._id,
        content: details.content,
        footer: details.footer,
        header: details.header,
        caption: details.caption
      });
      console.log(`thumbnailToUpdate ${thumbnailToUpdate}`);
      ThumbnailController
        .update(thumbnailToUpdate)
        .then(updatedData => {
          console.log(`Thumbnail updated ${thumbnailToUpdate}`);
          const authorToSave = new Author({
            name,
            username,
            password,
            email,
            address,
            roles,
            details: thumbnailToUpdate._id
          });
          authorToSave._id = authorId;
          console.log(`AuthorToSave ${authorToSave}`);
          Author
            .replaceOne({ _id: authorToSave._id }, authorToSave)
            .then(updatedData => {
              authorToSave
                .populate({
                  path: 'details',
                  populate: {
                    path: 'image'
                  }
                },
                  (error, populatedAuthor) => {
                    if (error) {
                      res.status(500).json({
                        message: ` Population of ${authorToSave.name} failed. Reason ${error}`
                      });
                    } else {
                      res.status(200).json({
                        message: `${authorToSave.name} updated successfully`,
                        author: populatedAuthor
                      });
                    }
                  });
            },
              reason => {
                res.status(500).json({
                  message: `Could not update Author ${authorToSave.name} because ${reason}`
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

module.exports.deleteAuthors = (req, res, error) => {
  const authors = req.params.ids.split(',');
  let thumbnailIds = [];

  //Find thumbnail Ids
  Author
    .find({ _id: { $in: authors } })
    .then(authors => {
      thumbnailIds = authors.map(author => {
        return author.details;
      });
      ThumbnailController
        .deleteMany(thumbnailIds)
        .then(deletedData => {
          Author.deleteMany({ _id: { $in: authors } }).then(deletedData => {
            res.status(200).json({
              message: `Authors ${authors} deleted successfully`,
              deletedCount: deletedData.deletedCount
            });
          },
            //Author error
            reason => {
              res.status(500).json({
                message: `Could not delete authors ${authors} because ${reason}`
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
      //Find authors error
      res.status(500).json({
        message: `Could not find authors ${authors} because ${error}`
      })
    })

}
