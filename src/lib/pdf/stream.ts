import { useDownloadStore } from "@/store/DownloadStore";
import { detectSafari } from "./index";

// Shared streaming helpers for PDFKit in browser

export interface StreamingPdf {
  doc: any;
  finalize: () => Promise<void>;
}

export async function createStreamingPdf(
  filename: string
): Promise<StreamingPdf> {
  // Load browser standalone build to avoid Node deps
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PDFKit: any =
    (await import("pdfkit/js/pdfkit.standalone.js")).default ??
    (await import("pdfkit/js/pdfkit.standalone.js"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const streamSaverMod: any = await import("streamsaver").catch(() => null);

  if (streamSaverMod) {
    try {
      (streamSaverMod.default ?? streamSaverMod).mitm =
        "/streamsaver/mitm.html";
    } catch {}
  }

  const { askBeforeDownload } = useDownloadStore.getState();

  let writer: WritableStreamDefaultWriter<Uint8Array> | null = null;

  // Prefer File System Access API when user allows prompt and not Safari
  const isSafari = detectSafari();
  if (
    askBeforeDownload &&
    !isSafari &&
    typeof (window as any).showSaveFilePicker === "function"
  ) {
    try {
      const options: any = {
        suggestedName: filename,
        excludeAcceptAllOption: false,
        types: [
          {
            description: "PDF document",
            accept: { "application/pdf": [".pdf"] },
          },
        ],
      };
      const handle = await (window as any).showSaveFilePicker(options);
      const writable: any = await handle.createWritable();
      const ws = new WritableStream<Uint8Array>({
        write: (chunk) => writable.write(chunk),
        close: () => writable.close(),
      });
      writer = ws.getWriter();
    } catch (e) {
      const name = (e as any)?.name || "";
      // Silent fallback on user cancel; warn for other errors
      if (name && name !== "AbortError") {
        console.warn("[PDF:stream] File System Access error; falling back", e);
      }
    }
  }

  // Fallback to StreamSaver
  if (!writer && streamSaverMod) {
    try {
      // Safari: when askBeforeDownload is true, open a popup to make the
      // download UX explicit (keeps a window alive; Safari shows its sheet)
      if (isSafari && askBeforeDownload) {
        try {
          (streamSaverMod.default ?? streamSaverMod).openPopup?.();
        } catch {}
      }
      const fileStream = (
        streamSaverMod.default ?? streamSaverMod
      ).createWriteStream(filename, { size: undefined });
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

  const doc = new PDFKit({ bufferPages: true, autoFirstPage: false });

  // Wire PDFKit's data stream into WritableStream
  const done = new Promise<void>((resolve) => {
    doc.on("data", (chunk: Uint8Array) => {
      writer!.write(chunk).catch(() => {});
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
