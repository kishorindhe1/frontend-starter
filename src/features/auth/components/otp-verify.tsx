import React from "react";
import {
  Alert,
  Button,
  Card,
  Form as AntForm,
  Typography,
  Space,
  Divider,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOtpVerify } from "@/features/auth/hooks/use-verify-otp";
import { MailOutlined, LoginOutlined, ReloadOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation"; // or "react-router-dom" if using React Router
import GradientButton from "@/components/common/GradientButton.tsx";
import "@/assets/styles/OtpVerificationForm.css"; // External CSS

const { Text, Title } = Typography;

const otpSchema = z.object({
  otp: z.string().length(6, "Please enter all 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface TempLoginResponse {
  data: {
    data: {
      email: string;
      message: string;
      requiresOTP: boolean;
      expiresIn: string;
    };
    success: boolean;
    status: number;
    message: string;
  };
}

type Props = {
  email: string;
  onSuccess: () => void;
  onResend: () => void; // This will trigger login API again
};

const OtpVerificationForm: React.FC<Props> = ({ onSuccess, onResend }) => {
  // const router = useRouter();
  const queryClient = useQueryClient();
  const {
    mutateAsync: verifyOtp,
    isPending: verifying,
    error: verifyError,
  } = useOtpVerify();

  const { data: tempData } = useQuery<TempLoginResponse>({
    queryKey: ["login-temp-data"],
    // staleTime: Infinity,
  });

  const email = tempData?.data?.data?.email || "";
  const [secondsLeft, setSecondsLeft] = React.useState(60);

 React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // const {
  //   control,
  //   handleSubmit,
  //   setFocus,
  //   setValue,
  //   watch,
  //   formState: { errors, isValid },
  // } = useForm<OtpFormData>({
  //   resolver: zodResolver(otpSchema),
  //   mode: "onChange",
  //   defaultValues: { otp: "" },
  // });
  const {
  control,
  handleSubmit,
  setValue,
  trigger, // ← Add this
  watch,
  setFocus,
  formState: { errors, isValid },
} = useForm<OtpFormData>({
  resolver: zodResolver(otpSchema),
  mode: "onChange",
  defaultValues: { otp: "" },
});

  watch("otp");

  // Auto-focus first digit
  React.useEffect(() => {
    setTimeout(() => setFocus("otp"), 100);
  }, [setFocus]);

  // Handle paste (Ctrl+V) - auto fill all digits
const handlePaste = async (e: React.ClipboardEvent) => {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

  if (pasted) {
    setValue("otp", pasted, { shouldValidate: true }); // This triggers validation
    await trigger("otp"); // Force re-validation

    // Auto-focus last input
    setTimeout(() => {
      const lastInput = document.querySelector(
        `.otp-digit-input:nth-child(6)`
      ) as HTMLInputElement;
      lastInput?.focus();
    }, 0);
  }
};

  const onSubmit = async (data: OtpFormData) => {
    try {
      const response = await verifyOtp({ email, otp: data.otp.trim() });
      console.log("OTP verification response:", response);
      // Assuming your verifyOtp returns the full success response with tokens
      // if (response?.data?.accessToken) {
      //   localStorage.setItem("accessToken", response.data.accessToken);
      //   localStorage.setItem("refreshToken", response.data.refreshToken);
      //   localStorage.setItem("user", JSON.stringify(response.data));
      // }

      queryClient.removeQueries({ queryKey: ["login-temp-data"] });

      onSuccess?.();
    } catch (err) {
      // Error handled below via verifyError
    }
  };

  return (
    <div className="otp-page-container">
      <Card className="otp-card">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Header */}
          <div className="otp-header">
            <div className="otp-icon-circle">
              <MailOutlined />
            </div>
            <Title level={3} className="otp-title">
              Check Your Email
            </Title>
            <Text type="secondary">We sent a 6-digit code to</Text>
            <Text strong className="otp-email">
              {email || "your email"}
            </Text>
          </div>

          <Divider className="otp-divider" />

          <AntForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
           <Controller
  name="otp"
  control={control}
  render={({ field: { onChange, value = "" } }) => (
    <AntForm.Item
      label="Enter 6-digit code"
      validateStatus={errors.otp ? "error" : ""}
      help={errors.otp?.message}
      required
      className="otp-input-container"
    >
      <div className="otp-inputs-wrapper" onPaste={handlePaste}>
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const inputRef = React.useRef<HTMLInputElement>(null);

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const digit = e.target.value.replace(/\D/g, "");
            if (digit) {
              const newValue = (value + digit).slice(0, 6);
              onChange(newValue);
              if (index < 5) {
                const nextInput = document.querySelector(
                  `.otp-digit-input:nth-child(${index + 2})`
                ) as HTMLInputElement;
                nextInput?.focus();
              }
            }
          };

          const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (value[index]) {
                onChange(value.slice(0, index) + value.slice(index + 1));
              } else if (index > 0) {
                const prevInput = document.querySelector(
                  `.otp-digit-input:nth-child(${index})`
                ) as HTMLInputElement;
                prevInput?.focus();
                onChange(value.slice(0, index - 1) + value.slice(index));
              }
            }
          };

          return (
            <input
              key={index}
              ref={inputRef}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value[index] || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.target.select()}
              className={`otp-digit-input ${value[index] ? "filled" : ""}`}
              autoComplete="off"
            />
          );
        })}
      </div>
    </AntForm.Item>
  )}
/>

            {/* Resend */}
     <div className="otp-resend">
  {secondsLeft > 0 ? (
    <Text type="secondary">
      Resend in{" "}
      <Text strong style={{ color: "#1890ff" }}>
        00:{secondsLeft.toString().padStart(2, "0")}
      </Text>
    </Text>
  ) : (
    <Button
      type="link"
      icon={<ReloadOutlined />}
      onClick={async () => {
        await onResend();        // Call login API again
        setSecondsLeft(60);      // Reset timer
      }}
      className="resend-btn"
      loading={false} // optional: add loading state if you want
    >
      Resend OTP
    </Button>
  )}
</div>

            {/* Submit Button */}
            <AntForm.Item className="otp-submit">
              <GradientButton
                type="primary"
                htmlType="submit"
                loading={verifying}
                disabled={!isValid || verifying}
                block
                size="large"
                icon={<LoginOutlined />}
              >
                {verifying ? "Verifying..." : "Verify & Continue"}
              </GradientButton>
            </AntForm.Item>

            {/* Error Alert */}
            {verifyError && (
              <Alert
                type="error"
                showIcon
                message="Invalid or Expired Code"
                description={
                  verifyError instanceof Error
                    ? verifyError.message
                    : "Please check the code and try again."
                }
                className="otp-error-alert"
              />
            )}
          </AntForm>
        </Space>
      </Card>
    </div>
  );
};

export default OtpVerificationForm;
