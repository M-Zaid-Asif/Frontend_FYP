import React, { useEffect, useState } from "react";
import axiosApi from "../../axiosApi";
import { Send, UserCircle, Trash2, Edit2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

const CommentSection = ({ reportId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axiosApi.get(`/users/${reportId}`);
        setComments(res.data.data || []);
      } catch (err) {
        void err;
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [reportId]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) return toast.error("Please login to comment");

    try {
      const res = await axiosApi.post(`/users/${reportId}`, {
        content: newComment,
      });
      setComments((prev) => [...prev, res.data.data]);
      setNewComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to post comment");
      void err;
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    const originalComments = [...comments];
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    try {
      await axiosApi.delete(`/users/c/${commentId}`);
      toast.success("Comment deleted");
    } catch (err) {
      setComments(originalComments);
      toast.error("Could not delete comment");
      void err;
    }
  };

  const handleUpdate = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      await axiosApi.patch(`/users/c/${commentId}`, { content: editContent });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: editContent } : c,
        ),
      );
      setEditingId(null);
      toast.success("Comment updated");
    } catch (err) {
      toast.error("Update failed");
      void err;
    }
  };

  return (
    <div className="mt-4 border-t pt-4 animate-in fade-in duration-300">
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {loading ? (
          <p className="text-xs text-gray-400">Loading...</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              className="group flex gap-2 items-start bg-gray-50 p-2 rounded relative"
            >
              <UserCircle size={14} className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-gray-700">
                    {c.user?.name}
                  </p>

                  {/* Only show actions if current user owns the comment */}
                  {currentUser?.id === c.userId && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditContent(c.content);
                        }}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>

                {editingId === c.id ? (
                  <div className="mt-1 flex gap-1">
                    <input
                      className="text-xs border rounded p-1 flex-1"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdate(c.id)}
                      className="text-green-600"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">{c.content}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-4 bg-white border rounded-lg p-1 focus-within:ring-2 focus-within:ring-blue-200 transition">
        <input
          className="flex-1 p-2 text-sm outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
