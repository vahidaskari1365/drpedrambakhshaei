"use client";

import { Phone, MessageCircle, SendHorizontal, Instagram, MapPin } from "lucide-react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { useSite } from "./content-provider";

/**
 * داک شناور دسترسی سریع (Magic UI Dock)
 * تماس، واتسپ، تلگرام، اینستاگرام و مسیریابی — همیشه در دسترس، موبایل‌فرست
 */
export function QuickDock() {
  const { site } = useSite();

  const items = [
    { href: `tel:${site.phone}`, label: "تماس با مطب", Icon: Phone, external: false },
    { href: site.social.whatsapp, label: "واتسپ", Icon: MessageCircle, external: true },
    { href: site.social.telegram, label: "تلگرام", Icon: SendHorizontal, external: true },
    { href: site.social.instagram, label: "اینستاگرام", Icon: Instagram, external: true },
    { href: site.mapsUrl, label: "مسیریابی در گوگل مپ", Icon: MapPin, external: true },
  ];

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="دسترسی سریع"
    >
      <div className="pointer-events-auto">
        <Dock iconSize={42} iconMagnification={56}>
          {items.map(({ href, label, Icon, external }) => (
            <DockIcon key={label} className="text-teal-100">
              <a
                href={href}
                aria-label={label}
                title={label}
                className="flex size-full items-center justify-center"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            </DockIcon>
          ))}
        </Dock>
      </div>
    </div>
  );
}
