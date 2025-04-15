"use client";

import { useTranslation } from "react-i18next";
import { ContactSection } from "./ContactSection";

export default function MainFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-gray-100 py-10 px-6 text-center text-gray-500 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <ContactSection 
            compact={true}
            className="bg-gray-100 shadow-none"
          />
        </div>
        <div className="border-t border-gray-300 pt-6">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
} 