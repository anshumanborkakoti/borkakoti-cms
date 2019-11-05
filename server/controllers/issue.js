const Issue = require('../models/issue.schema');
const Thumbnail = require('../models/thumbnail.schema');
const Image = require('../models/image.schema');

module.exports.getAllIssues = (req, res, error) => {
  Issue.find()
    .populate({
      path: 'thumbnail',
      populate: {
        path: 'image'
      }
    })
    // .populate('posts')
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
  const { name, label, thumbnail, published, archived, pdfUrl, latest, posts } = req.body;
  //TODO change to map of postIds
  const postIds = posts.reduce((accumulator, post) => {
    return accumulator + post.id;
  }, '');

  const imageToSave = new Image({
    ...thumbnail.image
  });
  imageToSave.save().then(savedImage => {
    console.log(`Image saved: ${savedImage}`);
    const thumbnailToSave = new Thumbnail({
      image: savedImage._id,
      content: thumbnail.content,
      footer: thumbnail.footer,
      header: thumbnail.header
    });
    thumbnailToSave.save().then(savedThumbnail => {
      //TODO save posts
      console.log(`Thumbnail saved ${savedThumbnail}`);
      const issueToSave = new Issue({
        name,
        label,
        thumbnail: savedThumbnail._id,
        published,
        archived,
        pdfUrl,
        latest,
        posts: postIds
      });
      issueToSave.save().then(savedIssue => {
        res.status(200).json({
          message: `${savedIssue.name} saved successfully`,
          issue: savedIssue
        });
      },
        reason => {
          res.status(500).json({
            message: `Could not save Issue ${issueToSave.name} because ${reason}`
          })
        })
    },
      reason => {
        res.status(500).json({
          message: `Could not save Thumbnail ${thumbnail.header} because ${reason}`
        })
      });
  },
    reason => {
      res.status(500).json({
        message: `Could not save image ${imageToSave.publicId} because ${reason}`
      })
    }
  );


};

module.exports.updateIssue = (req, res, error) => {
  console.log(req.body);
  const { id, name, label, thumbnail, published, archived, pdfUrl, latest, posts } = req.body;
  //TODO change to map of postIds
  const postIds = posts.reduce((accumulator, post) => {
    return accumulator + post.id;
  }, '');

  const imageToSave = new Image({
    ...thumbnail.image,
    _id: thumbnail.image.id
  });
  console.log(`imageToSave ${imageToSave}`);
  Image.replaceOne({ _id: imageToSave._id }, imageToSave).then(updatedData => {
    console.log(`Image updated: ${updatedData}`);
    const thumbnailToSave = new Thumbnail({
      _id: thumbnail.id,
      image: imageToSave._id,
      content: thumbnail.content,
      footer: thumbnail.footer,
      header: thumbnail.header
    });
    console.log(`thumbnailToSave ${thumbnailToSave}`);
    Thumbnail.replaceOne({ _id: thumbnailToSave._id }, thumbnailToSave).then(updatedData => {
      //TODO save posts
      console.log(`Thumbnail updated ${thumbnailToSave}`);
      const issueToSave = new Issue({
        _id: id,
        name,
        label,
        thumbnail: thumbnailToSave._id,
        published,
        archived,
        pdfUrl,
        latest,
        posts: postIds
      });
      console.log(`issueToSave ${issueToSave}`);
      Issue.replaceOne({ _id: issueToSave._id }, issueToSave).then(updatedData => {
        res.status(200).json({
          message: `${issueToSave.name} updated successfully`,
          issue: issueToSave
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
  Issue.deleteMany({ _id: { $in: issues } }).then(deletedData => {
    res.status(200).json({
      message: `Issues ${issues} deleted successfully`,
      deletedCount: deletedData.deletedCount
    });
  },
    reason => {
      res.status(500).json({
        message: `Could not delete issues ${issues} because ${reason}`
      })
    })
}
