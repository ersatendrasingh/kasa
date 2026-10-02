"use client";

import { useEffect, useState } from "react";

const formatCurrentDate = () =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

export function CurrentDateLabel() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatCurrentDate());
  }, []);

  return <span aria-label="Current issue date">{currentDate || "Current date"}</span>;
}
