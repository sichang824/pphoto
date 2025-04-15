"use client";

import { contactsInfo } from "@/lib/contacts";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ContactSection } from "./ContactSection";

export default function MainFooter() {
  const { t } = useTranslation("common");

  // 获取GitHub和邮箱链接
  const githubContact = contactsInfo.find((c) => c.id === "github");
  const emailContact = contactsInfo.find((c) => c.id === "email");

  return (
    <footer className="bg-gray-100 py-10 px-6 text-center text-gray-500 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <ContactSection compact={true} className="bg-gray-100 shadow-none" />
        </div>
        <div className="border-t border-gray-300 pt-6 flex flex-wrap justify-center gap-2">
          <span>{t("footer.copyright")}</span>
          <span>|</span>
          <span>{t("footer.projectInfo")}</span>
          <span>|</span>
          {githubContact?.link ? (
            <a
              href={githubContact.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              {t("footer.github")}
            </a>
          ) : (
            <span>{t("footer.github")}</span>
          )}
          <span>|</span>
          {emailContact?.link ? (
            <a
              href={emailContact.link}
              className="text-indigo-600 hover:underline"
            >
              {t("footer.contact")}
            </a>
          ) : (
            <Link href="/about" className="text-indigo-600 hover:underline">
              {t("footer.contact")}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
