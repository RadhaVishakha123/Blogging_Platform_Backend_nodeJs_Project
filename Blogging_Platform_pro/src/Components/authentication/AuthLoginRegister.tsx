import { useState, useEffect } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { useMediaQuery } from "react-responsive";
import useUser from "../../hooks/useUser";
import Bloglog from "../../assets/Bloglog.png";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import type { User } from "../../Helper/Type";
import { nanoid } from "nanoid";

const { Title, Text } = Typography;

export default function AuthLoginRegister() {
  const message = App.useApp().message;
  const { setCurrentLoggedInUserData,loading,currentLoggedInUserData } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [form] = Form.useForm(); //Create a form instance
  const [userRegisterData, setUserRegisterData] = useState<User[]>(() => {
    return JSON.parse(localStorage.getItem("userRegisterData") ?? "[]") || [];
  });
  const navigate = useNavigate();
  // User Register Function
  async function registerUser(data:any) {
    // const id = nanoid(10);
    // const found = userRegisterData.some(
    //   (user) =>
    //     user.email.trim().toLowerCase() == data.email.trim().toLowerCase() ||
    //     user.username.trim().toLowerCase() == data.username.trim().toLowerCase()
    // );

    // if (found) {
    //   //Alert is work in react return() not in function,and message is work in function and aslo in return()
    //   message.error("User with this email or username already exists");
    //   return false;
    // } else {
    //   setUserRegisterData((prev) => [{ id: id, ...data }, ...prev]);
    //   message.success("Registration successful! Please log in.");
    //   return true;
    // }
    const res=await fetch("http://localhost:8000/api/auth/register",{
      method:"POST",
      headers:{ "Content-Type": "application/json" },
      body:JSON.stringify(data)
    });
    return res.json();

  }
  //User Login Function
  async function loginUser(data:any) {
    // const user = userRegisterData.find(
    //   (user) => user.email === email && user.password === password
    // );
    // if (!user) {
    //   message.error("Invalid email or password");
    //   return null;
    // }
    // setCurrentLoggedInUserData(user);
    // return user;
    console.log("data in login api call send",data)
const res=await fetch("http://localhost:8000/api/auth/login",{
      method:"POST",
      credentials: "include",  
      headers:{ "Content-Type": "application/json" },
      body:JSON.stringify(data)
    });
    return res.json();
  }
  //Ant Design Form callback fun call, after validation rules return success
  const onFinish = async(values: any) => {
    console.log("Form Submitted:", values);
    if (isLogin) {
      const response:any =await loginUser({   email: values.email,
      password: values.password,});
      console.log("login responce:",response)
      if (response.message !== "Login success") {
         message.error(response.message);
      return;
      }
      else {
        message.success(`Welcome `);
        setCurrentLoggedInUserData({accessToken: response.accessToken,
  user: response.user})
  document.cookie = `refreshToken=${response.refreshToken}; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
        setIsLogin(false);
        form.resetFields();
        navigate("/Home");
      }
    } else {
      const { confirmPassword, ...rest } = values;
      const response:any =await registerUser(rest);
      console.log("register responce:",response)
      if (response.message !== "User registered"){ 
        message.error(response.message);
      return;}

      else {
        message.success("Registration successful!");
        form.resetFields();
        setIsLogin(true);
      }
    }
  };
  useEffect(() => {
    localStorage.setItem("userRegisterData", JSON.stringify(userRegisterData));
  }, [userRegisterData]);
useEffect(() => {
  if (loading) return; // wait for refresh check

  // 👇 If user already logged in, redirect to Home
  if (currentLoggedInUserData) {
    navigate("/Home");
  }
}, [currentLoggedInUserData, loading]);
  return (
    <div
      className={`flex min-h-screen ${
        isMobile
          ? "flex-col bg-black text-white"
          : "flex-row items-center justify-center bg-black text-white"
      }`}
    >
      {/* LEFT SIDE IMAGE (hidden on mobile) */}
      {!isMobile && (
        <div className="flex items-center justify-center h-[80vh] mr-16">
          <img
            src={Bloglog}
            alt="Blog Platform"
            className="max-w-[80%] max-h-[80%] object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </div>
      )}

      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center px-10 py-12">
        <Card
          variant="borderless"
          className="w-full max-w-md !bg-transparent !shadow-none !border-none !text-white"
          style={{
            color: "white",
          }}
        >
          <div className="text-center mb-8">
            {/* Logo Name */}
            <h2
              className="text-4xl font-extrabold text-white tracking-wide mb-2"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              ShareMind
            </h2>

            {/* Form Header */}
            <Title level={3} className="!mb-2 !text-white">
              {isLogin ? "Welcome Back" : "Create an Account"}
            </Title>

            {/* Subtext */}
            <Text className="!text-gray-300">
              {isLogin
                ? "Login to your ShareMind account"
                : "Join ShareMind and start sharing your thoughts"}
            </Text>
          </div>

          <Form
            name="auth-form"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="on"
          >
            {!isLogin && (
              <Form.Item
                label={<span className="text-white">Usarname</span>}
                name="username"
                rules={[{ required: true, message: "Please enter your name!" }]}
              >
                <Input placeholder="John32 " size="large" />
              </Form.Item>
            )}

            <Form.Item
              label={<span className="text-white">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email!",
                },
              ]}
            >
              <Input placeholder="example@mail.com" size="large" />
            </Form.Item>

            <Form.Item
              label={<span className="text-white">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>
            {!isLogin && (
              <Form.Item
                label={<span className="text-white">Comfirm Password</span>}
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") == value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="••••••••" size="large" />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                className="rounded-lg bg-blue-600 hover:bg-blue-700 border-none"
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            </Form.Item>

            <div className="text-center">
              <Text className="!text-gray-400">
                {isLogin ? "Don't have an account? " : "Already a member? "}
              </Text>
              <Button
                type="link"
                onClick={() => setIsLogin(!isLogin)}
                className="p-0 text-blue-400 hover:text-blue-300"
              >
                {isLogin ? "Register" : "Login"}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
}
