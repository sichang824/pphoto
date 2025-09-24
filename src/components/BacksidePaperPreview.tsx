import { usePreviewStore } from "@/store/PreviewStore";
import { PhotoItem } from "@/components/types";
import { StyledPreviewItem } from "./StyledPreviewItem";

const StyledBacksidePaperPreview = ({
  id,
  items,
  style,
  paperMarginStyle,
  contentClass,
  itemsClass,
  justifyClass,
  paperSize,
}: {
  id: string;
  items: PhotoItem[];
  style: React.CSSProperties;
  paperMarginStyle: React.CSSProperties;
  contentClass: string;
  itemsClass: string;
  justifyClass: string;
  paperSize: string;
}) => {
  const { showGuides } = usePreviewStore();
  
  return (
    <div
      style={style}
      id={`${id}-backside`}
      className={`relative bg-white border border-gray-100`}
    >
      <div
        className={`absolute inset-0 ${showGuides ? 'border border-dashed border-gray-100' : ''} flex flex-wrap ${contentClass} ${itemsClass} ${justifyClass} overflow-hidden`}
        style={paperMarginStyle}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <StyledPreviewItem key={item.id} item={item} />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300 font-bold">
            {paperSize}
          </div>
        )}
      </div>
    </div>
  );
};

export function BacksidePaperPreview({
  items,
  id,
}: {
  items: PhotoItem[];
  id: string;
}) {
  const {
    paperSize,
    paperLandscape,
    pageMargin,
    pageMarginUnit,
    printStyleId,
    doubleSided,
    spacing,
  } = usePreviewStore();

  const { paperSizes } = usePreviewStore.getState();
  const ps = paperSizes[paperSize];
  const paperWidth = paperLandscape ? ps.height : ps.width;
  const paperHeight = paperLandscape ? ps.width : ps.height;

  const style = {
    width: `${paperWidth}mm`,
    height: `${paperHeight}mm`,
    // transform: `rotate(180deg) scaleX(-1)`,
  };

  const paperMarginStyle = {
    margin: `${pageMargin}${pageMarginUnit}`,
    gap: `${spacing}mm`,
  };
  const contentClass = paperSize == "六寸" ? "content-center" : "content-start";
  const itemsClass = paperSize == "六寸" ? "items-center" : "items-start";
  const justifyClass = paperSize == "六寸" ? "justify-center" : "justify-start";

  if (!doubleSided || printStyleId === "normal") return null;

  return (
    <>
      {`${id}-backside`}
      <StyledBacksidePaperPreview
        style={style}
        paperMarginStyle={paperMarginStyle}
        contentClass={contentClass}
        itemsClass={itemsClass}
        justifyClass={justifyClass}
        paperSize={paperSize}
        items={items}
        id={id}
      />
    </>
  );
}
