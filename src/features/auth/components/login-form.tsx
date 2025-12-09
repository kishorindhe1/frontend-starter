import FormInput from '@/components/form/form-input';
import { useLogin } from '@/features/auth/hooks/use-login';
import {
  loginSchema,
  type TLoginSchema,
} from '@/features/auth/schemas/auth-schema';
import { LockOutlined, LoginOutlined, MailOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Flex, Form, message, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import OtpVerificationForm from './otp-verify';

const { Text, Link } = Typography;

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
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: TLoginSchema) => {
    try {
      const responses = await login(data);
      if (responses?.data?.requiresOTP) {
        setLoginCredentials(data);
        setRequiresOtp(true);
        message.success(
          responses.message || 'OTP sent to your registered email.'
        );
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        'Invalid credentials. Please try again.';
      message.error(errorMessage);

      if (
        (error as { response?: { status?: number } }).response?.status ===
          401 ||
        (error as { response?: { status?: number } }).response?.status === 403
      ) {
        reset({ email: data.email, password: '' });
      } else {
        reset({ email: data.email, password: data.password });
      }
    }
  };

  const handleResendOtp = async () => {
    if (!loginCredentials) return;
    try {
      await login(loginCredentials);
    } catch (error) {
      message.error(
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
          (error as Error)?.message ||
          'Failed to resend OTP. Please try again.'
      );
    }
  };

  const handleOtpSuccess = () => {
    navigate('/dashboard');
  };

  const handleResetPassword = () => {
    navigate('/forgot-password'); // Redirect to a reset password page
  };

  return (
    <Flex justify="center" align="center" className="min-h-screen ">
      <Card className="max-w-[400px] w-full flex flex-col items-center ">
        {requiresOtp ? (
          <OtpVerificationForm
            onSuccess={handleOtpSuccess}
            onResend={handleResendOtp}
          />
        ) : (
          <Space orientation="vertical" size="middle" className="w-full">
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
                  {isPending ? 'Signing in...' : 'Sign in'}
                </Button>
              </Form.Item>

              <Text className="block mt-2 text-left">
                <Link onClick={handleResetPassword} strong>
                  Forgot Password?
                </Link>
              </Text>
            </Form>

            <Text type="secondary" className="text-center mt-4">
              By signing in, you agree to our{' '}
              <Link href="/privacy-policy" target="_blank" strong>
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms-of-service" target="_blank" strong>
                Terms of Service
              </Link>
              .
            </Text>
          </Space>
        )}
      </Card>
    </Flex>
  );
};

export default LoginForm;
