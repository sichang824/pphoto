import React from "react";

export default function PostcardStyle() {
  return (
    <div
      className="w-full h-full box-border origin-center relative"
      style={
        {
          "--dash-length": "30px",
          "--border-width": "5px",
          "--border-color1": "#ff0000",
          "--border-color2": "#0000ff",
          "--gap-color": "white",
          background: `
          linear-gradient(45deg, 
            var(--border-color1) 40%, 
            var(--gap-color) 40%, 
            var(--gap-color) 60%, 
            var(--border-color2) 60%
          ) top/var(--dash-length) var(--border-width),
          linear-gradient(45deg, 
            var(--border-color1) 40%, 
            var(--gap-color) 40%, 
            var(--gap-color) 60%, 
            var(--border-color2) 60%
          ) bottom/var(--dash-length) var(--border-width),
          linear-gradient(-45deg, 
            var(--border-color1) 40%, 
            var(--gap-color) 40%, 
            var(--gap-color) 60%, 
            var(--border-color2) 60%
          ) left/var(--border-width) var(--dash-length),
          linear-gradient(-45deg, 
            var(--border-color1) 40%, 
            var(--gap-color) 40%, 
            var(--gap-color) 60%, 
            var(--border-color2) 60%
          ) right/var(--border-width) var(--dash-length)
        `,
          backgroundRepeat: "repeat-x, repeat-x, repeat-y, repeat-y",
          padding: "var(--border-width)",
        } as React.CSSProperties
      }
    >
      <div className="absolute left-[10%] top-[10%] w-[25mm] aspect-[6/5] border border-dashed border-black/70">
        <div className="-rotate-90 w-full h-full flex justify-center items-center after:content-['邮票'] after:text-black/70 after:text-xs" />
      </div>

      <div className="absolute right-8 top-8 h-[24%] flex flex-row">
        <span className="absolute bottom-0 -left-3 -rotate-90 origin-left text-xs text-black/70">
          寄：
        </span>
        {[...Array(3)].map((_, index) => (
          <div
            key={`address-${index}`}
            className="border-r mr-8 border-dashed border-black/50"
          />
        ))}
      </div>

      <div className="absolute left-12 bottom-8 w-3 h-[60%] border-r border-dashed border-black/50">
        <span className="absolute bottom-0 w-16 -rotate-90 origin-left text-xs text-black/70">
          收：
        </span>
      </div>

      <div className="absolute right-8 bottom-8 h-[60%] flex flex-row">
        {[...Array(6)].map((_, index) => (
          <div
            key={`message-${index}`}
            className="border-r mr-8 border-black/50"
          />
        ))}
      </div>
    </div>
  );
}
