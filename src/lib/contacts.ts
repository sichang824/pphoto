import { Github, LucideIcon, Mail } from "lucide-react";

export type ContactInfo = {
  id: string;
  title: string;
  titleKey: string;
  icon?: LucideIcon;
  customIcon?: string;
  customIconAlt?: string;
  link?: string;
  email?: string;
  qrCode?: string;
  qrCodeAlt?: string;
  hasQRCode?: boolean;
  showQROnHover?: boolean;
};

export const contactsInfo: ContactInfo[] = [
  {
    id: "email",
    title: "Email",
    titleKey: "about.contact.email",
    icon: Mail,
    email: "zhaoanke@163.com",
    link: "mailto:zhaoanke@163.com",
  },
  {
    id: "github",
    title: "GitHub",
    titleKey: "about.contact.github",
    icon: Github,
    link: "https://github.com/sichang824/pphoto",
  },
  {
    id: "rednote",
    title: "RedNote",
    titleKey: "about.contact.xiaohongshu",
    customIcon: "/rednote.svg",
    customIconAlt: "RedNote icon",
    qrCode: "/rednote.png",
    qrCodeAlt: "RedNote QR Code",
    hasQRCode: true,
    showQROnHover: true,
  },
];
