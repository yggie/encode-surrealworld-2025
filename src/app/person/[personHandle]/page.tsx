"use client";

import { useParams } from "next/navigation";

export default function PersonPage() {
  const { personHandle } = useParams<{ personHandle: string }>();

  return (
    <div>
      <h1>Person {personHandle}</h1>
    </div>
  );
}
