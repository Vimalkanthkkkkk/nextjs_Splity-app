"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import ParticipantDropdown from "@/app/_components/ParticipantDropdown";
import SplitBox from "@/app//_components/SplitBox";
import Navigation from "@/app/_components/Navigation";
import BackButton from "@/app/_components/Backbutton";
import Actions from "./Actions";

type Props = {
    participants: string[];
    Eventname :  string;
    slug : string;
};


export default function OCRClient( {participants , Eventname , slug} : Props ) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);
    const [totalInput, setTotalInput] = useState<string>("");
    const [hasResult, setHasResult] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [selected, setSelected] = useState<string>(participants[0]);

    const preprocessImage = (imageSrc: string): Promise<string> => {
        return new Promise((resolve) => {
            const img = new window.Image();
            img.src = imageSrc;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    resolve(imageSrc);
                    return;
                }
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
                ctx.drawImage(
                    img,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const imgData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const brightness =
                        0.34 * data[i] +
                        0.5 * data[i + 1] +
                        0.16 * data[i + 2];
                    const color =
                        brightness > 128
                            ? 255
                            : 0;
                    data[i] = color;
                    data[i + 1] = color;
                    data[i + 2] = color;
                }
                ctx.putImageData(imgData, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            };
            img.onerror = () => {
                resolve(imageSrc);
            };
        });
    };

    const normalizeText = (text: string) => {
        return text.replace(/\s+/g, " ").trim();
    };

    const extractTotal = (lines: Tesseract.Line[]): number | null => {
        const SKIP = /sub\s*total|qty|quantity|items?\b|tax|gst|discount/i;
        const PRIORITY = ["grand total", "net amount", "amount due", "total amount", "total"];
        let best: { score: number; index: number; value: number } | null = null;
        for (const [index, line] of lines.entries()) {
            const text = normalizeText(line.text).toLowerCase();
            const score = PRIORITY.findIndex((k) => text.includes(k));
            if (score === -1 || SKIP.test(text)) continue;
            const keyword = PRIORITY[score];
            const afterKeyword = text.slice(text.indexOf(keyword) + keyword.length);
            const nums = (afterKeyword.replace(/[₹]|rs\.?|inr/gi, "").match(/\d[\d,]*(?:\.\d{1,2})?/g) || [])
                .map((n) => parseFloat(n.replace(/,/g, "")))
                .filter((n) => !isNaN(n));
            if (nums.length === 0) continue;
            const value = nums[nums.length - 1];
            if (!best || score < best.score || (score === best.score && index > best.index)) {
                best = { score, index, value };
            }
        }
        return best ? best.value : null;
    };

    const getLinesFromResult = (result: Tesseract.RecognizeResult): Tesseract.Line[] => {
        if (!result.data.blocks) {
            return [];
        }
        return result.data.blocks.flatMap(
            (block) =>
                block.paragraphs?.flatMap(
                    (paragraph) =>
                        paragraph.lines || []
                ) || []
        );
    };

    const runOCR = async ( image: string, worker: Tesseract.Worker) => {
        return await worker.recognize(
            image,
            {},
            {
                blocks: true,
                layoutBlocks: true,
                text: true,
                box: true,
            }
        );
    };

    const handleProcessing = async () => {
        if (!selectedImage) return;
        setProcessing(true);
        setTotalInput("");
        setHasResult(false);
        setNotFound(false);
        let worker: Tesseract.Worker | null = null;
        try {
            worker = await createWorker("eng");
            let found = extractTotal(getLinesFromResult(await runOCR(selectedImage, worker)));
            if (found === null) {
                const cleaned = await preprocessImage(selectedImage);
                found = extractTotal(getLinesFromResult(await runOCR(cleaned, worker)));
            }
            setTotalInput(found !== null ? found.toFixed(2) : "");
            setNotFound(found === null);
            setHasResult(true);
        } catch (error) {
            console.error("OCR ERROR:", error);
        } finally {
            setProcessing(false);
            if (worker) await worker.terminate();
        }
    };

    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d{0,2}$/.test(value)) {
            setTotalInput(value);
            if (value !== "") setNotFound(false);
        }
    };

    const finalTotal = totalInput === "" ? null : parseFloat(totalInput);

    const handleImageChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
        }
        const imageURL = URL.createObjectURL(file);
        setSelectedImage(imageURL);
        setTotalInput("");
        setHasResult(false);
        setNotFound(false);
    };

    const numberInputOnWheelPreventChange = (e : React.WheelEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        input.blur()
        e.stopPropagation()
        setTimeout(() => {
            input.focus()
        }, 0)
    }

    return (
        <>
            <Navigation route={`/`}>
                <Actions eventName={Eventname} slug={slug} />
            </Navigation>
            <div className="w-full max-w-3xl mx-auto px-2 flex flex-1 flex-col gap-10 shrink">
                <BackButton route={`/${slug}`} />
                <div className="flex flex-col col-span-12 gap-4 shadow-[1px_0.5px_4px_1px_rgba(0,0,0,0.15)] p-4 rounded-sm">
                    <div className="flex flex-col text-black bg-gray-400 justify-center rounded-sm p-4 items-center">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Receipt Preview"
                                className="max-h-58 object-contain mb-2 rounded-sm"
                            />
                        ) : null}
                        <label
                            htmlFor="file-upload"
                            className="text-black cursor-pointer block self-center mt-2 mb-1"
                        >
                            {processing
                                ? "Processing"
                                : selectedImage
                                    ? "Change Receipt Image"
                                    : "Upload a Receipt image Here"}
                        </label>
                        <input type="file" accept="image/png, image/jpeg"
                            id="file-upload" className="sr-only text-black"
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="
                                pl-2
                                pr-2
                                p-1
                                w-fit
                                rounded-sm
                                text-black
                                bg-cyan-200
                                disabled:opacity-50
                            "
                            onClick={
                                handleProcessing
                            }
                            disabled={
                                processing ||
                                !selectedImage
                            }
                        >
                            {processing
                                ? "Processing..."
                                : "Analyze"}
                        </button>

                    </div>
                    {
                    hasResult && (
                        <div className="flex flex-col gap-1">
                            <label htmlFor="total-input" className="text-black font-medium">
                                Total
                            </label>
                            <div className="flex items-center gap-2 bg-gray-100 rounded-sm p-3">
                                <span className="text-black font-semibold">₹</span>
                                <input id="total-input"
                                    type="number" 
                                    onWheel={numberInputOnWheelPreventChange}
                                    value={totalInput} onChange={handleTotalChange}
                                    placeholder="0.00"
                                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none flex-1 bg-white text-black font-semibold rounded-sm px-2 py-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                />
                            </div>
                            {notFound ? (
                                <p className="text-sm text-red-600">
                                    Couldn't detect the total. Please enter it manually.
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500">
                                    Detected automatically. Edit if it's not correct.
                                </p>
                            )}
                            <ParticipantDropdown selected={selected} participants={participants} onSelect={setSelected} />
                            <SplitBox money={totalInput} participants={participants} />
                            <div className="flex gap-4">
                                <button type="submit" className="pl-2 pr-2 p-1 w-fit rounded-sm text-black bg-cyan-200">Add</button>
                                <button type="submit" className="pl-2 pr-2 p-1 w-fit rounded-sm text-black bg-gray-200">Cancel</button>
                            </div>
                        </div>
                    )}                
                </div>
            </div>
        </>
    );
}