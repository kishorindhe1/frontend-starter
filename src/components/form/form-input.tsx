import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Form, Input } from "antd";

interface IFormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  errors?: Record<string, { message?: string }>;
  required?: boolean;

  placeholder?: string;
  size?: "small" | "middle" | "large";
  type?: "text" | "password";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode | ((visible: boolean) => React.ReactNode);
}

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  errors,
  required = false,
  placeholder,
  size = "large",
  type = "text",
  prefix,
  suffix,
}: IFormInputProps<T>) => {
  const InputComponent = type === "password" ? Input.Password : Input;

  const ControlledField = (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputComponent
          {...field}
          autoComplete="off"
          placeholder={placeholder}
          size={size}
          prefix={prefix}
          suffix={typeof suffix === "function" ? suffix(false) : suffix}
        />
      )}
    />
  );

  return (
    <Form.Item
      label={label}
      required={required}
      validateStatus={errors?.[name] ? "error" : ""}
      help={errors?.[name]?.message}
    >
      {ControlledField}
    </Form.Item>
  );
};

export default FormInput;
