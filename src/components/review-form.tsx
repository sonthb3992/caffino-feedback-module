import React, { useEffect, useState } from "react";
import { PushReviewToFirebase, Review } from "../model/review";
import Rating from "./rating";
import { UserInfo } from "../model/user";
import { FeedbackModuleConfig } from "../model/config";
import { useTranslation } from "react-i18next";

interface ReviewFormProps {
  isModal: boolean;
  userInfo: UserInfo;
  reviewConfig: FeedbackModuleConfig;
  orderUid: string;
  isActived?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  onFailure?: (error: unknown) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  isModal,
  userInfo,
  reviewConfig,
  orderUid,
  isActived,
  onClose,
  onSuccess,
  onFailure,
}) => {
  const [actived, setActived] = useState<boolean>(false);
  const [commentLabel, setCommentLabel] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleResetForm = () => {
    setRating(0);
    setCommentLabel("");
    setComment("");
    setIsPublic(true);
    setIsSending(false);
    setActived(false);
    if (onClose !== undefined) onClose();
  };

  const onRatingChanged = (newRating: number) => {
    setRating(newRating);
    setCommentLabel("reviewForm." + newRating.toString() + "star");
  };

  const onCommentChanged = (comment: string) => {
    setComment(comment);
  };

  const handlePublicChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(ev.target.value);
    setIsPublic(ev.target.value === "public");
  };

  const sendReview = async () => {
    if (rating === 0) {
      alert("Please rate your order.");
      return;
    }
    const review: Review = {
      orderId: orderUid,
      rating: rating,
      userUid: userInfo.userUid,
      comment: comment,
      uid: "",
      isPublic: isPublic,
      reviewerName: userInfo.displayName ?? "Anonymous user",
      reviewerImageUrl: userInfo.imageUrl ?? "",
      reviewDateTime: new Date(Date.now()),
    };
    setIsSending(true);
    const isSuccess = await PushReviewToFirebase(
      reviewConfig,
      review,
      onSuccess,
      onFailure
    );
    setIsSending(false);
    if (isSuccess) {
      handleResetForm();
      return;
    }
    setIsSending(false);
  };

  useEffect(() => {
    if (isActived !== undefined) setActived(isActived);
  }, [isActived]);

  return (
    <div
      className={`${isModal ? "modal" : ""} ${
        isModal && actived ? "is-active" : ""
      }`}
    >
      {isModal && <div className="modal-background"></div>}
      <div className="modal-card card">
        {isModal && (
          <header className="modal-card-head">
            <p className="modal-card-title">{t("Review order")}</p>
            <button
              className="delete"
              onClick={() => handleResetForm()}
              aria-label="close"
            ></button>
          </header>
        )}
        <section className="modal-card-body">
          <div className="block is-flex is-justify-content-center">
            <label className="title is-5">{t("reviewForm.plsRate")}</label>
          </div>
          <div className="block is-flex is-justify-content-center">
            <Rating
              fixedRating={rating}
              onRatingChanged={(newRating) => onRatingChanged(newRating)}
            ></Rating>
          </div>
          {rating >= 1 && (
            <div className="block is-flex is-justify-content-center">
              <label>{t(commentLabel)}</label>
            </div>
          )}
          {rating >= 1 && (
            <div className="block">
              <textarea
                value={comment}
                rows={3}
                maxLength={500}
                onChange={(event) => onCommentChanged(event.target.value)}
                className="textarea is-primary has-fixed-size"
                placeholder={t("reviewForm.commentPlaceholder").toString()}
              ></textarea>
            </div>
          )}
          {rating >= 1 && (
            <div className="block">
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="answer"
                    value="public"
                    onChange={handlePublicChanged}
                    defaultChecked
                  ></input>
                  {" Public my review"}
                </label>
                <label className="radio ml-3">
                  <input
                    type="radio"
                    name="answer"
                    value="private"
                    onChange={handlePublicChanged}
                  ></input>
                  {" Do not public my review"}
                </label>
              </div>
            </div>
          )}
        </section>
        <footer className={`${isModal ? "modal-card-foot" : ""}`}>
          <div className="buttons pl-5 pb-5">
            <button
              onClick={() => sendReview()}
              className={`button is-success ${isSending ? "is-loading" : ""}`}
            >
              Sent
            </button>
            {isModal && (
              <button className="button" onClick={() => handleResetForm()}>
                Cancel
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};