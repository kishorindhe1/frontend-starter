// src/features/auth/components/login-form.tsx
import React from 'react';
import { Button, Form as AntForm, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/features/auth/schemas/auth-schema';
import type { LoginSchema } from '@/features/auth/schemas/auth-schema';
import { useLogin } from '@/features/auth/hooks/use-login';
import { LockOutlined, MailOutlined } from '@ant-design/icons';

type Props = {
  onSuccess?: () => void;
};

const LoginForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutateAsync, isPending, error } = useLogin();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await mutateAsync(data);
      onSuccess?.();
    } catch {
      // mutation handles errors; you can customize toast here
    }
  };

  return (
    <AntForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AntForm.Item label="Email" validateStatus={errors.email ? 'error' : undefined} help={errors.email?.message}>
            <Input {...field} prefix={<MailOutlined />} placeholder="you@domain.com" />
          </AntForm.Item>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <AntForm.Item label="Password" validateStatus={errors.password ? 'error' : undefined} help={errors.password?.message}>
            <Input.Password {...field} prefix={<LockOutlined />} placeholder="Your password" />
          </AntForm.Item>
        )}
      />

      <AntForm.Item>
        <Button type="primary" htmlType="submit" loading={isPending} block>
          Sign in
        </Button>
      </AntForm.Item>

      {/* optional: show API error */}
      {error && <div style={{ color: 'var(--ant-error-color)', marginTop: 8 }}>{error instanceof Error ? error.message : 'Login failed'}</div>}
    </AntForm>
  );
};

export default LoginForm;
