import React, { useState } from "react";
import {
  Alert,
  Card,
  Form as AntForm,
  Input,
  Typography,
  Space,
  Divider,
  Modal,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/features/auth/schemas/auth-schema";
import type { LoginSchema } from "@/features/auth/schemas/auth-schema";
import { useLogin } from "@/features/auth/hooks/use-login";
import { LockOutlined, MailOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import GradientButton from "@/components/common/GradientButton.tsx";
import OtpVerificationForm from "./otp-verify"; // adjust path
import "@/assets/styles/LoginForm.css";

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
      console.log("response response:", response.data);
      if (response?.data.success || response?.data.status === 200) {
        if (response?.data.data.requiresOtp || response?.data.data?.requiresOTP) {
          // Save credentials for resend
          setLoginCredentials(data);
          setOtpEmail(data.email);
          setIsOtpModalOpen(true); // Open modal popup
        } else {
          // Direct login success (no OTP)
          navigate("/dashboard");
        }
      } 
    } catch (err) {

    }
  };
  console.log("error error:", error);
  // Resend OTP → call login API again
  const handleResendOtp = async () => {
    if (!loginCredentials) return;
    try {
      await login(loginCredentials); // Silent re-call
    } catch (err) {
      // Ignore or show toast if needed
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpModalOpen(false);
    navigate("/dashboard");
  };

  const handleModalClose = () => {
    setIsOtpModalOpen(false);
    // Optional: clear form or keep it
  };

  return (
    <>
      {/* ==================== MAIN LOGIN CARD ==================== */}
      <div className="login-page-container">
        <Card className="login-card">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className="login-header">
              <Text type="secondary" className="login-subtitle">
                Sign in to continue to your account
              </Text>
            </div>

            <Divider className="login-divider" />

            <AntForm
              layout="vertical"
              onFinish={handleSubmit(onSubmit)}
              size="large"
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <AntForm.Item
                    label="Email Address"
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email?.message}
                    required
                  >
                    <Input
                      {...field}
                      prefix={<MailOutlined className="input-icon" />}
                      placeholder="Enter your email"
                      autoComplete="email"
                      allowClear
                      className="login-input"
                    />
                  </AntForm.Item>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <AntForm.Item
                    label="Password"
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                    required
                  >
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined className="input-icon" />}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="login-input"
                    />
                  </AntForm.Item>
                )}
              />

              <AntForm.Item className="login-submit">
                <GradientButton
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  block
                  size="large"
                  icon={<LoginOutlined />}
                >
                  {isPending ? "Signing in..." : "Sign In"}
                </GradientButton>
              </AntForm.Item>

              {/* Backend Error */}
              {error && (
                <Alert
                  message="Login Failed"
                  description={
                    // Try to get error.response.data.message if available, else fallback
                    (error as any)?.response?.data?.message ||
                    (error instanceof Error ? error.message : "Invalid credentials. Please try again.")
                  }
                  type="error"
                  showIcon
                  className="login-error-alert"
                />
              )}
            </AntForm>
          </Space>
        </Card>
      </div>

      {/* ==================== OTP MODAL POPUP ==================== */}
      <Modal
        open={isOtpModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={420}
        centered
        closeIcon={null} // Optional: remove X if you don't want user to close
        destroyOnClose // Important: clears state when closed
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
