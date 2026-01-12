import React, { useState, useEffect } from "react";
import { fetchRatings } from "../api/ratings";
import { Star, MessageSquare, User } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetchRatings();
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">Customer Reviews</h1>

      {loading ? (
        <div className="text-white">Loading reviews...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="mc-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-text-muted">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">User #{review.user_id}</p>
                    <p className="text-xs text-text-muted">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 text-sm font-bold items-center gap-1">
                  <Star size={14} fill="currentColor" /> {review.score}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-text-muted italic">"{review.comment || "No comment provided"}"</p>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex justify-between text-xs text-text-muted">
                <span>Vehicle ID: {review.matatu_id}</span>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-full py-12 text-center text-text-muted bg-white/5 rounded-2xl border border-dashed border-white/10">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p>No reviews yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
