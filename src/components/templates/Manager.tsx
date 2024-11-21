import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePreviewStore } from "@/store/previewStore";
import { Template } from "@/types/template";
import { toPng } from "html-to-image";
import { FC, useState } from "react";
import { TemplateList } from "./TemplateList";
import { TemplatePreview } from "./TemplatePreview";

const TemplateManager: FC = () => {
  const [newTemplateName, setNewTemplateName] = useState("");
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const {
    templates,
    saveTemplate,
    importTemplate,
    loadTemplate,
    removeTemplate,
    addTemplate,
  } = usePreviewStore();

  const handleSaveTemplate = async () => {
    if (newTemplateName.trim()) {
      const el = document.getElementById("page-1") as HTMLElement;
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        quality: 3,
      });

      saveTemplate(newTemplateName.trim(), dataUrl);
      setNewTemplateName("");
      setShowTemplateInput(false);
    }
  };

  const handleLoadTemplate = (id: string) => {
    loadTemplate(id);
    setOpen(false);
  };

  const handleImportTemplate = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const template = JSON.parse(text) as Template;
      importTemplate(template);
      addTemplate(template);
    } catch (error) {
      console.error("导入模板失败:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">模板管理</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-[700px] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={() => setShowTemplateInput(true)}
                className="px-4"
              >
                保存模板
              </Button>
              <Button
                variant="default"
                className="px-4"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".json";
                  input.onchange = (e) => handleImportTemplate(e as unknown as React.ChangeEvent<HTMLInputElement>);
                  input.click();
                }}
              >
                导入模板
              </Button>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-1 gap-4 overflow-hidden">
          <div className="w-1/3 rounded-lg bg-gray-100 p-2">
            <TemplateList
              templates={templates}
              selectedTemplate={selectedTemplate}
              showTemplateInput={showTemplateInput}
              newTemplateName={newTemplateName}
              onTemplateSelect={setSelectedTemplate}
              onTemplateLoad={handleLoadTemplate}
              onTemplateRemove={removeTemplate}
              onNewTemplateChange={setNewTemplateName}
              onNewTemplateSave={handleSaveTemplate}
              onNewTemplateCancel={() => {
                setShowTemplateInput(false);
                setNewTemplateName("");
              }}
            />
          </div>

          <div className="w-2/3">
            <TemplatePreview selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateManager;
