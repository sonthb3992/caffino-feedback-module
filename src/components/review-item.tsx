import React, { useEffect, useState } from "react";
import Rating from "./rating";
import ReplyItem from "./reply-item";
import { Review } from "../model/review";
import { UserInfo } from "../model/user";
import { GetReplies, PushReplyToFirebase, Reply } from "../model/reply";
import { FeedbackModuleConfig } from "../model/config";

interface ReviewItemProps {
  review: Review;
  config: FeedbackModuleConfig;
  currentUser: UserInfo;
  showUserAvatar?: boolean;
  elevated?: boolean;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  config,
  review,
  currentUser,
  showUserAvatar = true,
  elevated = true,
}) => {
  const [replying, setReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showReplies, setShowReplies] = useState<boolean>(false);

  const sendReply = async () => {
    if (!currentUser.canReply) return;
    setIsBusy(true);

    const newReply: Reply = {
      userUid: currentUser.userUid,
      comment: replyText,
      replyUid: "",
      reviewUid: review.uid,
      replierName: currentUser.displayName,
      replierImageUrl: currentUser.imageUrl,
      replyDateTime: new Date(Date.now()),
    };

    const isSuccess = await PushReplyToFirebase(config, newReply);
    if (isSuccess) {
      setReplying(false);
      setReplyText("");
    } else {
      alert("Adding reply failed");
    }
    loadReplies();
    setIsBusy(false);
  };

  const onReplyChanged = (comment: string) => {
    setReplyText(comment);
  };

  const cancelReply = () => {
    setReplyText("");
    setReplying(false);
  };

  const loadReplies = async () => {
    const _replies = await GetReplies(config, review.uid);
    setReplies(_replies);
    setShowReplies(true);
  };

  useEffect(() => {}, [review]);

  return (
    <div className={`${elevated ? "card" : ""} p-4 mb-3`}>
      <article className="media mb-0">
        {showUserAvatar && (
          <figure className="media-left   ">
            <p className="image is-64x64">
              {review.reviewerImageUrl !== "" && (
                <img src={review.reviewerImageUrl} alt="reviewer avatar"></img>
              )}
            </p>
          </figure>
        )}
        <div className="media-content">
          <div className="content">
            <div className="level m-0">
              <div className="level-left">
                <div className="is-flex is-flex-direction-column">
                  <strong className="is-size-6">{review.reviewerName}</strong>
                  <Rating disabled={true} fixedRating={review.rating}></Rating>
                </div>
              </div>
              <div className="level-right">
                <i className="is-size-7">{review.reviewDateTime.toString()}</i>
              </div>
            </div>
            <p className="has-text-weight-normal">{review.comment}</p>
            <div className="level is-mobile mb-1">
              <div className="level-left"></div>
              <div className="level-right">
                {currentUser.canReply && (
                  <button
                    className="button is-small is-primary is-size-7"
                    onClick={() => setReplying(true)}
                  >
                    Reply
                  </button>
                )}
                {review.hasReply &&
                  review.hasReply === true &&
                  (!showReplies ? (
                    <button
                      className="button is-small is-info is-size-7 ml-2"
                      onClick={() => loadReplies()}
                    >
                      Show replies
                    </button>
                  ) : (
                    <button
                      className="button is-small is-info is-size-7 ml-2"
                      onClick={() => setShowReplies(false)}
                    >
                      Hide UnA's reply
                    </button>
                  ))}
              </div>
            </div>
            {replying && (
              <div>
                <textarea
                  rows={2}
                  value={replyText}
                  maxLength={200}
                  onChange={(event) => onReplyChanged(event.target.value)}
                  className="textarea is-primary has-fixed-size"
                  placeholder="Reply here"
                ></textarea>
                <div className="buttons">
                  <button
                    onClick={sendReply}
                    className={`button mt-1 is-small is-primary ${
                      replyText === "" ? "is-static" : ""
                    } ${isBusy ? "is-loading" : ""}`}
                  >
                    <span className="icon is-small">
                      <i className="fas fa-paper-plane"></i>
                    </span>
                  </button>
                  <button
                    onClick={cancelReply}
                    className="button mt-1 is-small"
                  >
                    <span className="icon is-small">
                      <i className="fas fa-close"></i>
                    </span>
                  </button>
                </div>
              </div>
            )}
            {replies.length > 0 &&
              showReplies &&
              replies.map((r) => (
                <ReplyItem reply={r} key={r.replyUid}></ReplyItem>
              ))}
          </div>
        </div>
      </article>
    </div>
  );
};
