"use client";

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@heroui/react";
import { RiGlobalLine } from "@remixicon/react";
import { locales } from "@/lib/i18n";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher({ locale = 'en' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(locale);

  const handleLanguageChange = (key) => {
    setSelectedLanguage(key);
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // 获取当前URL的查询参数
    const searchParams = new URLSearchParams(window.location.search);
    const queryString = searchParams.toString();
    
    // 构建新的URL,包含查询参数
    const newPath = `/${key}${pathWithoutLocale}${queryString ? `?${queryString}` : ''}`;
    router.push(newPath);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className="capitalize">
          <RiGlobalLine className="w-4 h-4"/> {locales[selectedLanguage]?.name || "Language"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={[selectedLanguage]}
        onAction={handleLanguageChange}
      >
        {Object.entries(locales).map(([key, locale]) => (
          <DropdownItem key={key}>
            {locale.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}