import { Modal, Input, Button, Avatar } from "antd";
import Default_User from "../../assets/Default_User.jpg";
import { getUserDetails,formatPostDate} from "../../Helper/utility";

export default function CommentModal({
  isOpen,
  onClose,
  onSubmit,
  commentText,
  setCommentText,
  selectedPost,
  commentData,
}: any) {
  return (
    <Modal
      title="Add Comment"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className="comment-modal"
    >
      <div className="flex flex-col h-[60vh]">
        {/* Comments List */}
        <div className="flex-1 overflow-y-auto pr-2">
          <h4 className="mb-2">Comments:</h4>

          {commentData
            .flatMap((u: any) => u.comments)
            .filter((c: any) => c.postId === selectedPost?.postId)
            .map((comment: any, i: number) => {
              const user = getUserDetails(comment.userId);

              return (
                <>
                <div className="flex justify-between">
                <div key={i} className="flex  items-center gap-3 mb-3">
                  <Avatar src={user?.profilePic || Default_User} size={40} />
                  <div>
                    <h3 className="font-semibold">{user?.fullName}</h3>
                    <p className="text-gray-400 text-sm">{comment.comment}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">{formatPostDate(comment.createdAt)}</p>
                  </div>
                  </div>
                  </>
              );
            })}
        </div>

        {/* Add Comment */}
        <div className="border-t border-gray-700 pt-3">
          <Input.TextArea
            rows={2}
            placeholder="Write your comment…"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <Button type="primary" className="w-full !mt-5" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
