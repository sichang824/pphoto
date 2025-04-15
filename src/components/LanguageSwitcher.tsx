import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';
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
      variant="outline"
      size="sm"
      className="text-sm font-medium"
    >
      {language === 'en' ? t('language.zh') : t('language.en')}
    </Button>
  );
} 