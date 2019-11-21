const Issue = require('../models/issue.schema');
const Thumbnail = require('../models/thumbnail.schema');
const Image = require('../models/image.schema');
const ImageController = require('../controllers/image.controller');
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

module.exports.saveIssue = (req, res, error) => {
  console.log({ ...req.body });
  const { name, label, thumbnail, published, archived, pdfUrl, latest } = req.body;
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
          const issueToSave = new Issue({
            name,
            label,
            thumbnail: savedThumbnail._id,
            published,
            archived,
            pdfUrl,
            latest
          });
          issueToSave.save().then(savedIssue => {
            console.log(`Issue saved ${issueToSave}`);
            savedIssue
              .populate({
                path: 'thumbnail',
                populate: {
                  path: 'image'
                }
              }, (error, populatedIssue) => {
                if (error) {
                  res.status(500).json({
                    message: `Population of ${issueToSave.name} failed. Reason ${error}`
                  });
                } else {
                  res.status(200).json({
                    message: `${issueToSave.name} saved successfully`,
                    issue: populatedIssue
                  });
                }
              })

          },
            reason => {
              res.status(500).json({
                message: `Could not save Issue ${issueToSave.name} because ${reason}`
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

module.exports.updateIssue = (req, res, error) => {
  console.log(req.body);
  const { id, name, label, thumbnail, published, archived, pdfUrl, latest } = req.body;
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
          const issueToSave = new Issue({
            _id: id,
            name,
            label,
            thumbnail: thumbnailToUpdate._id,
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
                      res.status(500).json({
                        message: ` Population of ${issueToSave.name} failed. Reason ${error}`
                      });
                    } else {
                      res.status(200).json({
                        message: `${issueToSave.name} updated successfully`,
                        issue: populatedIssue
                      });
                    }
                  });
            },
              reason => {
                res.status(500).json({
                  message: `Could not update Issue ${issueToSave.name} because ${reason}`
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

module.exports.deleteIssues = (req, res, error) => {
  const issues = req.params.ids.split(',');
  let thumbnailIds = [];

  //Find thumbnail Ids
  Issue
    .find({ _id: { $in: issues } })
    .then(issues => {
      thumbnailIds = issues.map(issue => {
        return issue.thumbnail;
      });
      ThumbnailController
        .deleteMany(thumbnailIds)
        .then(deletedData => {
          Issue.deleteMany({ _id: { $in: issues } }).then(deletedData => {
            res.status(200).json({
              message: `Issues ${issues} deleted successfully`,
              deletedCount: deletedData.deletedCount
            });
          },
            //Issue error
            reason => {
              res.status(500).json({
                message: `Could not delete issues ${issues} because ${reason}`
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
      //Find issues error
      res.status(500).json({
        message: `Could not find issues ${issues} because ${error}`
      })
    })

}
