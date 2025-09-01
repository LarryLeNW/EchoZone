"use client";
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useFileUpload from "@/hooks/use-upload";

interface ImageUploadProps {
    onUploadSuccess: (url: string[]) => void;
    updateStatus: (status: boolean) => void;
    children?: React.ReactNode;
    isUploading: boolean;
}

export default function ImageUpload({ onUploadSuccess, children = "Ảnh", updateStatus, isUploading }: ImageUploadProps) {
    const { uploadMultiple } = useFileUpload();
    const [uploadError, setUploadError] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    const openPicker = () => inputRef.current?.click();

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const files = e.target.files;
        if (!files) return;
        setUploadError(null);
        try {
            updateStatus(true)
            const urls = await uploadMultiple(files);
            if (urls) { onUploadSuccess(urls); }
        } catch (err) {
            console.error(err);
            setUploadError("Tải ảnh thất bại. Vui lòng thử lại.");
        } finally {
            updateStatus(false)
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Label
                className="cursor-pointer select-none"
                onClick={openPicker}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
                tabIndex={0}
            >
                {children}
            </Label>
            <Input
                ref={inputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png"
                className="sr-only"
                disabled={isUploading}
                onChange={handleChange}
            />
            {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
        </div>
    );
}
