import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadTemplate } from "@/lib/template-utils";
import { cn } from "@/lib/utils";
import { Template } from "@/types/template";
import { Share, Share2, Trash2 } from "lucide-react";
import { FC } from "react";

interface TemplateListProps {
  templates: Template[];
  selectedTemplate: Template | null;
  showTemplateInput: boolean;
  newTemplateName: string;
  onTemplateSelect: (template: Template) => void;
  onTemplateLoad: (id: string) => void;
  onTemplateRemove: (id: string) => void;
  onNewTemplateChange: (value: string) => void;
  onNewTemplateSave: () => void;
  onNewTemplateCancel: () => void;
}

export const TemplateList: FC<TemplateListProps> = ({
  templates,
  selectedTemplate,
  showTemplateInput,
  newTemplateName,
  onTemplateSelect,
  onTemplateLoad,
  onTemplateRemove,
  onNewTemplateChange,
  onNewTemplateSave,
  onNewTemplateCancel,
}) => {
  return (
    <div className="flex flex-col h-full">
      {showTemplateInput && (
        <div className="flex flex-col gap-2 mb-4 shrink-0">
          <Input
            type="text"
            placeholder="输入模板名称"
            value={newTemplateName}
            onChange={(e) => onNewTemplateChange(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="icon" className="flex-1" onClick={onNewTemplateSave}>
              保存
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onNewTemplateCancel}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "flex justify-between items-center p-2 bg-white text-black border rounded-lg cursor-pointer hover:bg-gray-100 group",
                selectedTemplate?.id === template.id && "bg-blue-500 text-white hover:bg-blue-600"
              )}
              onClick={() => onTemplateSelect(template)}
            >
              <span>{template.name}</span>
              <div className="hidden group-hover:flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="default"
                        className="w-4 h-4 p-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadTemplate(template);
                        }}
                      >
                        <Share2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>导出模板</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="default"
                        className="w-4 h-4 p-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateLoad(template.id);
                        }}
                      >
                        <Share />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>加载模板</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="w-4 h-4 p-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTemplateRemove(template.id);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>删除模板</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
