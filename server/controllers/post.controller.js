const Post = require('../models/post.schema');
const ThumbnailController = require('../controllers/thumbnail.controller');

module.exports.savePostP = ({ authors, editHistory, archived, thumbnail, detail,
  approved, category, issues, label, content, assignedTo }) => {
  return new Promise((resolve, reject) => {
    ThumbnailController
      .upsertMany([thumbnail, content, ...detail])
      .then(response => {
        const { '0': thumbnailId, '1': contentId, ...detailsIds } = response.bulwriteRes.insertedIds;
        authors = authors.map(aAuthor => aAuthor.id);
        editHistory.forEach(edit => {
          edit.editor = edit.editor.id;
        });
        issues = issues.map(aIssue => aIssue.id);
        assignedTo = assignedTo.id
        Post
          .create(
            {
              authors,
              editHistory,
              archived,
              thumbnail: thumbnailId,
              detail: Object.values(detailsIds),
              approved,
              category: category.id,
              issues,
              label,
              content: contentId,
              assignedTo
            }
          )
          .then(response => {
            this
              .getPostsP({ _id: response._id })
              .then(post => {
                resolve({
                  message: `Post ${label} saved successfully!`,
                  post: post[0]
                });
              })
              .catch(error => {
                reject({
                  message: `Post ${label} failed to fetch because ${error}`,
                  error
                });
              })
          })
          .catch(error => {
            reject({
              message: `Post ${label} failed to save because ${error}`,
              error
            });
          })
      }).catch(error => {
        reject({
          message: `Thumbnail for Post ${label} failed to save because ${error}`,
          error
        });
      });
  });
}

module.exports.savePost = (req, res, error) => {
  this.
    savePostP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.getPostsP = filter => {
  return new Promise((resolve, reject) => {
    Post
      .find(filter)
      .populate({
        path: 'editHistory.editor'
      })
      .populate({
        path: 'authors',
        populate: {
          path: 'details',
          populate: {
            path: 'image'
          }
        }
      })
      .populate({
        path: 'thumbnail',
        populate: {
          path: 'image'
        }
      })
      .populate({
        path: 'detail',
        populate: {
          path: 'image'
        }
      })
      .populate({
        path: 'category',
        populate: {
          path: 'thumbnail',
          populate: {
            path: 'image'
          }
        }
      })
      .populate({
        path: 'issues',
        populate: {
          path: 'thumbnail',
          populate: {
            path: 'image'
          }
        }
      })
      .populate({
        path: 'content',
        populate: {
          path: 'image'
        }
      })
      .populate({
        path: 'assignedTo'
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      })
  });
}

module.exports.getPosts = (req, res, error) => {
  this.getPostsP({})
    .then(posts => {
      res.status(200).json({
        message: `Fetched ${posts.length} posts in getPosts()`,
        posts
      });
    })
    .catch(reason => {
      res.status(500).json({
        message: 'Fetch posts failed!',
        reason
      });
    })
}

module.exports.updatePostP = ({ id, authors, editHistory, archived, thumbnail, detail,
  approved, category, issues, label, content, assignedTo }) => {
  return new Promise((resolve, reject) => {
    ThumbnailController
      .upsertMany([thumbnail, content, ...detail])
      .then(response => {
        const [thumbnailId, contentId, ...detailsIds] = response.thumbIds;
        authors = authors.map(aAuthor => aAuthor.id);
        editHistory = [...editHistory].map(edit => {
          return {
            ...edit,
            editor: edit.editor.id
          }
        });
        issues = issues.map(aIssue => aIssue.id);
        assignedTo = assignedTo.id
        Post
          .findByIdAndUpdate(
            id,
            {
              authors,
              editHistory,
              archived,
              thumbnail: thumbnailId,
              detail: Object.values(detailsIds),
              approved,
              category: category.id,
              issues,
              label,
              content: contentId,
              assignedTo
            }
          )
          .then(response => {
            this
              .getPostsP({ _id: response._id })
              .then(post => {
                resolve({
                  message: `Post ${label} saved successfully!`,
                  post: post[0]
                });
              })
              .catch(error => {
                reject({
                  message: `Post ${label} failed to fetch because ${error}`,
                  error
                });
              })
          })
          .catch(error => {
            reject({
              message: `Post ${label} failed to save because ${error}`,
              error
            });
          })
      }).catch(error => {
        reject({
          message: `Thumbnail for Post ${label} failed to save because ${error}`,
          error
        });
      });
  });
}

module.exports.updatePost = (req, res, error) => {
  this.
    updatePostP(req.body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}

module.exports.deletePostsP = postIds => {
  return new Promise((resolve, reject) => {
    const thumbnailIds = [];
    //Find thumbnail Ids
    Post
      .find({ _id: { $in: postIds } })
      .then(posts => {
        posts.forEach(aPost => {
          if (aPost.thumbnail) {
            thumbnailIds.push(aPost.thumbnail);
          }
          if (aPost.content) {
            thumbnailIds.push(aPost.content);
          }
          if (aPost.detail) {
            [...aPost.detail].forEach(aDetail => thumbnailIds.push(aDetail));
          }
        });
        ThumbnailController
          .deleteMany(thumbnailIds)
          .then(deletedData => {
            Post
              .deleteMany({ _id: { $in: postIds } })
              .then(deletedData => {
                resolve({
                  message: `Posts ${postIds} deleted successfully`,
                  deletedCount: deletedData.deletedCount
                });
              },
                //Post error
                reason => {
                  reject({
                    message: `Could not delete posts ${postIds} because ${reason}`
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
        //Find posts error
        reject({
          message: `Could not find posts ${postIds} because ${error}`
        })
      })
  });
}

module.exports.deletePosts = (req, res, error) => {
  const postIds = req.params.ids.split(',');
  this
    .deletePostsP(postIds)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(reason => {
      res.status(500).json(reason);
    });
}
