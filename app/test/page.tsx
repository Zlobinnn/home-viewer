"use client";
import { StarRating } from "@/components/starRating";
import { useState } from "react";

export default function Test() {
    const [value, setValue] = useState(0);

    return <div className="flex items-center justify-center h-screen">
        <StarRating
            value={value}
            onChange={setValue}
            editable={true}
        />
    </div>;
}