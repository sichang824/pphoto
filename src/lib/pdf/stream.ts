import { useDownloadStore } from "@/store/DownloadStore";
import { detectSafari } from "./index";

// Minimal FS Access type to avoid depending on lib.dom extensions
type SaveFilePickerOptions = {
  suggestedName?: string;
  excludeAcceptAllOption?: boolean;
  types?: Array<{
    description?: string;
    accept: Record<string, string[]>;
  }>;
};

// Shared streaming helpers for PDFKit in browser

export interface StreamingPdf {
  doc: {
    on: (event: "data" | "end", handler: (chunk?: Uint8Array) => void) => void;
    image: (
      img: ArrayBuffer | Uint8Array,
      x: number,
      y: number,
      options: { width?: number; height?: number }
    ) => void;
    addPage: (options: { size: [number, number]; margin: number }) => void;
    // Drawing state and transforms used by safari.ts
    save: () => void;
    restore: () => void;
    translate: (x: number, y: number) => void;
    rotate: (angle: number, options?: { origin?: [number, number] }) => void;
    scale: (
      x: number,
      y?: number,
      options?: { origin?: [number, number] }
    ) => void;
    rect: (
      x: number,
      y: number,
      width: number,
      height: number
    ) => { clip: () => void };
    end: () => void;
  };
  finalize: () => Promise<void>;
}

export async function createStreamingPdf(
  filename: string
): Promise<StreamingPdf> {
  // Load browser standalone build to avoid Node deps
  const PDFKit =
    (await import("pdfkit/js/pdfkit.standalone.js")).default ??
    (await import("pdfkit/js/pdfkit.standalone.js"));
  const streamSaverMod: unknown = await import("streamsaver").catch(() => null);

  // Narrow streamsaver module to a minimal typed surface
  type CreateWriteStream = (
    name: string,
    opts: { size?: number }
  ) => { getWriter(): WritableStreamDefaultWriter<Uint8Array> };
  interface StreamSaverAPI {
    createWriteStream: CreateWriteStream;
    openPopup?: () => void;
    mitm?: string;
  }
  const getStreamSaver = (mod: unknown): StreamSaverAPI | null => {
    if (!mod) return null;
    const candidate = (mod as { default?: unknown }).default ?? mod;
    if (
      candidate &&
      typeof candidate === "object" &&
      "createWriteStream" in (candidate as Record<string, unknown>)
    ) {
      return candidate as StreamSaverAPI;
    }
    return null;
  };
  const streamSaver = getStreamSaver(streamSaverMod);
  if (streamSaver) {
    try {
      streamSaver.mitm = "/streamsaver/mitm.html";
    } catch {}
  }

  const { askBeforeDownload } = useDownloadStore.getState();

  let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;

  // Prefer File System Access API when user allows prompt and not Safari
  const isSafari = detectSafari();
  if (askBeforeDownload && !isSafari && "showSaveFilePicker" in window) {
    try {
      const options: SaveFilePickerOptions = {
        suggestedName: filename,
        excludeAcceptAllOption: false,
        types: [
          {
            description: "PDF document",
            accept: { "application/pdf": [".pdf"] },
          },
        ],
      };
      const w = window as Window &
        typeof globalThis & {
          showSaveFilePicker?: (
            opts: SaveFilePickerOptions
          ) => Promise<FileSystemFileHandle>;
        };
      const handle: FileSystemFileHandle = await w.showSaveFilePicker!(options);
      const writable: FileSystemWritableFileStream =
        await handle.createWritable();
      const ws = new WritableStream<Uint8Array>({
        write: (chunk) => writable.write(chunk),
        close: () => writable.close(),
      });
      writer = ws.getWriter();
    } catch (e) {
      const name = (e as unknown as { name?: string })?.name || "";
      // Silent fallback on user cancel; warn for other errors
      if (name && name !== "AbortError") {
        console.warn("[PDF:stream] File System Access error; falling back", e);
      }
    }
  }

  // Fallback to StreamSaver
  if (!writer && streamSaver) {
    try {
      // Safari: when askBeforeDownload is true, open a popup to make the
      // download UX explicit (keeps a window alive; Safari shows its sheet)
      if (isSafari && askBeforeDownload) {
        try {
          streamSaver.openPopup?.();
        } catch {}
      }
      const fileStream = streamSaver.createWriteStream(filename, {
        size: undefined,
      });
      writer = fileStream.getWriter();
    } catch (e) {
      console.warn("[PDF:stream] StreamSaver unavailable", e);
    }
  }

  if (!writer) {
    throw new Error(
      "No streaming writer available. Enable File System Access or StreamSaver."
    );
  }

  const doc = new (PDFKit as unknown as new (opts: {
    bufferPages: boolean;
    autoFirstPage: boolean;
  }) => StreamingPdf["doc"])({
    bufferPages: true,
    autoFirstPage: false,
  });

  // Wire PDFKit's data stream into WritableStream
  const done = new Promise<void>((resolve) => {
    doc.on("data", (chunk?: Uint8Array) => {
      if (chunk) {
        writer!.write(chunk).catch(() => {});
      }
    });
    doc.on("end", () => {
      writer!.close().catch(() => {});
      resolve();
    });
  });

  return {
    doc,
    finalize: async () => {
      doc.end();
      await done;
      console.log("[PDF:stream] Streamed save complete");
    },
  };
}
