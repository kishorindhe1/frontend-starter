import { Button,  } from "antd";
import React from "react";

const GradientButton: React.FC<any>= (props) => {
  return (
    <Button
      {...props}
      style={{
        height: 56,
        fontSize: 17,
        fontWeight: 600,
        borderRadius: 16,
        background: props.disabled
          ? undefined
          : "linear-gradient(90deg, #1890ff, #0066cc)",
        border: "none",
        ...props.style,
      }}
    >
      {props.children}
    </Button>
  );
};

export default GradientButton;