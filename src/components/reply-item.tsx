import React, { useEffect } from "react";
import { Review } from "../model/review";
import { Reply } from "../model/reply";
import "./mystyle.css";

interface ReplyItemProps {
  reply: Reply;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply: currentReply }) => {
  useEffect(() => {}, [currentReply]);

  return (
    <div className="">
      <article className="media mb-0">
        <figure className="media-left   ">
          <p className="image is-64x64">
            {currentReply.replierImageUrl !== "" && (
              <img
                src={currentReply.replierImageUrl}
                alt="reviewer avatar"
              ></img>
            )}
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <div className="is-flex is-flex-direction-row is-justify-content-space-between">
              <strong className="is-size-6">{currentReply.replierName}</strong>
              <i className="is-size-7">
                {currentReply.replyDateTime.toLocaleString()}
              </i>
            </div>
            <p className="has-text-weight-normal">{currentReply.comment}</p>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ReplyItem;
