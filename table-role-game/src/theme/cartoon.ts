import type { ThemeConfig } from 'antd'

export const cartoonTheme: ThemeConfig = {
  token: {
    // Цвета — мягкая мультяшная палитра
    colorPrimary: '#20b2aa',      // бирюзово-зелёный (primary кнопки, прогресс, чекбоксы)
    colorSuccess: '#52c41a',
    colorWarning: '#ffa726',      // оранжевый для акцентов
    colorError: '#f093b0',        // мягкий розовый (danger)
    colorInfo: '#20b2aa',

    // Фоны — бежевый/кремовый
    colorBgContainer: '#fffef8',
    colorBgElevated: '#fffef8',
    colorBgLayout: '#f5f0e6',
    colorBgSpotlight: 'rgba(245, 240, 230, 0.95)',

    // Границы — тонкие, светлые
    colorBorder: '#e8e4dc',
    colorBorderSecondary: '#efece6',

    // Текст
    colorText: '#2c2c2c',
    colorTextSecondary: '#6b6b6b',
    colorTextTertiary: '#999999',

    // Очень округлые углы — характерная черта мультяшного стиля
    borderRadius: 16,
    borderRadiusLG: 20,
    borderRadiusSM: 12,
    borderRadiusXS: 8,

    // Мягкие тени
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 2px 12px rgba(0, 0, 0, 0.04)',

    // Шрифт — немного округлый
    fontFamily: '"Nunito", "Comic Neue", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 14,

    // Дополнительно
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      borderRadius: 16,
      borderRadiusLG: 20,
      borderRadiusSM: 12,
      primaryShadow: '0 2px 0 rgba(32, 178, 170, 0.2)',
      defaultShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
      dangerShadow: '0 2px 0 rgba(240, 147, 176, 0.2)',
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 20,
      activeBorderColor: '#20b2aa',
      hoverBorderColor: '#20b2aa',
      paddingBlock: 10,
      paddingInline: 16,
    },
    Select: {
      borderRadius: 20,
      selectorBg: '#fffef8',
    },
    Modal: {
      borderRadiusLG: 24,
      contentBg: '#fffef8',
      headerBg: '#fffef8',
    },
    Card: {
      borderRadiusLG: 20,
    },
    Slider: {
      trackBg: '#e8e4dc',
      railSize: 8,
      handleSize: 18,
      handleLineWidth: 2,
      trackHoverBg: '#20b2aa',
    },
    Progress: {
      borderRadius: 20,
      remainingColor: '#efece6',
    },
    Steps: {
      iconSize: 40,
      iconFontSize: 18,
    },
    Switch: {
      trackHeight: 24,
      trackMinWidth: 44,
      handleSize: 20,
    },
    Checkbox: {
      borderRadiusSM: 6,
    },
    Radio: {
      dotSize: 10,
    },
    Tag: {
      borderRadiusSM: 12,
    },
    Dropdown: {
      borderRadiusLG: 16,
    },
    Tooltip: {
      borderRadius: 12,
    },
  },
}
