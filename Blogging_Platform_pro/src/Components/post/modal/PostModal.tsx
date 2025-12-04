import { Modal, Input, Upload, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import useUser from "../../../hooks/useUser";
import { useEffect, useState } from "react";
import type { PostPopupProps, UserPost } from "../../../Helper/Type";
import { App } from "antd";
export default function PostModal({
  isModalOpen,
  setIsModalOpen,
}: PostPopupProps) {
  const { currentLoggedInUserData } = useUser();
  const [postImage, setPostImage] = useState<File | null>();
  const [caption, setCaption] = useState("");
  const message = App.useApp().message;
 async function addPostData(postData: any) {
  const uid = currentLoggedInUserData?.user.id;
  if (!uid) return false;

  const formData = new FormData();
  formData.append("userId", uid);
  formData.append("content", postData.content);
  formData.append("postImage", postData.postImage);   // SAME NAME AS MULTER
  const response = await fetch("http://localhost:8000/api/userpost", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
    },
    body: formData, // 
  });

  const result = await response.json();
  return result.message === "Success";
}

  const uploadProps = {
    beforeUpload: (file: any) => {
      setPostImage(file);
      return false; // prevent auto-upload
    },
    accept: "image/*",
    showUploadList: false,
    maxCount: 1,
  };

  // ----------------- SUBMIT POST -----------------
  async function handleSubmit() {
    if (!currentLoggedInUserData) return;
    if (!postImage) {
      message.warning("Please upload an image to continue.");
    }
    else if (postImage) {
     const isSuccess = await addPostData({
    content: caption,
    postImage,
  });
  if (isSuccess) {
    message.success("Post created");
    setCaption("");
    setPostImage(null);
    setIsModalOpen(false);
  }
    }
  }
  return (
    <>
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setPostImage(null);
          setCaption("");
          setIsModalOpen(false);
          
        }}
        centered
        rootClassName="custom-modal"
        modalRender={(content) => (
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
            {content}
          </div>
        )}
      >
        <div className="text-white">
          <h2 className="text-lg font-bold mb-3">Create Post</h2>

          {/* CAPTION */}
          <Input.TextArea
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Share something..."
            className="!bg-black/40 !text-white border !border-white/20 rounded-xl mb-4 placeholder:!text-white"
          />

          {/* UPLOAD BUTTON */}
          <Upload {...uploadProps}>
            <Button
              icon={<UploadOutlined />}
              className="w-full !bg-white/10 !text-white border !border-white/20 mb-3"
            >
              Add Image
            </Button>
          </Upload>

          {/* IMAGE PREVIEW */}
          {postImage && (
            <div className="relative mb-4">
              <img
                src={URL.createObjectURL(postImage)}
                alt="preview"
                className="w-full h-64 object-contain rounded-xl border border-white/20"
              />

              <Button
                danger
                className="absolute top-3 right-3 !bg-black/70 !text-white !border-none !rounded-full"
                icon={<DeleteOutlined />}
                onClick={() => setPostImage(null)}
              />
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <Button
            type="primary"
            className="w-full py-2 bg-blue-600 rounded-xl hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </Modal>
    </>
  );
}
