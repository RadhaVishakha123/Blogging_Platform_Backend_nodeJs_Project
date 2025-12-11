import { Modal, Input, Upload, Button } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import useUser from "../../../hooks/useUser";
import { useEffect, useState } from "react";
import type { PostPopupProps, UserPost } from "../../../Helper/Type";
import { App } from "antd";
import { useSetRecoilState } from "recoil";
import { postRefreshAtom } from "../../../recoil/atoms/postRefreshAtom";
import { API_BASE_URL } from "../../../config";
export default function PostModal({
  isModalOpen,
  setIsModalOpen,
  mode,
  postData,
}: PostPopupProps) {
  const { currentLoggedInUserData } = useUser();
  const [postImage, setPostImage] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const message = App.useApp().message;
  const setPostRefresh = useSetRecoilState(postRefreshAtom);
  const [postId, setPostId] = useState<string>("");
  const uid = currentLoggedInUserData?.user.id;
  //add post
  async function addPost(postData: any) {
    const formData = new FormData();
    formData.append("userId", uid);
    formData.append("content", postData.content);
    formData.append("postImage", postData.postImage); // SAME NAME AS MULTER
    const response = await fetch(`${API_BASE_URL}/api/userpost`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
      },
      body: formData, //
    });

    const result = await response.json();
    return result.message === "Success";
  }
  //update post
  async function updatePost(postData: any) {
    const formData = new FormData();
    formData.append("userId", uid);
    formData.append("content", postData.content);
    formData.append("postImage", postData.postImage);
    formData.append("postId", postData.postId);
    console.log("post Id data:", postData.postId);
    const response = await fetch(`${API_BASE_URL}/api/userpost/updatepost`, {
      method: "PATCH",
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
      setPreview(URL.createObjectURL(file));
      return false; // prevent auto-upload
    },
    accept: "image/*",
    showUploadList: false,
    maxCount: 1,
  };

  // ----------------- SUBMIT POST -----------------
  async function handleSubmit() {
    let isSuccess;
    if (!currentLoggedInUserData) return;
    if (mode === "create" && !postImage) {
      message.warning("Please upload an image to continue.");
      return;
    }
    if (mode == "edit") {
      isSuccess = await updatePost({
        content: caption,
        postId,
        postImage,
      });
    }

    if (mode == "create") {
      isSuccess = await addPost({
        content: caption,
        postImage,
      });
    }

    if (isSuccess) {
      message.success("Post created");
      setCaption("");
      setPostImage(null);
      setPreview(null);
      setIsModalOpen(false);
      setPostRefresh((p) => !p);
    }
  }
  useEffect(() => {
    if (isModalOpen && mode == "edit" && postData) {
      setCaption(postData.content);
      setPostId(postData._id);
      setPreview(`${API_BASE_URL}${postData.postImage}`);
      setPostImage(null);
      //setPostImage(`${API_BASE_URL}${postData.postImage}`)
    }
    if (isModalOpen && mode == "create") {
      setCaption("");
      setPostId("");
      setPreview(null);
      setPostImage(null);
    }
  }, [isModalOpen, mode, postData]);

  return (
    <>
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setPostImage(null);
          setCaption("");
          setIsModalOpen(false);
          setPreview(null)
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
          {preview && (
            <div className="relative mb-4">
              <img
                src={preview || undefined}
                alt="preview"
                className="w-full h-64 object-contain rounded-xl border border-white/20"
              />

              {/* <Button
                danger
                className="absolute top-3 right-3 !bg-black/70 !text-white !border-none !rounded-full"
                icon={<DeleteOutlined />}
                onClick={() => {setPostImage(null); setPreview(null)}}
              /> */}
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
