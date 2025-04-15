import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { t } = useTranslation('common');
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="ghost"
      size="sm"
      title={language === 'en' ? t('language.zh') : t('language.en')}
      className="flex items-center gap-1 px-3 rounded-md"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium text-xs">
        {language === 'en' ? 'EN' : '中文'}
      </span>
    </Button>
  );
}
