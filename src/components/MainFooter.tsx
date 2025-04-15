"use client";

import { useTranslation } from "react-i18next";

export default function MainFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className="bg-gray-100 py-10 px-6 text-center text-gray-500 mt-20">
      <div>{t("footer.copyright")}</div>
    </footer>
  );
} 