import { X } from "lucide-react";

export default function ImageMosaic({
    images,
    onRemove,
}: {
    images: string[];
    onRemove?: (idx: number) => void;
}) {
    const count = images.length;

    if (count === 0) return null;

    const Tile = ({
        src,
        className = "",
        showOverlay = false,
        overlayText = "",
        onRemoveClick,
    }: {
        src: string;
        className?: string;
        showOverlay?: boolean;
        overlayText?: string;
        onRemoveClick?: () => void;
    }) => (
        <div className={`relative overflow-hidden rounded-md ${className}`}>
            <img
                src={src}
                alt="preview"
                className="h-full w-full object-cover select-none"
                draggable={false}
            />
            {onRemoveClick && (
                <button
                    type="button"
                    onClick={onRemoveClick}
                    className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/70"
                    aria-label="Xoá ảnh"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
            {showOverlay && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">{overlayText}</span>
                </div>
            )}
        </div>
    );

    if (count === 1) {
        return (
            <div className="mt-3">
                <Tile
                    src={images[0]}
                    className="max-h-[420px] aspect-[4/3]"
                    onRemoveClick={onRemove ? () => onRemove(0) : undefined}
                />
            </div>
        );
    }

    if (count === 2) {
        return (
            <div className="mt-3 grid grid-cols-2 gap-1.5">
                {images.map((src, i) => (
                    <Tile
                        key={i}
                        src={src}
                        className="aspect-[4/3] max-h-[360px]"
                        onRemoveClick={onRemove ? () => onRemove(i) : undefined}
                    />
                ))}
            </div>
        );
    }

    if (count === 3) {
        return (
            <div className="mt-3 grid grid-cols-3 grid-rows-2 gap-1.5 max-h-[420px]">
                <Tile
                    src={images[0]}
                    className="col-span-2 row-span-2"
                    onRemoveClick={onRemove ? () => onRemove(0) : undefined}
                />
                <Tile
                    src={images[1]}
                    className=""
                    onRemoveClick={onRemove ? () => onRemove(1) : undefined}
                />
                <Tile
                    src={images[2]}
                    className=""
                    onRemoveClick={onRemove ? () => onRemove(2) : undefined}
                />
            </div>
        );
    }

    if (count === 4) {
        return (
            <div className="mt-3 grid grid-cols-2 grid-rows-2 gap-1.5 max-h-[420px]">
                {images.slice(0, 4).map((src, i) => (
                    <Tile
                        key={i}
                        src={src}
                        onRemoveClick={onRemove ? () => onRemove(i) : undefined}
                    />
                ))}
            </div>
        );
    }

    const extra = count - 5;
    return (
        <div className="mt-3 grid grid-cols-3 grid-rows-2 gap-1.5 max-h-[420px]">
            {images.slice(0, 5).map((src, i) => {
                const isOverlay = i === 4 && extra > 0;
                return (
                    <Tile
                        key={i}
                        src={src}
                        showOverlay={isOverlay}
                        overlayText={`+${extra}`}
                        onRemoveClick={onRemove ? () => onRemove(i) : undefined}
                    />
                );
            })}
        </div>
    );
}
