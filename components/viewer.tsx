"use client";

import { useState } from "react";
import Viewr from "smtximob-viewr";

export const PropertyViewer = ({ viewer = [] }: { viewer: any[] }) => {
  const [visible, setVisible] = useState(false);

  const array = Array.isArray(viewer) ? viewer : [viewer];
  return (
    <div
      className={`fixed left-2 bottom-2 w-[90px] bg-white rounded-lg shadow-md z-[999999] cursor-pointer transition ease-in-out duration-100 ${
        visible
          ? "left-0 bottom-0 w-screen h-screen rounded-none flex justify-center"
          : "bg-black/70"
      }`}
      onClick={() => setVisible(!visible)}
    >
      <Viewr
        urlList={(array || [])
          .sort((a, b) => a.ordem - b.ordem)
          .map((video) => video.url)}
      />
    </div>
  );
};
