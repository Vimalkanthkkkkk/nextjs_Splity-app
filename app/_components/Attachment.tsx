"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type AttachmentProps = {
  src: string | null;
};

export default function Attachment({ src: initialSrc }: AttachmentProps) {
  const [src, setSrc] = useState<string | null>(initialSrc);
  const [removeImage, setRemoveImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setSrc(previewUrl);
    setRemoveImage(false);
  };

  const handleRemove = () => {
    setSrc(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        type="hidden"
        name="removeAttachment"
        value={removeImage ? "true" : "false"}
      />

      <label
        htmlFor="attach"
        className="bg-gray-200 min-w-40 w-fit content-center rounded-4xl h-30 relative overflow-hidden cursor-pointer"
      >
        {src ? (
          <Image
            src={src}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
              objectFit: "cover",
            }}
            alt="Attachment preview"
          />
        ) : (
          <>
            <Image
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "20px",
                borderRadius: 20,
                objectFit: "contain",
              }}
              src="/file.png"
              alt="Choose file"
            />

            <input
              ref={fileInputRef}
              hidden
              type="file"
              name="attach"
              id="attach"
              accept="image/jpeg,image/png"
              onChange={handleChange}
            />
          </>
        )}
      </label>

      <div className="flex flex-1 text-black items-center justify-between">
        <span>JPEG / PNG · Up to 10 MB.</span>
      </div>

      <div className="text-black flex flex-row">
        <label
          htmlFor="attach"
          className="mr-2 p-1 rounded-sm bg-gray-200 cursor-pointer"
        >
          {src ? "Change Image" : "Choose Image"}
        </label>

        {src && (
          <button
            type="button"
            onClick={handleRemove}
            className="bg-gray-200 rounded-sm p-1"
          >
            Remove Image
          </button>
        )}
      </div>
      {src && (
        <input
          ref={fileInputRef}
          hidden
          type="file"
          name="attach"
          id="attach"
          accept="image/jpeg,image/png"
          onChange={handleChange}
        />
      )}
    </>
  );
}