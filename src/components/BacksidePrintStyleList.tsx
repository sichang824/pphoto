import { usePreviewStore } from "@/store/previewStore";
import { cn } from "@/lib/utils";
import { BACKSIDE_PRINT_STYLES } from "@/store/previewStore";

export default function BacksidePrintStyleList() {
  const { printStyleId, setPrintStyleId, doubleSided } = usePreviewStore();

  return doubleSided ? (
    <>
      <h3 className="text-sm font-medium mb-2">
        <span>双面打印样式</span>
        <span className="text-gray-500 text-xs">
          （打印时选择<span className="font-bold text-red-500">短边</span>
          翻转）
        </span>
      </h3>

      <div className="space-y-2">
        {BACKSIDE_PRINT_STYLES.map((style) => (
          <div
            key={style.id}
            className={cn(
              "p-3 rounded-lg border cursor-pointer transition-colors",
              printStyleId === style.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => setPrintStyleId(style.id)}
          >
            <div className="font-medium text-sm">{style.name}</div>
            <div className="text-xs text-gray-500">{style.description}</div>
          </div>
        ))}
      </div>
    </>
  ) : null;
}
