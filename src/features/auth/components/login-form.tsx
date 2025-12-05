/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Card, Form, Input, Typography, Space, Button, message } from "antd";
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
import OtpVerificationForm from "./otp-verify";
import Title from "antd/es/typography/Title";

const { Text } = Typography;

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { data, mutateAsync: login, isPending } = useLogin();
  const [loginCredentials, setLoginCredentials] = useState<LoginSchema | null>(
    null
  );

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
      const response: any = await login(data);
      if (response?.data.success || response?.data.status === 200) {
        if (
          response?.data.data.requiresOtp ||
          response?.data.data?.requiresOTP
        ) {
          setLoginCredentials(data);
        }
      }
    } catch (error: unknown) {
      reset();
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Invalid credentials. Please try again.";

      message.error(errorMessage);
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
          {data?.data?.data?.requiresOTP ? (
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
                        prefix={
                          <MailOutlined className="site-form-item-icon" />
                        }
                        placeholder="Enter your email"
                        size="large"
                        autoComplete="off"
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
                        autoComplete="off"
                        {...field}
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
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
                    className="my-1"
                    icon={<LoginOutlined />}
                  >
                    {isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </Form.Item>

                {/* Backend Error */}
              </Form>
            </Space>
          )}
        </Card>
      </div>
    </>
  );
};

export default LoginForm;
