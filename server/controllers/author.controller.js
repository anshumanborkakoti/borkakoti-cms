const Author = require('../models/author.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');
const PostController = require('../controllers/post.controller');

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

module.exports.saveAuthorP = ({ name, username, password, email, address, roles, details }) => {
  const promise = new Promise((resolve, reject) => {
    ThumbnailController
      .save({ ...details })
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
                  reject({
                    message: `Population of Author ${tosave.name} failed. Reason ${error}`
                  });
                } else {
                  resolve({
                    message: `${tosave.name} saved successfully`,
                    author: populatedAuthor
                  });
                }
              })
            }, reason => {
              reject({
                message: 'Save author failed!',
                reason
              });
            })
      })
      .catch(reason => { //Catch Thumbnail rejection
        reject({
          message: `Could not save Thumbnail ${detailsToSave.header} because ${reason}`
        })
      });
  });
  return promise;
}

module.exports.saveAuthor = (req, res, next) => {
  this
    .saveAuthorP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.updateAuthorP = ({ name, username, password, id: authorId, email, address, roles, details }) => {
  const promise = new Promise((resolve, reject) => {
    ThumbnailController
      .update(details)
      .then(updatedData => {
        console.log(`Author's Thumbnail updated ${updatedData}`);
        const authorToSave = new Author({
          name,
          username,
          password,
          email,
          address,
          roles,
          details: details.id
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
                    reject({
                      message: ` Population of ${authorToSave.name} failed. Reason ${error}`
                    });
                  } else {
                    resolve({
                      message: `${authorToSave.name} updated successfully`,
                      author: populatedAuthor
                    });
                  }
                });
          },
            reason => {
              reject({
                message: `Could not update Author ${authorToSave.name} because ${reason}`
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

module.exports.updateAuthor = (req, res, error) => {
  this
    .updateAuthorP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.deleteAuthorsP = authorIds => {
  const promise = new Promise((resolve, reject) => {
    PostController
      .postCountP({
        authors: { $in: authorIds }
      })
      .then(aCount => {
        const count = parseInt(aCount);
        if (count > 0) {
          console.error(`Cannot delete as there are ${count} posts associated with ${authorIds}`);
          reject({
            message: `Cannot delete as there are ${count} posts associated with the author(s)`
          });
        } else {
          let thumbnailIds = [];
          //Find thumbnail Ids
          Author
            .find({ _id: { $in: authorIds } })
            .then(authors => {
              thumbnailIds = authors.map(author => {
                return author.details;
              });
              ThumbnailController
                .deleteMany(thumbnailIds)
                .then(deletedData => {
                  Author.deleteMany({ _id: { $in: authorIds } }).then(deletedData => {
                    resolve({
                      message: `Authors ${authorIds} deleted successfully`,
                      deletedCount: deletedData.deletedCount
                    });
                  },
                    //Author error
                    reason => {
                      reject({
                        message: `Could not delete authors ${authorIds} because ${reason}`
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
              //Find authors error
              reject({
                message: `Could not find authors ${authorIds} because ${error}`
              })
            })
        }
      })
      .catch(error => {
        reject({
          message: `Could not find authors ${authorIds} because ${error}`
        })
      })
  });
  return promise;
}


module.exports.deleteAuthors = (req, res, error) => {
  const authorIds = req.params.ids.split(',');
  this
    .deleteAuthorsP(authorIds)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}
