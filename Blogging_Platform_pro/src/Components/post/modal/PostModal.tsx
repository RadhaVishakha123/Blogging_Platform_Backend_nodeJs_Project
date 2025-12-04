import { Modal, Input, Upload, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import useUser from "../../../hooks/useUser";
import { fileToBase64 } from "../../../Helper/utility";
import { useEffect, useState } from "react";
import type { PostPopupProps, UserPost } from "../../../Helper/Type";
import { nanoid } from "nanoid";
import { App } from "antd";
export default function PostModal({
  isModalOpen,
  setIsModalOpen,
}: PostPopupProps) {
  const { currentLoggedInUserData } = useUser();
  const [imageFile, setImageFile] = useState<File | null>();
  const [caption, setCaption] = useState("");
  const [userPostData, setUserPostData] = useState<UserPost[]>(() => {
    return JSON.parse(localStorage.getItem("userPostData") ?? "[]") || [];
  });
  const message = App.useApp().message;
  function addPostData(postData: any) {
    const uid = currentLoggedInUserData?.id;
    if (!uid) return false;
    const postId = nanoid(10);
    const newPost: UserPost = {
      postId,
      userId: uid,
      content: postData.content,
      imageUrl: postData.imageUrl,
      createdAt: new Date(),
    };
    setUserPostData((prev) => [newPost, ...prev]);
    message.success("Post added successfully!");
  }
  const uploadProps = {
    beforeUpload: (file: any) => {
      setImageFile(file);
      return false; // prevent auto-upload
    },
    accept: "image/*",
    showUploadList: false,
    maxCount: 1,
  };

  // ----------------- SUBMIT POST -----------------
  async function handleSubmit() {
    if (!currentLoggedInUserData) return;
    let imageUrl = "";
    if (!imageFile) {
      message.warning("Please upload an image to continue.");
    }
    // else if(caption==""){
    //   message.warning("A caption is required to create this post.")
    // }
    else if (imageFile) {
      imageUrl = await fileToBase64(imageFile);

      addPostData({
        content: caption,
        imageUrl,
      });
      // setActiveAction("Profile");
      setCaption("");
      setImageFile(null);
      setIsModalOpen(false);
    }
  }
  useEffect(() => {
    localStorage.setItem("userPostData", JSON.stringify(userPostData));
  }, [userPostData]);

  return (
    <>
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setImageFile(null);
          setCaption("");
          setIsModalOpen(false);
          // setActiveAction("Profile");
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
          {imageFile && (
            <div className="relative mb-4">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="w-full h-64 object-contain rounded-xl border border-white/20"
              />

              <Button
                danger
                className="absolute top-3 right-3 !bg-black/70 !text-white !border-none !rounded-full"
                icon={<DeleteOutlined />}
                onClick={() => setImageFile(null)}
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
