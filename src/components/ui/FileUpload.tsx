"use client";
import { uploadToS3 } from "@/src/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// https://github.com/aws/aws-sdk-js-v3/issues/4126

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      // --- LOG 1 ---
      console.log("onDrop triggered. Accepted files:", acceptedFiles);
      
      const file = acceptedFiles[0];
      if (!file) {
        console.log("No file accepted.");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);

        // --- LOG 2 ---
        console.log("Starting S3 upload for:", file.name);
        const data = await uploadToS3(file);
        
        // --- LOG 3 (Your "meow" log) ---
        console.log("S3 upload response:", data);

        if (!data?.file_key || !data.file_name) {
          // --- LOG 4 ---
          console.error("S3 upload failed or returned invalid data:", data);
          toast.error("Something went wrong with the upload.");
          return;
        }

        // --- LOG 5 ---
        console.log("S3 upload successful. Mutating (calling /api/create-chat)...");
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            // --- LOG 6 ---
            console.log("Mutation successful. Chat ID:", chat_id);
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            // --- LOG 7 (Your existing error) ---
            toast.error("Error creating chat");
            console.error("Mutation failed:", err);
          },
        });
      } catch (error) {
        // --- LOG 8 ---
        console.error("Error during S3 upload or mutation process:", error);
        toast.error("An unexpected error occurred.");
      } finally {
        // --- LOG 9 ---
        console.log("Upload process finished, setting uploading to false.");
        setUploading(false);
      }
    },
    // --- HANDLER ADDED ---
    onDropRejected: (rejectedFiles) => {
      console.log("onDropRejected triggered. Rejected files:", rejectedFiles);
      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        if (firstError.code === "file-invalid-type") {
          toast.error("Invalid file type. Please upload a PDF.");
        } else if (firstError.code === "file-too-large") {
          toast.error("File is too large.");
        } else {
          toast.error(`File rejected: ${firstError.message}`);
        }
      }
    },
  });

  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            {/* loading state */}
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Spilling Tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;