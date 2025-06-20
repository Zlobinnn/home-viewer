"use client";
import { StarRating } from "@/components/starRating";

export default function Test() {
    return <div className="flex items-center justify-center h-screen">
        <StarRating
            value={2.5}
            onChange={(value) => console.log(value)}
            editable={true}
        />
    </div>;
}