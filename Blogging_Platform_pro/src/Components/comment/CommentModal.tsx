import { Modal, Input, Button, Avatar } from "antd";
import Default_User from "../../assets/Default_User.jpg";
import { getUserDetails, formatPostDate } from "../../Helper/utility";
import useUser from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
export default function CommentModal({
  isOpen,
  onClose,
  onSubmit,
  commentText,
  setCommentText,
  selectedPost,
  commentData,
}: any) {
  // Debounce commentText
const [debouncedComment] = useDebounce(commentText, 500);

  const { currentLoggedInUserData } = useUser();
  if (!currentLoggedInUserData?.accessToken) return null;

  const accessToken = currentLoggedInUserData.accessToken;
  const [finalComments, setFinalComments] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedPost || !commentData?.length) return;

    (async () => {
      // 1️⃣ Flatten + attach userId + filter correct post
      const filtered = commentData
        .flatMap((u: any) =>
          u.comments.map((c: any) => ({
            ...c,
            userId: u.userId,
          }))
        )
        .filter((c: any) => c.postId === selectedPost._id);

      // 2️⃣ Fetch user details for each comment
      const withUsers = await Promise.all(
        filtered.map(async (c: any) => {
          const user = await getUserDetails(c.userId, accessToken);
          return {
            ...c,
            user,
          };
        })
      );

      setFinalComments(withUsers);
    })();
  }, [commentData, selectedPost]);

  return (
    <Modal
      title="Comments"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className="comment-modal"
    >
      <div className="flex flex-col h-[60vh]">

        {/* COMMENTS LIST */}
        <div className="flex-1 overflow-y-auto pr-2">
          <h4 className="mb-2">Comments:</h4>

          {finalComments.length === 0 && (
            <p className="text-gray-500">No comments yet.</p>
          )}

          {finalComments.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <Avatar
                  src={
                    item.user?.profilePic
                      ? `http://localhost:8000${item.user.profilePic}`
                      : Default_User
                  }
                  size={40}
                />

                <div>
                  <h3 className="font-semibold">
                    {item.user?.fullName || "Unknown User"}
                  </h3>
                  <p className="text-gray-300">{item.comment}</p>
                </div>
              </div>

              <p className="text-gray-500 text-xs">
                {formatPostDate(item.createdAt)}
              </p>
            </div>
          ))}
        </div>

        {/* ADD COMMENT */}
        <div className="border-t border-gray-700 pt-3">
          <Input.TextArea
            rows={2}
            placeholder="Write your comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <Button
            type="primary"
            className="w-full !mt-5"
            onClick={()=>onSubmit(debouncedComment)}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
