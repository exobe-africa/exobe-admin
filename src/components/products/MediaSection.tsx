"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface MediaSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function MediaSection({ images, onImagesChange }: MediaSectionProps) {
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      onImagesChange([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
      
      {/* Image URL Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="url"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
        />
        <button
          onClick={handleAddImage}
          className="px-4 py-2 bg-[#C8102E] text-white rounded-lg hover:bg-[#A00D24] transition-colors flex items-center gap-2"
        >
          <Upload size={16} />
          Add
        </button>
      </div>

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square border border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Product ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

