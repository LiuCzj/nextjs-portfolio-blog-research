import { getTranslations } from "next-intl/server";
import type React from "react";

import Brief from "@/components/portfolio/brief";
import Contact from "@/components/portfolio/contact";
import NewsSection from "@/components/portfolio/news";
import Skills from "@/components/portfolio/skills";
import SocialLinks from "@/components/portfolio/socallinks";
import { CustomReactMarkdown } from "@/components/react-markdown";
import { BlurFade } from "@/components/ui/blur-fade";
import { BLUR_FADE_DELAY, siteConfig } from "@/data/site";
import { routing } from "@/i18n/routing";
import { generatePersonJsonLd } from "@/lib/jsonld";
import { transformSocialData } from "@/lib/social-icons";
import { jsonldScript } from "@/lib/utils";

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale || routing.defaultLocale;
  const t = await getTranslations({ locale });

  // 社交链接数据
  const socialData = transformSocialData(
    t.raw("social") as Record<
      string,
      {
        name: string;
        url: string;
        icon: string;
        navbar?: boolean;
        content?: boolean;
        footer?: boolean;
      }
    >,
  );

  // 技能列表（直接从 i18n 读取，如果没有则用空数组）
  const skills: string[] = (() => {
    try {
      const raw = t.raw("skills");
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  })();

  // 动态新闻（直接从 i18n 读取）
  const newsItems: Array<{ date: string; title: string; content: string }> = (
    () => {
      try {
        const raw = t.raw("news.items");
        return Array.isArray(raw) ? raw : [];
      } catch {
        return [];
      }
    }
  )();

  const personJsonLd = await generatePersonJsonLd(locale);

  return (
    <main className="mx-auto flex min-h-dvh max-w-7xl flex-col space-y-8 px-6 py-8 pb-24 sm:space-y-10 sm:px-16 md:px-20 md:py-16 md:pt-14 lg:px-24 lg:py-20 xl:px-32 xl:py-24">
      {/* Hero Section */}
      <section id="hero" className="mt-16 sm:mt-28">
        {jsonldScript(personJsonLd)}
        <BlurFade delay={0}>
          <Brief
            name={t("name.full")}
            firstName={t("name.given")}
            surname={t("name.family")}
            initials={t("name.initials")}
            subtitle={t("subtitle")}
            description={t("headline")}
            avatarUrl={siteConfig.avatarUrl}
            className="mx-auto w-full max-w-2xl space-y-8"
            locale={locale}
          />
        </BlurFade>
      </section>

      {/* Social Links Section */}
      <section id="social">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <SocialLinks socials={socialData} />
        </BlurFade>
      </section>

      {/* About Section */}
      <section id="about">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <h2 className="text-xl font-bold">{t("sections.about")}</h2>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="prose text-muted-foreground dark:prose-invert max-w-full font-sans text-sm text-pretty [&_img]:my-0 [&_img]:inline-block [&_img]:h-[1em] [&_img]:w-auto [&_img]:align-baseline">
            <CustomReactMarkdown>{t("bioMarkdown")}</CustomReactMarkdown>
          </div>
        </BlurFade>
      </section>

      {/* News Section (如果有内容则显示) */}
      {newsItems.length > 0 && (
        <section id="news">
          <NewsSection
            news={newsItems}
            delay={BLUR_FADE_DELAY * 5}
            title={t("sections.news.title")}
            showAllText={t("showAll")}
          />
        </section>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <section id="skills">
          <div className="flex min-h-0 flex-col gap-y-3">
            <h2 className="text-xl font-bold">{t("sections.skills")}</h2>
            <Skills skills={skills} />
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact">
        <div className="grid w-full items-center justify-center gap-4 px-4 py-12 text-center md:px-6">
          <Contact
            emailUrl={socialData.email?.url ?? "#"}
            calendlyUrl={socialData.calendly?.url}
            contactLabel={t("sections.contact")}
            getInTouch={t("sections.getInTouch")}
            contactDescription={t("sections.contactDescription")}
            viaEmail={t("sections.viaEmail")}
            askQuestions={t("sections.askQuestions")}
            exploreCollaboration={t("sections.exploreCollaboration")}
            coffeeChat={t("sections.coffeeChat")}
            schedule={t("sections.schedule")}
          />
        </div>
      </section>
    </main>
  );
}
