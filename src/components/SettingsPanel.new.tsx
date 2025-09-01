"use client";

import { FC } from "react";
import PaperSettings from "@/components/settings/PaperSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import LayoutSettings from "@/components/settings/LayoutSettings";
import DuplexSettings from "@/components/settings/DuplexSettings";
import ExportSettings from "@/components/settings/ExportSettings";
import MappingSettings from "@/components/settings/MappingSettings";

const SettingsPanel: FC = () => {
  return (
    <>
      <h3 className="text-sm font-medium mb-2">设置</h3>
      <div className="space-y-4">
        <PaperSettings />
        <AppearanceSettings />
        <LayoutSettings />
        <DuplexSettings />
        <ExportSettings />
        <MappingSettings />
      </div>
    </>
  );
};

export default SettingsPanel;


