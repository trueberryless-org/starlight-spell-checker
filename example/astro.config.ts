// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import starlightSpellChecker from "starlight-spell-checker";

export const locales = {
  root: { label: "English", lang: "en" },
  de: { label: "Deutsch", lang: "de" },
  es: { label: "Español", lang: "es" },
  ja: { label: "日本語", lang: "ja" },
  fr: { label: "Français", lang: "fr" },
  it: { label: "Italiano", lang: "it" },
  id: { label: "Bahasa Indonesia", lang: "id" },
  "zh-cn": { label: "简体中文", lang: "zh-CN" },
  "pt-br": { label: "Português do Brasil", lang: "pt-BR" },
  "pt-pt": { label: "Português", lang: "pt-PT" },
  ko: { label: "한국어", lang: "ko" },
  tr: { label: "Türkçe", lang: "tr" },
  ru: { label: "Русский", lang: "ru" },
  hi: { label: "हिंदी", lang: "hi" },
  da: { label: "Dansk", lang: "da" },
  uk: { label: "Українська", lang: "uk" },
};

export default defineConfig({
  integrations: [
    starlight({
      title: "Starlight",
      locales,
      sidebar: [
        {
          label: "Start Here",
          translations: {
            de: "Beginne hier",
            es: "Comienza aqui",
            ja: "ここからはじめる",
            fr: "Commencez ici",
            it: "Inizia qui",
            id: "Mulai dari sini",
            "zh-CN": "从这里开始",
            "pt-BR": "Comece Aqui",
            "pt-PT": "Comece Aqui",
            ko: "여기서부터",
            tr: "Buradan Başlayın",
            ru: "Первые шаги",
            hi: "यहाँ से शुरू करे",
            uk: "Почніть звідси",
          },
          items: [
            "getting-started",
            "manual-setup",
            {
              label: "Environmental Impact",
              slug: "environmental-impact",
              translations: {
                de: "Umweltbelastung",
                es: "Documentación ecológica",
                ja: "環境への負荷",
                fr: "Impact environnemental",
                it: "Impatto ambientale",
                id: "Dampak terhadap lingkungan",
                "zh-CN": "环境影响",
                "pt-BR": "Impacto Ambiental",
                "pt-PT": "Impacto Ambiental",
                ko: "환경적 영향",
                tr: "Çevre Etkisi",
                ru: "Влияние на окружающую среду",
                hi: "पर्यावरणीय प्रभाव",
                uk: "Вплив на довкілля",
              },
            },
          ],
        },
        {
          label: "Guides",
          translations: {
            de: "Anleitungen",
            es: "Guías",
            ja: "ガイド",
            fr: "Guides",
            it: "Guide",
            id: "Panduan",
            "zh-CN": "指南",
            "pt-BR": "Guias",
            "pt-PT": "Guias",
            ko: "가이드",
            tr: "Rehber",
            ru: "Руководства",
            hi: "गाइड",
            uk: "Ґайди",
          },
          autogenerate: { directory: "guides" },
        },
        {
          label: "Components",
          translations: {
            de: "Komponenten",
            fr: "Composants",
            ru: "Компоненты",
            ko: "컴포넌트",
            ja: "コンポーネント",
            "zh-CN": "组件",
            uk: "Компоненти",
          },
          autogenerate: { directory: "components" },
        },
        {
          label: "Reference",
          translations: {
            de: "Referenzen",
            es: "Referencias",
            ja: "リファレンス",
            fr: "Référence",
            it: "Riferimenti",
            id: "Referensi",
            "zh-CN": "参考",
            "pt-BR": "Referência",
            ko: "참조",
            tr: "Referanslar",
            ru: "Справочник",
            hi: "संदर्भ",
            uk: "Довідник",
          },
          autogenerate: { directory: "reference" },
        },
        {
          label: "Resources",
          translations: {
            de: "Ressourcen",
            "zh-CN": "资源",
            fr: "Ressources",
            "pt-BR": "Recursos",
            "pt-PT": "Recursos",
            ja: "リソース",
            ru: "Ресурсы",
            ko: "리소스",
            uk: "Ресурси",
          },
          autogenerate: { directory: "resources" },
        },
      ],
      plugins: [
        ...(process.env.CHECK_LINKS
          ? [
              starlightLinksValidator({
                errorOnFallbackPages: false,
                errorOnInconsistentLocale: true,
              }),
            ]
          : []),
        ...(process.env.CHECK_SPELLING ? [starlightSpellChecker()] : []),
      ],
    }),
  ],
});
