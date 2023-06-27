import React, { useEffect, useState } from "react";
import Rating from "./rating";
import ReplyItem from "./reply-item";
import { UserInfo } from "../model/user";
import { GetReplies, PushReplyToFirebase, Reply } from "../model/reply";
import { FeedbackModuleConfig } from "../model/config";
import { GetReviewsOfOrder, Review } from "../model/review";
import { ReviewItem } from "./review-item";

interface ReviewsOfOrderItemProps {
  config: FeedbackModuleConfig;
  orderId: string;
  currentUser: UserInfo;
  showUserAvatar?: boolean;
  elevated?: boolean;
}

export const ReviewsOfOrderItem: React.FC<ReviewsOfOrderItemProps> = ({
  config,
  orderId,
  currentUser,
  showUserAvatar = true,
  elevated = false,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = async (orderId: string) => {
    const reviews = await GetReviewsOfOrder(config, orderId, 20);
    setReviews(reviews);
  };

  useEffect(() => {
    fetchReviews(orderId);
  }, [orderId]);

  return (
    <>
      {reviews &&
        reviews.map((review) => {
          <div>
            <ReviewItem
              config={config}
              currentUser={currentUser}
              review={review}
              key={review.uid}
              elevated={elevated}
              showUserAvatar={showUserAvatar}
            ></ReviewItem>
          </div>;
        })}
    </>
  );
};
