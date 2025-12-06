/* eslint-disable @typescript-eslint/no-explicit-any */
import FormInput from "@/components/form/form-input";
import { useLogin } from "@/features/auth/hooks/use-login";
import type { LoginSchema } from "@/features/auth/schemas/auth-schema";
import { loginSchema } from "@/features/auth/schemas/auth-schema";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  LoginOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Form, message, Space, Typography } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import OtpVerificationForm from "./otp-verify";

const { Text } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: login, isPending } = useLogin();
  const [loginCredentials, setLoginCredentials] = useState<LoginSchema | null>(
    null
  );
  const [requiresOtp, setRequiresOtp] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await login(data);
      if (response?.data?.data?.requiresOTP) {
        setLoginCredentials(data);
        setRequiresOtp(true);
      } else {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Invalid credentials. Please try again.";

      message.error(errorMessage);
      reset({ email: data.email, password: "" });
    }
  };

  const handleResendOtp = async () => {
    if (!loginCredentials) return;
    try {
      await login(loginCredentials);
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  const handleOtpSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <div
        className="login-page-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Card
          className="login-card"
          style={{ maxWidth: 400, width: "100%", alignItems: "center" }}
        >
          {requiresOtp ? (
            <OtpVerificationForm
              onSuccess={handleOtpSuccess}
              onResend={handleResendOtp}
            />
          ) : (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Title level={3} className="!mb-0">
                Sign In
              </Title>

              <Text type="secondary">
                Enter your email and password to continue.
              </Text>

              <Form
                layout="vertical"
                onFinish={handleSubmit(onSubmit)}
                size="small"
              >
                <FormInput
                  control={control}
                  name="email"
                  label="Email"
                  required
                  placeholder="Enter your email"
                  errors={errors}
                  prefix={<MailOutlined />}
                />

                <FormInput
                  control={control}
                  name="password"
                  label="Password"
                  required
                  type="password"
                  placeholder="••••••••"
                  errors={errors}
                  prefix={<LockOutlined />}
                  suffix={(visible: boolean) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isPending}
                    block
                    size="large"
                    className="my-1"
                    icon={<LoginOutlined />}
                  >
                    {isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </Form.Item>
              </Form>
            </Space>
          )}
        </Card>
      </div>
    </>
  );
};

export default LoginForm;
