import React, { useEffect, useState } from "react";
import { FeedbackModuleConfig } from "../model/config";
import { UserInfo } from "../model/user";
import { ReviewForm } from "./review-form";
import { ReviewsOfOrderItem } from "./reviews-of-order-item";
import "./mystyle.css";
import { ReviewHasReplies } from "../model/review";

interface ReviewComponentProps {
  config: FeedbackModuleConfig;
  orderId: string;
  currentUser: UserInfo;
  showUserAvatar?: boolean;
  elevated?: boolean;
}

export const ReviewComponent: React.FC<ReviewComponentProps> = ({
  config,
  orderId,
  currentUser,
  showUserAvatar = true,
  elevated = true,
}) => {
  const [reload, setReload] = useState<boolean>(false);
  const [hasReview, setHasReview] = useState<boolean>(false);
  useEffect(() => {
    const fetchReviews = async () => {
      const result = await ReviewHasReplies(config, orderId);
      setHasReview(result);
    };
    fetchReviews();
  }, [reload]);

  return (
    <>
      <div className="p-3">
        {!hasReview && (
          <ReviewForm
            isModal={false}
            userInfo={currentUser}
            reviewConfig={config}
            orderUid={orderId}
            onSuccess={() => setReload(!reload)}
          ></ReviewForm>
        )}
      </div>
      <div className="p-3">
        {hasReview && (
          <ReviewsOfOrderItem
            config={config}
            orderId={orderId}
            shouldReload={reload}
            currentUser={currentUser}
          ></ReviewsOfOrderItem>
        )}
      </div>
    </>
  );
};
