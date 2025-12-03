import React from "react";
import { Button, Form as AntForm, Input } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/features/auth/schemas/auth-schema";
import type { RegisterSchema } from "@/features/auth/schemas/auth-schema";
import { useRegister } from "@/features/auth/hooks/use-register";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";

type Props = {
  onSuccess?: () => void;
};

const RegisterForm: React.FC<Props> = ({ onSuccess }) => {
  const { mutateAsync, isLoading, error } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await mutateAsync(data);
      onSuccess?.();
    } catch (e) {
      // handle error / toast
    }
  };

  return (
    <AntForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label="Name"
            validateStatus={errors.name ? "error" : undefined}
            help={errors.name?.message}
          >
            <Input
              {...field}
              prefix={<UserOutlined />}
              placeholder="Full name"
            />
          </AntForm.Item>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label="Email"
            validateStatus={errors.email ? "error" : undefined}
            help={errors.email?.message}
          >
            <Input
              {...field}
              prefix={<MailOutlined />}
              placeholder="you@domain.com"
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
            validateStatus={errors.password ? "error" : undefined}
            help={errors.password?.message}
          >
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </AntForm.Item>
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <AntForm.Item
            label="Confirm Password"
            validateStatus={errors.confirmPassword ? "error" : undefined}
            help={errors.confirmPassword?.message}
          >
            <Input.Password
              {...field}
              prefix={<LockOutlined />}
              placeholder="Confirm password"
            />
          </AntForm.Item>
        )}
      />

      <AntForm.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Create account
        </Button>
      </AntForm.Item>

      {error && (
        <div style={{ color: "var(--ant-error-color)", marginTop: 8 }}>
          {(error as any)?.message || "Registration failed"}
        </div>
      )}
    </AntForm>
  );
};

export default RegisterForm;
