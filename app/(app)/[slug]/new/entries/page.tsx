"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createWorker } from "tesseract.js";

export default function OCRPage(){
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const preprocessImage = (imageSrc: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.src = imageSrc;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    resolve(imageSrc);
                    return;
                }
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    const color = brightness > 128 ? 255 : 0;
                    data[i] = color;     
                    data[i + 1] = color; 
                    data[i + 2] = color; 
                }
                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL()); 
            };
            img.onerror = () => resolve(imageSrc);
        });
    };

    const handleLines = (lines: Tesseract.Line[]): { success: boolean; res: any[] } => {
        const regex = /total/i;
        const result: any[] = [];
        lines.forEach((l) => {
            if (!l.text) return; 
            const text = l.text.toLowerCase();
            const index = text.search(regex);
            if (index !== -1) {
                const total_text = text.slice(index); 
                const stringNumbers = total_text.match(/\d+/g) || [];
                const actualNumbers = stringNumbers.map(Number);
                const ans = { actualNumbers, total_text: text.slice(index, index + 5) };
                result.push(ans);
            } 
        });
        if (result.length === 0) {
            return { success: false, res: [] };
        } else {
            return { success: true, res: result };
        }
    };

    const handleProcessing = async () => {
        if (!selectedImage) return;
        try {
            setProcessing(true);
            const worker = await createWorker("eng");
            const result = await worker.recognize(selectedImage);
            let lines = result.data.blocks![0].paragraphs[0].lines || []; 
            let outcome = handleLines(lines);
            if (!outcome.success) {
                console.log("First pass failed. Trying preprocessed image...");
                const cleanedImage = await preprocessImage(selectedImage);
                const result2 = await worker.recognize(cleanedImage);
                lines = result2.data.blocks![0].paragraphs[0].lines || [];
                outcome = handleLines(lines);
            }
            if (outcome.success) {
                console.log("Found totals:", outcome.res);
            } else {
                console.log("Couldn't find total value, please upload a clearer image.");
            }
            await worker.terminate();
        } catch (error) {
            console.error("OCR Processing error:", error);
        } finally {
            setProcessing(false);
        }
    };

    const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    return(
        <div className="flex pb-2 flex-1 gap-2 flex-col shrink w-auto h-auto justify-between bg-white overflow-y-scroll">
            <nav role="navigation" className="w-full bg-gray-600">
                <div className="w-full max-w-3xl items-center justify-between mx-auto px-2 flex">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                width={0} height={0}
                                style={{ width: '50px', height: '50px' }}
                                className=" col-start-2 col-end-3"
                                preload
                                loading="eager"
                                src="/noun_bill_5997839_@700.png"
                                alt="Splity logo"
                            />
                        </Link>
                    </div>
                    <div className="relative inline-block text-left group">
                        <button 
                            type="button" 
                            className="duration-400 inline-flex items-center justify-between px-4 py-2 text-white rounded-md cursor-pointer transition-colors focus:outline-none"
                        >
                            Actions
                            <span className="ml-2 text-xs transition-transform duration-300 pointer-events-none group-focus-within:rotate-180">▼</span>
                        </button>
                        <ul className="absolute z-10 -right-12 mt-2 w-48 p-2
                                origin-top-right rounded-md bg-white border border-slate-200 
                                shadow-lg ring-1 ring-black/5 opacity-0 invisible 
                                scale-95 transition-all duration-200 pointer-events-none 
                                group-focus-within:opacity-100 [&_button]:rounded-sm
                                group-focus-within:invisible-none group-focus-within:scale-100 
                                group-focus-within:pointer-events-auto">
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Edit Event
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Invite to Event
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Manage Participant
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                insights
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Export as Excel file
                            </button>
                            </li>
                            <li>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer">
                                Show history
                            </button>
                            </li>
                        </ul>
                    </div>
                    <div style={{ width: '50px' }} />
                </div>
            </nav>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink ">
                <div className="content-center pl-2 w-full h-10 self-center">
                    <span className="text-black">{`<- Back`}</span>
                </div>
                <div className="flex flex-col col-span-12 gap-4 shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 rounded-sm">
                    <div className="flex flex-col text-black bg-gray-400 justify-center rounded-sm p-4 items-center">
                        {
                            selectedImage 
                            ? 
                            (
                                <img 
                                    src={selectedImage} 
                                    alt="Receipt Preview" 
                                    className="max-h-58 object-contain mb-2 rounded-sm" 
                                />
                            ) : null
                        }
                        <label htmlFor="file-upload" className="text-black cursor-pointer self-center block mt-2 mb-1">
                        {
                            processing 
                                ? "Processing"
                            : selectedImage  
                                ? "Change Receipt Image" 
                                : "Upload a Receipt image Here"
                        }
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg" 
                            id="file-upload" 
                            className="sr-only text-black"
                            onChange={handleImageChange}
                        />
                        </label>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" 
                            className="pl-2 pr-2 p-1 
                            w-fit rounded-sm
                            text-black 
                            bg-cyan-200"
                            onClick={handleProcessing}
                        >
                            Analyze
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}