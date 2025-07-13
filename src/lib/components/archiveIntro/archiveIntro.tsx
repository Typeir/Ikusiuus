import { useTranslations } from 'next-intl';

export const ArchiveIntro = () => {
  const t = useTranslations('archive');

  return (
    <section className='prose max-w-4xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-4'>{t('title')}</h1>

      <p>
        {t.rich('introOne', {
          em: (chunks) => <em>{chunks}</em>,
          br: () => <br />,
        })}
      </p>
      <p>
        {t.rich('introTwo', {
          em: (chunks) => <em>{chunks}</em>,
          br: () => <br />,
        })}
      </p>
      <p>
        {t.rich('introThree', {
          em: (chunks) => <em>{chunks}</em>,
          br: () => <br />,
        })}
      </p>
    </section>
  );
};
