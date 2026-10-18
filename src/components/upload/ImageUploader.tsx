'use client';

import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { ImageIcon, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SUPPORTED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'heic', 'avif'];
const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/heic',
  'image/avif',
];

interface ImageUploaderProps {
  value?: string;
  onFileChange?: (file?: File) => void;
  disabled?: boolean;
  maxSizeMB?: number;
  aspectRatio?: '1:1';
  folder?: string;
  title?: string;
  description?: string;
}

export function ImageUploader({
  value,
  onFileChange,
  disabled = false,
  maxSizeMB = 5,
  aspectRatio = '1:1',
  folder: _folder,
  title = 'Upload Image',
  description = 'Add a clear image for this item.',
}: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = useMemo(() => maxSizeMB * 1024 * 1024, [maxSizeMB]);

  useEffect(() => {
    setPreviewUrl(value ?? null);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(value ?? null);
    setError('');
    onFileChange?.(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = (file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    if (
      !SUPPORTED_MIME_TYPES.includes(file.type.toLowerCase()) &&
      !SUPPORTED_EXTENSIONS.includes(extension)
    ) {
      setError(
        'Unsupported file type. Please use JPG, JPEG, PNG, GIF, WEBP, BMP, TIFF, HEIC, or AVIF.'
      );
      return false;
    }

    if (file.size > maxSizeBytes) {
      setError(`Image size must not exceed ${maxSizeMB} MB.`);
      return false;
    }

    setError('');
    return true;
  };

  const handleFile = async (file?: File | null) => {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
        initialQuality: 0.85,
      });

      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      const preview = URL.createObjectURL(compressedFile);
      setSelectedFile(compressedFile);
      setPreviewUrl(preview);
      onFileChange?.(compressedFile);
    } catch {
      setError('Failed to process image. Please try another file.');
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await handleFile(file);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    await handleFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
  };

  return (
    <Card className="border-border/60">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.heic,.avif,image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff,image/heic,image/avif"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {!previewUrl ? (
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            onDrop={disabled ? undefined : handleDrop}
            onDragOver={disabled ? undefined : handleDragOver}
            onDragLeave={disabled ? undefined : handleDragLeave}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-14 text-center transition-all duration-200 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 bg-muted/20'
            } ${disabled ? 'cursor-not-allowed opacity-70' : 'hover:border-primary hover:bg-muted/40'}`}
          >
            <div className="bg-primary/10 mb-6 rounded-full p-4">
              <ImageIcon className="text-primary h-10 w-10" />
            </div>

            <h4 className="text-xl font-semibold">Drag & Drop your image here</h4>
            <p className="text-muted-foreground mt-2 text-sm">
              or click anywhere to browse from your device
            </p>

            <Button
              type="button"
              className="mt-6"
              onClick={(event) => {
                event.stopPropagation();
                if (!disabled) {
                  fileInputRef.current?.click();
                }
              }}
              disabled={disabled}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose Image
            </Button>

            <div className="text-muted-foreground mt-8 space-y-1 text-sm">
              <p>
                Maximum file size: <span className="font-medium">{maxSizeMB} MB</span>
              </p>
              <p>Supported formats: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC</p>
              <p className="text-xs">Image will be automatically compressed before upload.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative mx-auto w-fit">
              <img
                src={previewUrl}
                alt="Selected preview"
                className={`rounded-xl border object-cover shadow-md ${aspectRatio === '1:1' ? 'aspect-square h-72 w-72' : 'h-72 w-full'}`}
              />

              <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-xs text-white">
                Preview
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
              >
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={resetSelection}
                disabled={disabled}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>

            {selectedFile && (
              <Card className="mx-auto w-full max-w-md">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground text-sm">File Name</span>
                    <span className="truncate font-medium">{selectedFile.name}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground text-sm">Size</span>
                    <span className="font-medium">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground text-sm">Type</span>
                    <span className="font-medium">{selectedFile.type}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-center text-sm font-medium text-red-600">{error}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}