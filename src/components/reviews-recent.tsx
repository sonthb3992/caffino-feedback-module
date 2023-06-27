import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetRecentReviews, Review } from "../model/review";
import { FeedbackModuleConfig } from "../model/config";
import { UserInfo } from "../model/user";
import { ReviewItem } from "./review-item";

interface RecentReviewsComponentProps {
  config: FeedbackModuleConfig;
  currentUser: UserInfo;
  loadCount: number;
  showUserAvatar?: boolean;
  elevated?: boolean;
}

export const RecentReviewsComponent: React.FC<RecentReviewsComponentProps> = ({
  config,
  currentUser,
  loadCount,
  showUserAvatar = true,
  elevated = false,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const result = await GetRecentReviews(config, loadCount);
      setReviews(result);
    };
    fetchReviews();
  }, []);

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="columns is-mobile is-multiline">
            {reviews.map((review) => (
              <div className="column is-half-desktop">
                <ReviewItem
                  key={review.uid}
                  review={review}
                  config={config}
                  currentUser={currentUser}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
