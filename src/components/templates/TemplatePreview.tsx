import { ScrollArea } from "@/components/ui/scroll-area";
import { Template } from "@/types/template";
import { FC } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface TemplatePreviewProps {
  selectedTemplate: Template | null;
}

export const TemplatePreview: FC<TemplatePreviewProps> = ({
  selectedTemplate,
}) => {
  return (
    <ScrollArea className="h-full w-full">
      {selectedTemplate ? (
        <div className="flex flex-col items-center justify-center h-full p-4 space-y-6">
          <div className="relative w-full aspect-video max-w-2xl rounded-lg overflow-hidden">
            <Image
              src={selectedTemplate.image}
              alt={selectedTemplate.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center space-y-6 w-full max-w-md">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
              <p className="text-sm text-muted-foreground">
                创建时间：{format(new Date(selectedTemplate.createdAt), 'PPP', { locale: zhCN })}
              </p>
            </div>
            
            {/* 统计信息 */}
            <div className="w-full grid grid-cols-2 gap-4 bg-muted/50 rounded-lg p-4">
              <div className="flex flex-col items-center space-y-1 p-2">
                <span className="text-2xl font-bold">{selectedTemplate.items.length}</span>
                <span className="text-sm text-muted-foreground">照片项</span>
              </div>
              <div className="flex flex-col items-center space-y-1 p-2">
                <span className="text-2xl font-bold">{selectedTemplate.customSizes.length}</span>
                <span className="text-sm text-muted-foreground">自定义尺寸</span>
              </div>
            </div>

            {/* 配置信息 */}
            <div className="w-full space-y-3">
              <h4 className="font-medium text-center">模板配置</h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-muted/30 rounded-lg p-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">纸张大小</p>
                  <p>{selectedTemplate.configs.paperSize}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">纸张方向</p>
                  <p>{selectedTemplate.configs.paperLandscape ? '横向' : '纵向'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">页面边距</p>
                  <p>{selectedTemplate.configs.pageMargin}{selectedTemplate.configs.pageMarginUnit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">间距</p>
                  <p>{selectedTemplate.configs.spacing}mm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">双面打印</p>
                  <p>{selectedTemplate.configs.doubleSided ? '是' : '否'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">打印样式</p>
                  <p>{selectedTemplate.configs.printStyleId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">像素比</p>
                  <p>{selectedTemplate.configs.pixelRatio}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">图片质量</p>
                  <p>{selectedTemplate.configs.imageQuality}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-muted-foreground">启用比例映射</p>
                  <p>{selectedTemplate.configs.enableRatioMap ? '是' : '否'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          请选择模板查看详情
        </div>
      )}
    </ScrollArea>
  );
};
