const Author = require('../models/author.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');
const PostController = require('../controllers/post.controller');
const util = require('../utils');

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
      res.status(200).json(util.getInfoResponse(`Fetched ${authors.length} authors in getAuthors()`, { authors }));
    }, reason => {
      res.status(500).json(util.getErrorResponse(`Fetch authors failed!`, reason));
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
                  reject(util.getErrorResponse(
                    `Population of Author ${tosave.name} failed.`,
                    error
                  ));
                } else {
                  resolve(util.getInfoResponse(
                    `${tosave.name} saved successfully`,
                    { author: populatedAuthor }
                  ));
                }
              })
            }, reason => {
              reject(util.getErrorResponse(
                'Save author failed!',
                { reason }
              ));
            })
      })
      .catch(reason => { //Catch Thumbnail rejection
        reject(util.getErrorResponse(
          `Could not save Thumbnail ${detailsToSave.header}`,
          reason
        ))
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
                    reject(util.getErrorResponse(
                      ` Population of ${authorToSave.name} failed.`,
                      error
                    ));
                  } else {
                    resolve(util.getInfoResponse(
                      `${authorToSave.name} updated successfully`,
                      { author: populatedAuthor }
                    ));
                  }
                });
          },
            reason => {
              reject(util.getErrorResponse(
                `Could not update Author ${authorToSave.name}`,
                reason
              ))
            })
      },
        reason => {
          reject(
            util.getErrorResponse(
              `Could not update Thumbnail ${thumbnail.header}`,
              reason
            )
          )
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
          reject(
            util.getErrorResponse(
              `Cannot delete as there are ${count} posts associated with ${authorIds}`,
            )
          );
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
                    resolve(
                      util.getInfoResponse(
                        `Authors ${authorIds} deleted successfully`,
                        { deletedCount: deletedData.deletedCount }
                      )
                    );
                  },
                    //Author error
                    reason => {
                      reject(
                        util.getErrorResponse(
                          `Could not delete authors ${authorIds}`,
                          reason
                        )
                      )
                    })
                }).catch(error => {
                  //Thumbnail error
                  reject(
                    util.getErrorResponse(
                      `Could not delete thumbnails ${thumbnailIds}`,
                      error
                    )
                  )
                })
            })
            .catch(error => {
              //Find authors error
              reject(
                util.getErrorResponse(
                  `Could not find authors ${authorIds}`,
                  error
                )
              )
            })
        }
      })
      .catch(error => {
        reject(
          util.getErrorResponse(
            `Could not find authors ${authorIds}`,
            error
          )
        )
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
