import { useDownloadStore } from "@/store/DownloadStore";

interface SavePickerOptions {
  description?: string;
  mime?: string;
  extensions?: string[]; // e.g. ['.pdf']
}

export const isFileSystemAccessSupported = (): boolean => {
  return typeof window !== "undefined" && "showSaveFilePicker" in window;
};

export const downloadBlobViaAnchor = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export const saveBlobViaFileSystem = async (
  blob: Blob,
  filename: string,
  picker?: SavePickerOptions
) => {
  if (!isFileSystemAccessSupported()) {
    throw new Error("showSaveFilePicker not available");
  }
  const options: any = {
    suggestedName: filename,
    excludeAcceptAllOption: false,
  };
  if (picker?.mime && picker.extensions && picker.extensions.length > 0) {
    options.types = [
      {
        description: picker.description ?? "File",
        accept: { [picker.mime]: picker.extensions },
      },
    ];
  }
  const handle = await (
    window as unknown as {
      showSaveFilePicker: (options: unknown) => Promise<unknown>;
    }
  ).showSaveFilePicker(options);
  const writable = await (handle as any).createWritable();
  await writable.write(blob);
  await writable.close();
};

export const saveBlobWithPreference = async (
  blob: Blob,
  filename: string,
  picker?: SavePickerOptions
) => {
  const downloadState = useDownloadStore.getState();
  try {
    downloadState.setIsExporting(true);

    // New logic:
    // - If askBeforeDownload is enabled: force system save dialog.
    //   If user cancels (AbortError), do nothing (no fallback).
    // - If disabled: always anchor download.
    if (downloadState.askBeforeDownload) {
      if (isFileSystemAccessSupported()) {
        await saveBlobViaFileSystem(blob, filename, picker);
      } else {
        // If not supported, fall back to anchor to ensure a download still happens
        downloadBlobViaAnchor(blob, filename);
      }
    } else {
      downloadBlobViaAnchor(blob, filename);
    }
  } catch (e) {
    // If user canceled the picker, don't fall back to anchor
    const name = (e as any)?.name;
    if (name === "AbortError") {
      console.log("[download] User canceled save dialog; no further action");
    } else {
      console.warn("[download] Error during save; falling back to anchor", e);
      downloadBlobViaAnchor(blob, filename);
    }
  } finally {
    downloadState.setIsExporting(false);
  }
};

export const savePdfBytes = async (pdfBytes: Uint8Array, filename: string) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  await saveBlobWithPreference(blob, filename, {
    description: "PDF document",
    mime: "application/pdf",
    extensions: [".pdf"],
  });
};
