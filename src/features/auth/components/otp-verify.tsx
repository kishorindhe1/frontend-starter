import { useOtpVerify } from "@/features/auth/hooks/use-verify-otp";
import { LoginOutlined, MailOutlined, ReloadOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Space, Typography } from "antd";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const { Title, Text } = Typography;

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface TempLoginResponse {
  data: {
    data: {
      email: string;
      sessionToken: string;
      remainingOTPAttempts: number;
    };
  };
}

type Props = {
  onSuccess: () => void;
  onResend: () => Promise<void>;
};

const OtpVerificationForm: React.FC<Props> = ({ onSuccess, onResend }) => {
  const queryClient = useQueryClient();
  const { mutateAsync: verifyOtp, isPending: verifying } = useOtpVerify();

  const { data: tempData } = useQuery<TempLoginResponse>({
    queryKey: ["login-temp-data"],
  });

  const email = tempData?.data?.data?.email || "your email";
  const sessionToken = tempData?.data?.data?.sessionToken || "";

  const [secondsLeft, setSecondsLeft] = React.useState(60);

  const {
    control,
    handleSubmit,
    setValue,
    setFocus,
    trigger,
    reset,
    formState: { errors, isValid },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    setTimeout(() => setFocus("otp"), 100);
  }, [setFocus]);

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (paste) {
      setValue("otp", paste, { shouldValidate: true });
      await trigger("otp");
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      await verifyOtp({ sessionToken, otp: data.otp.trim() });
      queryClient.removeQueries({ queryKey: ["login-temp-data"] });
      onSuccess();
    } catch (err: unknown) {
      reset();
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "The code is invalid or expired. Please try again.";

      message.error(errorMessage);
    }
  };

  const inputs = Array.from({ length: 6 });

  return (
    <div className="max-w-md w-full mx-auto p-6">
      <Space direction="vertical" size="large" className="w-full">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-gray-300 rounded-full mb-4">
            <MailOutlined className="text-2xl text-blue-600" />
          </div>
          <Title level={3} className="mb-2 ">
            Verify Your Email
          </Title>
          <Text type="secondary" className="block">
            We've sent a 6-digit code to
          </Text>
          <Text strong className="block text-lg mt-1 text-blue-600">
            {email}
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Controller
            name="otp"
            control={control}
            render={({ field: { onChange, value = "" } }) => (
              <Form.Item
                label="Enter verification code"
                validateStatus={errors.otp ? "error" : ""}
                help={errors.otp?.message}
                required
                className="mb-6"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <div
                  className="flex gap-3 justify-center"
                  onPaste={handlePaste}
                >
                  {inputs.map((_, index) => (
                    <Input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value[index] || ""}
                      onChange={(e) => {
                        const digit = e.target.value.replace(/\D/g, "");
                        if (!digit) return;

                        const newValue = (value + digit).slice(0, 6);
                        onChange(newValue);

                        if (index < 5) {
                          const next = document.querySelector(
                            `input[data-index="${index + 1}"]`
                          ) as HTMLInputElement;
                          next?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          if (value[index]) {
                            onChange(
                              value.slice(0, index) + value.slice(index + 1)
                            );
                          } else if (index > 0) {
                            const prev = document.querySelector(
                              `input[data-index="${index - 1}"]`
                            ) as HTMLInputElement;
                            prev?.focus();
                          }
                        }
                      }}
                      onFocus={(e) => e.target.select()}
                      data-index={index}
                      autoComplete="off"
                    />
                  ))}
                </div>
              </Form.Item>
            )}
          />

          {/* Resend Timer */}
          <div className="text-center mb-6">
            {secondsLeft > 0 ? (
              <Text type="secondary">
                Resend code in{" "}
                <Text strong className="text-blue-600">
                  00:{secondsLeft.toString().padStart(2, "0")}
                </Text>
              </Text>
            ) : (
              <Button
                type="link"
                icon={<ReloadOutlined />}
                onClick={async () => {
                  await onResend();
                  setSecondsLeft(60);
                }}
                className="p-0 h-auto font-medium"
              >
                Resend OTP
              </Button>
            )}
          </div>

          {/* Submit */}
          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={verifying}
              disabled={!isValid || verifying}
              block
              size="large"
              icon={<LoginOutlined />}
              className="h-12 text-base font-semibold"
            >
              {verifying ? "Verifying..." : "Verify & Continue"}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default OtpVerificationForm;
