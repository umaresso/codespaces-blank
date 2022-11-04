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
}) {
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();

  async function LetsNavigate(e) {
    router.push(href);
  }
  return (
    <Button
      id={id ? id : "button" + title}
      onClick={async () => {
        if (onClick) await onClick();
        if (href) LetsNavigate();
      }}
      colorScheme={color}
      variant={variant}
      width={"fit-content"}
    >
      {title}
    </Button>
  );
}

export default LinkButton;
