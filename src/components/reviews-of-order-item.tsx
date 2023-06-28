import React, { useEffect, useState } from "react";
import { UserInfo } from "../model/user";
import { FeedbackModuleConfig } from "../model/config";
import { GetReviewsOfOrder, Review } from "../model/review";
import { ReviewItem } from "./review-item";
import "./mystyle.css";

interface ReviewsOfOrderItemProps {
  config: FeedbackModuleConfig;
  orderId: string;
  currentUser: UserInfo;
  shouldReload?: boolean;
  showUserAvatar?: boolean;
  elevated?: boolean;
}

export const ReviewsOfOrderItem: React.FC<ReviewsOfOrderItemProps> = ({
  config,
  orderId,
  currentUser,
  shouldReload = false,
  showUserAvatar = true,
  elevated = true,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async (orderId: string) => {
      const reviews = await GetReviewsOfOrder(config, orderId, 20);
      console.log("reviews", reviews);
      setReviews(reviews);
    };
    fetchReviews(orderId);
  }, [shouldReload]);

  return (
    <div>
      {reviews.map((review) => (
        <ReviewItem
          config={config}
          currentUser={currentUser}
          review={review}
          key={review.uid}
          elevated={elevated}
          showUserAvatar={showUserAvatar}
        ></ReviewItem>
      ))}
    </div>
  );
};
