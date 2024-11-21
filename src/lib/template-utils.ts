import { Template } from "@/types/template";

export const downloadTemplate = (template: Template) => {
  const jsonString = JSON.stringify(template, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${template.name}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}; 