"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ContactInfo, contactsInfo } from "@/lib/contacts";
import { motion } from "motion/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface ContactSectionProps {
  className?: string;
  title?: string;
  titleKey?: string;
  compact?: boolean;
  contacts?: ContactInfo[];
  showTitle?: boolean;
}

export function ContactSection({
  className = "",
  title,
  titleKey = "about.contact.title",
  compact = false,
  contacts = contactsInfo,
  showTitle = true,
}: ContactSectionProps) {
  const { t } = useTranslation("common");
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  return (
    <div className={`bg-white rounded-xl p-8 shadow-md ${className}`}>
      {showTitle && (
        <motion.h2 
          className="text-2xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title || t(titleKey)}
        </motion.h2>
      )}
      <div 
        className={`grid ${
          compact 
            ? "grid-cols-2 md:grid-cols-3 gap-6" 
            : "md:grid-cols-3 gap-8"
        } max-w-4xl mx-auto`}
      >
        <TooltipProvider>
          {contacts.map((contact, index) => {
            const isRedNote = contact.id === "rednote";
            
            // 创建点击事件函数
            const handleCardClick = () => {
              if (isRedNote) {
                // 切换显示/隐藏二维码
                setOpenTooltip(openTooltip === contact.id ? null : contact.id);
              } else if (contact.email) {
                window.location.href = `mailto:${contact.email}`;
              } else if (contact.link) {
                window.open(contact.link, "_blank", "noopener,noreferrer");
              }
            };
            
            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                {isRedNote ? (
                  <Tooltip open={openTooltip === contact.id}>
                    <TooltipTrigger asChild>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={handleCardClick}
                        onMouseEnter={() => setOpenTooltip(contact.id)}
                        onMouseLeave={() => setOpenTooltip(null)}
                      >
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            {contact.customIcon && (
                              <div className="h-14 w-14 flex items-center justify-center mb-3">
                                <Image
                                  src={contact.customIcon}
                                  alt={contact.customIconAlt || contact.title}
                                  width={56}
                                  height={56}
                                />
                              </div>
                            )}
                            
                            <span className="text-indigo-600 text-sm">
                              {contact.title}
                            </span>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" sideOffset={5} className="p-0 bg-transparent border-none shadow-none">
                      <motion.div 
                        className="bg-white p-3 rounded-md shadow-lg border border-gray-200"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {contact.hasQRCode && contact.qrCode && (
                          <>
                            <div className="w-80 h-80">
                              <Image
                                src={contact.qrCode}
                                alt={contact.qrCodeAlt || `${contact.title} QR Code`}
                                width={320}
                                height={320}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-sm text-gray-500 mt-2 text-center">
                              {t("about.contact.scanToFollow")}
                            </p>
                          </>
                        )}
                      </motion.div>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    onClick={handleCardClick}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        {contact.icon ? (
                          <contact.icon className="h-14 w-14 text-indigo-600 mb-3" />
                        ) : contact.customIcon ? (
                          <div className="h-14 w-14 flex items-center justify-center mb-3">
                            <Image
                              src={contact.customIcon}
                              alt={contact.customIconAlt || contact.title}
                              width={56}
                              height={56}
                            />
                          </div>
                        ) : null}
                        
                        <span className="text-indigo-600 text-sm">
                          {contact.email || (contact.link?.includes("github.com") 
                            ? contact.link.split("/").slice(-2).join("/")
                            : contact.title)}
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </TooltipProvider>
      </div>
    </div>
  );
} 