import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function FileUploader(props) {

    const onDrop = useCallback(acceptedFiles => {
        props.setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // accept: ['.pdf', '.doc', '.docx', '.txt']
    })


    return (
        <div className='w-full h-fit'>
            <div {...getRootProps()} className="border border-gray-300 rounded-md sm:p-10 w-full h-full flex flex-col justify-center items-center">
                <input {...getInputProps()} />
                <svg xmlns="http://www.w3.org/2000/svg" width="15%" height="15%" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="m-5 justify-self-start">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag and drop files here, or click to select files</p>
                }
                <p className='text-xs text-gray-400'>Supported file types: .pdf, .docx, .doc, .txt</p>
            </div>
            
        </div>
    )
}

export default FileUploader;