const Issue = require('../models/issue.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');

module.exports.getAllIssues = (req, res, error) => {
  Issue.find()
    .populate({
      path: 'thumbnail',
      populate: {
        path: 'image'
      }
    })
    .then(issues => {
      console.log(`getAllIssues() ${issues}`);
      if (issues) {
        res.status(200).json({
          message: `${issues.length} number of issues fetched successfully`,
          issues
        });
      } else {
        res.status(404).json({
          message: `No issues found!`
        });
      }
    },
      reason => {
        res.status(500).json({
          message: `Error in getAllIssues  because ${reason}`
        });
      });
};

module.exports.saveIssueP = ({ name, label, thumbnail, published, archived, pdfUrl, latest }) => {
  const promise = new Promise((resolve, reject) => {
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
                  reject({
                    message: `Population of ${issueToSave.name} failed. Reason ${error}`
                  });
                } else {
                  resolve({
                    message: `${issueToSave.name} saved successfully`,
                    issue: populatedIssue
                  });
                }
              })

          },
            reason => {
              reject({
                message: `Could not save Issue ${issueToSave.name} because ${reason}`
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
                    reject({
                      message: ` Population of ${issueToSave.name} failed. Reason ${error}`
                    });
                  } else {
                    resolve({
                      message: `${issueToSave.name} updated successfully`,
                      issue: populatedIssue
                    });
                  }
                });
          },
            reason => {
              reject({
                message: `Could not update Issue ${issueToSave.name} because ${reason}`
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
              resolve.json({
                message: `Issues ${issueIds} deleted successfully`,
                deletedCount: deletedData.deletedCount
              });
            },
              //Issue error
              reason => {
                reject({
                  message: `Could not delete issues ${issueIds} because ${reason}`
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
        //Find issues error
        reject({
          message: `Could not find issues ${issueIds} because ${error}`
        })
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
