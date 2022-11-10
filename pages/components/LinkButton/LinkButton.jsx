import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import e from "cors";
function LinkButton({
  title,
  color,
  variant,
  href,
  loadingMessage,
  onClick,
  id,
  disabled,
  marginTop
}) {
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();
  async function LetsNavigate(e) {
    router.push(href);
  }
  let Key=id ? id : "button" + title;
  return (
    <Button
    
      id={Key}
      key={Key}
      onClick={async () => {
        if (onClick) await onClick();
        if (href) LetsNavigate();
      }}
      colorScheme={color}
      variant={variant}
      width={"fit-content"}
      disabled={disabled}
      marginTop={marginTop}
    >
      {title}
    </Button>
  );
}

export default LinkButton;
