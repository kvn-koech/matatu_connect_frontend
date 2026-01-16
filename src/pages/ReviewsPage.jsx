import { useState, useEffect } from "react";
import { fetchRatings, replyToReview } from "../api/ratings";
import { Star, MessageSquare, User, CornerUpLeft } from "lucide-react";

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

  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async (id) => {
    if (!replyText) return;
    setSubmitting(true);
    try {
      await replyToReview(id, replyText);
      alert("Reply added!");
      setReplyText("");
      setActiveReplyId(null);
      loadReviews();
    } catch (err) {
      alert("Failed to reply");
    } finally {
      setSubmitting(false);
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
                <span>Vehicle: {review.matatu_plate || review.matatu_id}</span>
              </div>

              {/* Manager Reply Section */}
              {review.reply ? (
                <div className="bg-emerald-500/10 p-4 rounded-lg border-l-2 border-emerald-500 mt-2">
                  <p className="text-xs text-emerald-400 font-bold mb-1 flex items-center gap-1">
                    <CornerUpLeft size={12} /> Manager's Reply
                  </p>
                  <p className="text-sm text-white">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-2">
                  {activeReplyId === review.id ? (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      <textarea
                        className="mc-input text-sm p-2"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="text-xs text-text-muted hover:text-white px-2 py-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReplySubmit(review.id)}
                          disabled={submitting}
                          className="bg-emerald-500 text-black text-xs font-bold px-3 py-1 rounded hover:bg-emerald-400"
                        >
                          {submitting ? "Sending..." : "Send Reply"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveReplyId(review.id); setReplyText(""); }}
                      className="text-emerald-400 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      <CornerUpLeft size={14} /> Reply to Customer
                    </button>
                  )}
                </div>
              )}
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
