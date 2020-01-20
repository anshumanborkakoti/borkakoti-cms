const Comment = require('../models/transactional.model.factory').CommentsModel;
const Utils = require('../utils');

//NoAuth
module.exports.getApprovedCommentsByPost = async (req, res, error) => {
  const postId = req.params.postId;
  if (!postId) {
    res.status(500).json(Utils.getErrorResponse(
      `[getApprovedCommentsByPost()] No post Id given`,
      'No Post id'
    ));
    return;
  }
  try {
    let { statusCode, response } = await getCommentsP({ postId, approved: true });
    res.status(statusCode).json(response)
  } catch (e) {
    res.status(500).json(e);
  }
}

//Auth
module.exports.getAllComments = async (req, res, error) => {
  try {
    let { statusCode, response } = await getCommentsP({});
    res.status(statusCode).json(response)
  } catch (e) {
    res.status(500).json(e);
  }
}

//Auth
module.exports.getAllUnapprovedComments = async (req, res, error) => {
  try {
    let { statusCode, response } = await getCommentsP({ approved: false });
    res.status(statusCode).json(response)
  } catch (e) {
    res.status(500).json(e);
  }
}

//Auth
module.exports.getUnapprovedCommentsByPost = async (req, res, error) => {
  const postId = req.params.postId;
  if (!postId) {
    res.status(500).json(Utils.getErrorResponse(
      `[getUnapprovedCommentsByPost()] No post Id given`,
      'No Post id'
    ));
    return;
  }
  try {
    let { statusCode, response } = await getCommentsP({ approved: false, postId });
    res.status(statusCode).json(response)
  } catch (e) {
    res.status(500).json(e);
  }
}

//Auth
module.exports.getAllCommentsByPost = async (req, res, error) => {
  const postId = req.params.postId;
  if (!postId) {
    res.status(500).json(Utils.getErrorResponse(
      `[getCommentsP()] No post Id given`,
      'No Post id'
    ));
    return;
  }
  try {
    let { statusCode, response } = await getCommentsP({ postId });
    res.status(statusCode).json(response)
  } catch (e) {
    res.status(500).json(e);
  }
}

/**
 * private
 * @param {} param0
 */
const getCommentsP = async ({ postId = null, approved = null }) => {
  let filter = {};
  if (postId) {
    filter = { postId }
  }
  if (approved) {
    filter = {
      ...filter,
      approved
    }
  }
  let result = new Utils.ApiResponse();
  try {
    let commentModel = await Comment;
    let comments = await commentModel.find(filter).sort({ timestamp: 'desc' });
    result.response = Utils.getInfoResponse(
      `[getCommentsP()] ${comments.length} comments fetched for filter ${JSON.stringify(filter)}`,
      { comments }
    )
    result.statusCode = 200;
  } catch (error) {
    result.response = Utils.getErrorResponse(
      `[getCommentsP()] Error occurred`,
      error
    );
    result.statusCode = 500;
  }
  return result;
}

//Auth
module.exports.saveComment = async (req, res, error) => {
  const { postId, author, comment, timestamp } = req.body;
  const approved = false;

  const saveResult = new Utils.ApiResponse();
  try {
    let commentModel = await Comment;
    const result = await commentModel.create({
      postId,
      author,
      comment,
      approved,
      timestamp
    });
    saveResult.statusCode = 200;
    saveResult.response = Utils.getInfoResponse(
      `[saveComment()] Comment for post id ${postId} saved successfully. Comment id ${result._id}`,
      { commentId: result._id }
    )
  } catch (error) {
    saveResult.statusCode = 500;
    saveResult.response = Utils.getErrorResponse(
      `[saveComment()] Error occurred`,
      error
    )
  }
  res.status(saveResult.statusCode).json(saveResult.response);
}

//Auth
module.exports.approveComments = async (req, res, error) => {
  const commentIds = req.params.commentIds.split(',');
  const bulkWriteOpts = [];
  for (let id of commentIds) {
    bulkWriteOpts.push({
      updateOne: {
        filter: { _id: id },
        update: { $set: { approved: true } }
      }
    });
  }
  const result = new Utils.ApiResponse();
  try {
    let commentModel = await Comment;
    const { matchedCount, modifiedCount, upsertedCount } = await commentModel.bulkWrite(bulkWriteOpts);
    result.statusCode = 200;
    result.response = Utils.getInfoResponse(
      `[updateApproved()] Comments with ids ${commentIds} approved successfully. Matched count: ${matchedCount}, Modified count ${modifiedCount}
      Upserted count ${upsertedCount}`,
      { matchedCount, modifiedCount, upsertedCount }
    )
  } catch (error) {
    result.statusCode = 500;
    result.response = Utils.getErrorResponse(
      `[updateApproved()] Error occurred`,
      error
    );
  }
  res.status(result.statusCode).json(result.response);
}

const deleteCommentsP = async commentIds => {
  let result = new Utils.ApiResponse();
  try {
    let commentModel = await Comment;
    const { ok, deletedCount } = await commentModel.deleteMany({ _id: { $in: commentIds } });
    if (parseInt(ok) === 1) {
      result = Utils.getInfoResponse(
        `[deleteCommentsP()] ${commentIds} deleted. Deleted count ${deletedCount}`,
        null
      );
      result.statusCode = 200;
    } else {
      result = Utils.getErrorResponse(
        `[deleteCommentsP()] Could not delete all documents. Deleted count ${deletedCount}`,
        ok
      )
      result.statusCode = 500;
    }

  } catch (error) {
    result = Utils.getErrorResponse(
      `[deleteCommentsP()] Error occurred`,
      error
    )
    result.statusCode = 500;
  }
  return result;
}

//Auth
module.exports.deleteComments = async (req, res, error) => {
  const commentIds = req.params.commentIds.split(',');
  let { code, statusCode } = await deleteCommentsP(commentIds);
  res.status(statusCode).json({ code });
}
