import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
function LinkButton({ title, color, variant, href, loadingMessage, onClick }) {
  const [navigate, setNavigate] = useState(false);
  const router = useRouter();

  function LetsNavigate() {
    router.push(href);
  }
  return (
    <Button
      onClick={async () => {
        onClick && (await onClick());
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
