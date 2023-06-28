import React, { useEffect, useState } from "react";
import { FeedbackModuleConfig } from "../model/config";
import { UserInfo } from "../model/user";
import { ReviewForm } from "./review-form";
import { ReviewsOfOrderItem } from "./reviews-of-order-item";
import "./mystyle.css";

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
  const [reload, setReload] = useState<Boolean>(false);
  useEffect(() => {}, [reload]);

  return (
    <>
      <div className="section">
        <ReviewForm
          isModal={false}
          userInfo={currentUser}
          reviewConfig={config}
          orderUid={orderId}
          onSuccess={() => setReload(!reload)}
        ></ReviewForm>
      </div>
      <div className="section">
        <ReviewsOfOrderItem
          config={config}
          orderId={orderId}
          currentUser={currentUser}
        ></ReviewsOfOrderItem>
      </div>
    </>
  );
};
