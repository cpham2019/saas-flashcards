"use client";

import useUpload, { StatusText } from "@/hooks/useUpload";
import { CheckCircleIcon, CircleArrowDown, HammerIcon, RocketIcon, SaveIcon } from 'lucide-react'
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function UploadPage() {
    const {progress, status, fileId, handleUpload} = useUpload();
    const router = useRouter();

    useEffect(() => {
      if (fileId) {
        router.push(`/dashboard/flashcards/${fileId}`)
      }
    }, [fileId, router])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const file = acceptedFiles[0];
    if (file) {
        await handleUpload(file)
    } else {

    }
    console.log(acceptedFiles);
  }, []);
  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: (<RocketIcon className='h-20 w-20 text-slate-600' />),
    [StatusText.UPLOADED]: (<CheckCircleIcon className='h-20 w-20 text-slate-600' />),
    [StatusText.SAVING]: (<SaveIcon className='h-20 w-20 text-slate-600' />),
    [StatusText.GENERATING]: (<HammerIcon className='h-20 w-20 text-slate-600' />),
  }
  const { getRootProps, getInputProps, isDragActive
   } = useDropzone({
    onDrop, maxFiles: 1, accept: {"application/pdf": [".pdf"]}
  });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
  
  return (
    <div className="bg-gradient-to-tl from-white to-gray-300 flex-1 flex items-center justify-center">
      {uploadInProgress && (
        <div className='flex flex-col justify-center items-center gap-5'>
          <div className={`${progress === 100 && "hidden"}`}>
          <span className="loading loading-spinner loading-lg"></span>
          </div>
          {/* render status icons */}
          {
            // @ts-ignore
            statusIcons[status!]
          }
          <p className='text-black animate-pulse'>{status ? status.toString() : ''}</p>
        </div>
      )}

    {!uploadInProgress &&(
      <div className="bg-white p-5 drop-shadow-lg h-[50%] w-[50%] rounded-xl flex justify-center items-center">
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="flex justify-center items-center flex-col">
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p className="text-lg font-semibold text-center">
                Drop the files here ...
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col">
              <CircleArrowDown className="h-20 w-20 animate-bounce" />
              <p className="text-lg font-semibold text-center">
                Drag and drop some files here, or click to select files
              </p>
            </div>
          )}
        </div>
      </div>)}
    </div>
  );
}

export default UploadPage;
