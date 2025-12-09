// src/features/auth/components/ForgotPasswordForm.tsx
import FormInput from '@/components/form/form-input';
import { useForgotPassword } from '../hooks/use-forgot-password';
import {
  forgotPasswordSchema,
  type TForgotPasswordSchema,
} from '@/features/auth/schemas/auth-schema';
import { MailOutlined, SendOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Flex, Form, message, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const { Text, Link } = Typography;

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: sendResetLink, isPending } = useForgotPassword();
  const [emailSent, setEmailSent] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: TForgotPasswordSchema) => {
    try {
      await sendResetLink(data);
      setEmailSent(true);
      message.success('Password reset link has been sent to your email!');
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        'Something went wrong. Please try again.';
      message.error(errorMessage);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  return (
    <Flex justify="center" align="center" className="min-h-screen ">
      <Card className="max-w-[420px] w-full shadow-lg">
        <Space orientation="vertical" size="large" className="w-full">
          <Flex orientation="vertical" className="text-center">
            <Title level={3} className="!mb-2">
              {emailSent ? 'Check Your Email' : 'Forgot Password'}
            </Title>
            <Text type="secondary">
              {emailSent
                ? 'We’ve sent a password reset link to your email address.'
                : 'Enter your email address and we’ll send you a link to reset your password.'}
            </Text>
          </Flex>

          {/* Success State */}
          {emailSent ? (
            <Flex vertical align="center" gap="middle">
              <Flex className="text-green-500 text-6xl">
                <MailOutlined />
              </Flex>
              <Text strong className="text-lg">
                Email Sent Successfully!
              </Text>
              <Text type="secondary" className="text-center max-w-xs">
                Please check your inbox (and spam folder) for the password reset
                link.
              </Text>

              <Button
                type="primary"
                size="large"
                onClick={handleBackToLogin}
                icon={<SendOutlined />}
              >
                Back to Sign In
              </Button>
            </Flex>
          ) : (
            /* Form */
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
              <FormInput
                control={control}
                name="email"
                label="Email Address"
                required
                placeholder="Enter your registered email"
                errors={errors}
                prefix={<MailOutlined />}
              />

              <Form.Item style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isPending}
                  block
                  size="large"
                  icon={<SendOutlined />}
                >
                  {isPending ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </Form.Item>

              <div className="text-center">
                <Text>
                  Remember your password?{' '}
                  <Link onClick={handleBackToLogin} strong>
                    Back to Sign In
                  </Link>
                </Text>
              </div>
            </Form>
          )}
        </Space>
      </Card>
    </Flex>
  );
};

export default ForgotPasswordForm;
