import React, { useState } from "react";
import {
  Alert,
  Card,
  Form,
  Input,
  Typography,
  Space,
  Modal,
  Button,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/schemas/auth-schema";
import type { LoginSchema } from "@/features/auth/schemas/auth-schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  LockOutlined,
  MailOutlined,
  LoginOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/common/GradientButton.tsx";
import OtpVerificationForm from "./otp-verify";

const { Text } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending, error } = useLogin();

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [loginCredentials, setLoginCredentials] = useState<LoginSchema | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response: any = await login(data);
      if (response?.data.success || response?.data.status === 200) {
        if (
          response?.data.data.requiresOtp ||
          response?.data.data?.requiresOTP
        ) {
          setLoginCredentials(data);
          setOtpEmail(data.email);
          setIsOtpModalOpen(true);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {}
  };

  const handleResendOtp = async () => {
    if (!loginCredentials) return;
    try {
      await login(loginCredentials);
    } catch (err) {}
  };

  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false);
    navigate("/dashboard");
  };

  const handleModalClose = () => {
    setIsOtpModalOpen(false);
  };

  return (
    <>
      {/* ==================== MAIN LOGIN PAGE ==================== */}
      <div
        className="login-page-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {/* <div className="login-logo">
          <span className="logo-icon">Admin Sign In</span>
        </div> */}

        <Card
          className="login-card"
          style={{ maxWidth: 400, width: "100%", alignItems: "center" }}
        >
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div className="login-header">
              <h2 className="login-title">Sign in</h2>
              <Text className="login-subtitle">
                Enter your email and password below to log into your account
              </Text>
            </div>

            <Form
              layout="vertical"
              onFinish={handleSubmit(onSubmit)}
              size="small"
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Email"
                    required={true}
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email?.message}
                  >
                    <Input
                      {...field}
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      placeholder="Enter your email"
                      size="large"
                    />
                  </Form.Item>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    label="Password"
                    required={true}
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                  >
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      placeholder="••••••••"
                      size="large"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                )}
              />

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  block
                  size="large"
                  icon={<LoginOutlined />}
                >
                  {isPending ? "Signing in..." : "Sign in"}
                </Button>
              </Form.Item>

              {/* Backend Error */}
              {error && (
                <Alert
                  message="Login Failed"
                  description={
                    (error as any)?.response?.data?.message ||
                    "Invalid credentials. Please try again."
                  }
                  type="error"
                  showIcon
                  style={{ borderRadius: 12, marginTop: 16 }}
                />
              )}
            </Form>

            {/* You can add social logins here later */}
          </Space>
        </Card>
      </div>

      {/* ==================== OTP MODAL ==================== */}
      <Modal
        open={isOtpModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={420}
        centered
        closeIcon={null}
        destroyOnClose
        maskClosable={false}
      >
        <OtpVerificationForm
          email={otpEmail}
          onSuccess={handleOtpSuccess}
          onResend={handleResendOtp}
        />
      </Modal>
    </>
  );
};

export default LoginForm;
