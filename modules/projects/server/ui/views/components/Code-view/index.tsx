import Prism from "prismjs";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/themes/prism-tomorrow.css";
import "./code-theme.css";

interface CodeViewProps {
  code: string;
  language: string;
}
export const CodeView = ({ code, language }: CodeViewProps) => {
  useEffect(() => {
    // Ensure Prism highlights the code when component mounts or updates
    Prism.highlightAll();
  }, [code, language]);
  return (
    <pre className="h-full overflow-auto bg-gray-900 p-4 text-sm">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </pre>
  );
};
