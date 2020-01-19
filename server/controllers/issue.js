const Issue = require('../models/issue.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');
const PostController = require('../controllers/post.controller');
const Utils = require('../utils');


function makeFilter({ published = null, latest = null }) {
  let filter = {};
  if (published) {
    filter = { published };
  }
  if (latest) {
    filter = {
      ...filter,
      latest
    }
  }
  return filter;
}

module.exports.getAllIssues = (req, res, error) => {

  Issue.find(makeFilter(req.query))
    .populate({
      path: 'thumbnail',
      populate: {
        path: 'image'
      }
    })
    .then(issues => {
      if (issues) {
        res.status(200).json(
          Utils.getInfoResponse(
            `${issues.length} number of issues fetched successfully`,
            { issues }
          )
        );
      } else {
        res.status(404).json(
          Utils.getErrorResponse(
            `No issues found!`
          )
        );
      }
    },
      reason => {
        res.status(500).json(
          Utils.getErrorResponse(
            `Error in getAllIssues`,
            reason
          )
        );
      });
};

function resetLatest(aLatest) {
  if (aLatest === 'false') {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    //Set existing latest issue to false
    Issue
      .updateMany({ latest: true }, { latest: false })
      .then(result => {
        console.log(`Set latest to false for ${result.nModified} issues`);
        resolve(result);
      })
      .catch(error => {
        reject(error);
      })
  });
}

module.exports.saveIssueP = ({ name, label, thumbnail, published, archived, pdfUrl, latest }) => {
  const promise = new Promise((resolve, reject) => {
    resetLatest(latest)
      .then(latestResult => {
        ThumbnailController
          .save({ ...thumbnail })
          .then(savedThumbnail => {
            console.log(`Thumbnail saved ${savedThumbnail}`);
            const issueToSave = new Issue({
              name,
              label,
              thumbnail: savedThumbnail._id,
              published,
              archived,
              pdfUrl,
              latest
            });
            issueToSave
              .save()
              .then(savedIssue => {
                console.log(`Issue saved ${issueToSave}`);
                savedIssue
                  .populate({
                    path: 'thumbnail',
                    populate: {
                      path: 'image'
                    }
                  }, (error, populatedIssue) => {
                    if (error) {
                      reject(
                        Utils.getErrorResponse(
                          `Population of ${issueToSave.name} failed.`,
                          error
                        )
                      );
                    } else {
                      resolve(
                        Utils.getInfoResponse(
                          `${issueToSave.name} saved successfully`,
                          { issue: populatedIssue }
                        )
                      );
                    }
                  })

              },
                reason => {
                  reject(
                    Utils.getErrorResponse(
                      `Could not save Issue ${issueToSave.name}.`,
                      reason
                    )
                  )
                })
          })
          .catch(reason => { //Catch Thumbnail rejection
            reject(
              Utils.getErrorResponse(
                `Could not save Thumbnail ${thumbnail.header} .`,
                reason
              )
            )
          });
      })
      .catch(error => {
        reject(
          Utils.getErrorResponse(
            `Setting latest false to issues failed.`,
            error
          )
        );
      });

  });
  return promise;
}

module.exports.saveIssue = (req, res, error) => {
  this
    .saveIssueP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.updateIssueP = ({ id, name, label, thumbnail, published, archived, pdfUrl, latest }) => {
  const promise = new Promise((resolve, reject) => {
    ThumbnailController
      .update({ ...thumbnail })
      .then(updatedData => {
        const issueToSave = new Issue({
          _id: id,
          name,
          label,
          thumbnail: thumbnail.id,
          published,
          archived,
          pdfUrl,
          latest
        });
        console.log(`issueToSave ${issueToSave}`);
        Issue
          .replaceOne({ _id: issueToSave._id }, issueToSave)
          .then(updatedData => {
            issueToSave
              .populate({
                path: 'thumbnail',
                populate: {
                  path: 'image'
                }
              },
                (error, populatedIssue) => {
                  if (error) {
                    reject(
                      Utils.getErrorResponse(
                        `Population of ${issueToSave.name} failed.`,
                        error
                      )
                    );
                  } else {
                    resolve(
                      Utils.getInfoResponse(
                        `${issueToSave.name} updated successfully`,
                        { issue: populatedIssue }
                      )
                    );
                  }
                });
          },
            reason => {
              reject(
                Utils.getErrorResponse(
                  `Could not update Issue ${issueToSave.name}`,
                  reason
                )
              )
            })
      },
        reason => {
          reject(
            Utils.getErrorResponse(
              `Could not update Thumbnail ${thumbnail.header}`,
              reason
            )
          )
        });
  });
  return promise;
}

module.exports.updateIssue = (req, res, error) => {
  this
    .updateIssueP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.deleteIssuesP = issueIds => {
  const promise = new Promise((resolve, reject) => {
    PostController
      .postCountP({
        issues: { $in: issueIds }
      })
      .then(aCount => {
        const count = parseInt(aCount);
        if (count > 0) {
          console.error(`Cannot delete as there are ${count} posts associated with ${issueIds}`);
          reject(
            Utils.getErrorResponse(
              `Cannot delete as there are ${count} posts associated with the issue(s)`,
              '404'
            )
          );
        } else {
          let thumbnailIds = [];
          //Find thumbnail Ids
          Issue
            .find({ _id: { $in: issueIds } })
            .then(issues => {
              thumbnailIds = issues.map(issue => {
                return issue.thumbnail;
              });
              ThumbnailController
                .deleteMany(thumbnailIds)
                .then(deletedData => {
                  Issue.deleteMany({ _id: { $in: issueIds } }).then(deletedData => {
                    resolve(
                      Utils.getInfoResponse(
                        `Issues ${issueIds} deleted successfully`,
                        { deletedCount: deletedData.deletedCount }
                      )
                    );
                  },
                    //Issue error
                    reason => {
                      reject(
                        Utils.getErrorResponse(
                          `Could not delete issues ${issueIds}`,
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
              //Find issues error
              reject(
                Utils.getErrorResponse(
                  `Could not delete issues ${thumbnailIds}`,
                  error
                )
              )
            })
        }
      })
      .catch(error => {
        reject(
          Utils.getErrorResponse(
            `Could not find issues ${issueIds}`,
            error
          )
        );
      })
  });
  return promise;
}

module.exports.deleteIssues = (req, res, error) => {
  const issueIds = req.params.ids.split(',');
  this
    .deleteIssuesP(issueIds)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });

}
