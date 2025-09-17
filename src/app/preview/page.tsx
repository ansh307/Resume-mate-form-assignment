"use client";

import { useRouter } from "next/navigation";
import { generatePDF } from "@/lib/generatePDF";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

export default function PreviewPage() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("formData");
    if (stored) {
      const data = JSON.parse(stored);
      setData(data);
      const pdf = generatePDF(data);
      const url = pdf.output("bloburl");
      if (iframeRef.current) {
        iframeRef.current.src = url.toString();
      }
    }
  }, []);

  // Dynamic filename: Name_YYYY-MM-DD.pdf
  const getFileName = () => {
    const dateStr = new Date().toISOString().split("T")[0];
    const safeName = data.name.replace(/\s+/g, "_") || "User";
    return `${safeName}_${dateStr}.pdf`;
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 ">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2  px-3 py-2 cursor-pointer transform hover:translate-x-[-3px] hover:scale-115 transition-all duration-300 ease-in-out "
        >
          <img
            src="/icons/chevron-left.svg" // adjust path if needed
            alt="Back"
            width={30}
            height={30}
          />
        </button>
        <h1 className="text-2xl font-bold">PDF Preview</h1>
      </div>

      <iframe ref={iframeRef} className="w-full h-[500px] border mb-4" />

      <div className="flex gap-4">
        <Button
          onClick={() => {
            const pdf = generatePDF(data);
            pdf.save(getFileName());
          }}
          variant="blue"
        >
          <img
            src="/icons/Download.svg"
            alt="download"
            className="w-6 h-6 opacity-70"
          />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
