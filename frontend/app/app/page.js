"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function IdeaBoard() {
  const [ideas, setIdeas] = useState([]);
  const [newIdea, setNewIdea] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch ideas from the API
  const fetchIdeas = async () => {
    try {
      const response = await fetch(`${API_URL}/api/ideas`);
      if (!response.ok) throw new Error("Failed to fetch ideas");
      const data = await response.json();
      setIdeas(data);
      setError("");
    } catch (err) {
      console.error("Error fetching ideas:", err);
      setError("Failed to load ideas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Submit a new idea
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newIdea.trim()) {
      setError("Please enter an idea");
      return;
    }

    if (newIdea.length > 280) {
      setError("Idea must be 280 characters or less");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newIdea }),
      });

      if (!response.ok) throw new Error("Failed to submit idea");

      setNewIdea("");
      await fetchIdeas(); // Refresh the list
    } catch (err) {
      console.error("Error submitting idea:", err);
      setError("Failed to submit idea. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Upvote an idea
  const handleUpvote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/ideas/${id}/upvote`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to upvote");

      // Update the local state optimistically
      setIdeas(
        ideas.map((idea) =>
          idea.id === id ? { ...idea, upvotes: idea.upvotes + 1 } : idea,
        ),
      );
    } catch (err) {
      console.error("Error upvoting idea:", err);
      setError("Failed to upvote. Please try again.");
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchIdeas();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchIdeas, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Idea Board
          </Link>
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Submit Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Share Your Idea
          </h2>

          <form onSubmit={handleSubmit}>
            <textarea
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              placeholder="What's your idea? (max 280 characters)"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              maxLength="280"
            />

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-500">
                {newIdea.length}/280 characters
              </span>

              <button
                type="submit"
                disabled={submitting || !newIdea.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Idea"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Ideas List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Ideas ({ideas.length})
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">
                No ideas yet. Be the first to share one!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <p className="text-gray-800 text-lg mb-4">{idea.text}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(idea.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>

                    <button
                      onClick={() => handleUpvote(idea.id)}
                      className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="font-semibold">{idea.upvotes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
