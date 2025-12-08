import FormInput from "@/components/form/form-input";
import { useLogin } from "@/features/auth/hooks/use-login";
import {
  loginSchema,
  type TLoginSchema,
} from "@/features/auth/schemas/auth-schema";
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
  const [loginCredentials, setLoginCredentials] = useState<TLoginSchema | null>(
    null
  );
  const [requiresOtp, setRequiresOtp] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  /**
   * Handles the login form submission.
   *
   * @param data - The login credentials containing email and password
   *
   * @remarks
   * This function performs the following actions:
   * - Attempts to authenticate the user with provided credentials
   * - If OTP is required, stores login credentials and displays OTP screen
   * - On success with OTP requirement, shows success message
   * - On error, displays appropriate error message
   * - Resets password field on 401/403 errors (authentication failures)
   * - Preserves both email and password on other errors
   *
   * @throws Will catch and handle any errors during the login process
   */
  const onSubmit = async (data: TLoginSchema) => {
    try {
      const responses = await login(data);
      if (responses?.data?.requiresOTP) {
        setLoginCredentials(data);
        setRequiresOtp(true);
        message.success(
          responses.message || "OTP sent to your registered email."
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Invalid credentials. Please try again.";

      message.error(errorMessage);
      if (
        (error as { response?: { status?: number } }).response?.status ===
          401 ||
        (error as { response?: { status?: number } }).response?.status === 403
      ) {
        reset({ email: data.email, password: "" });
      } else {
        reset({ email: data.email, password: data.password });
      }
    }
  };

  /**
   * Handles the resend OTP action by re-attempting the login process with stored credentials.
   * 
   * @remarks
   * This function will only execute if loginCredentials are available.
   * On failure, it displays an error message extracted from the error response or falls back to a generic message.
   * 
   * @returns A promise that resolves when the OTP resend attempt completes
   * 
   * @throws Will catch and handle errors internally by displaying them via antd message component
   */
  const handleResendOtp = async () => {
    if (!loginCredentials) return;
    try {
      await login(loginCredentials);
    } catch (error) {
      message.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
          (error as Error)?.message ||
          "Failed to resend OTP. Please try again."
      );
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
