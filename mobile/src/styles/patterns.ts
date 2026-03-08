import { TOKENS } from "./tokens";

const { colors, radius, shadow, sizes, spacing, type } = TOKENS;

export const PATTERNS = {
  screen: {
    keyboardContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      paddingBottom: spacing.contentBottom,
    },
    header: {
      backgroundColor: colors.primary,
      paddingTop: spacing.headerTop,
      paddingHorizontal: spacing.screen,
      paddingBottom: spacing.headerBottom,
    },
  },
  form: {
    form: {
      paddingHorizontal: spacing.screen,
      paddingTop: 24,
    },
    section: {
      marginHorizontal: spacing.screen,
      marginBottom: spacing.section,
    },
    row: {
      flexDirection: "row",
      gap: spacing.row,
      marginHorizontal: spacing.screen,
    },
    half: {
      flex: 1,
      marginHorizontal: 0,
    },
    sectionNoMarginBottom: {
      marginBottom: 0,
    },
    footerButtons: {
      flexDirection: "row",
      gap: spacing.row,
      marginTop: 10,
    },
  },
  surfaces: {
    cardSection: {
      marginHorizontal: spacing.screen,
      marginBottom: spacing.section,
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      paddingVertical: spacing.section,
      ...shadow.card,
    },
    introCard: {
      backgroundColor: colors.introBg,
      borderRadius: radius.field,
      padding: spacing.field,
      marginBottom: spacing.field,
    },
    dirtyBanner: {
      backgroundColor: colors.warningBg,
      borderRadius: radius.banner,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: spacing.field,
      borderWidth: 1,
      borderColor: colors.warningBorder,
    },
  },
  text: {
    label: {
      fontSize: type.section,
      fontWeight: "700",
      color: "#4a4a4a",
      marginBottom: 10,
    },
    required: {
      color: colors.primary,
    },
    inputText: {
      fontSize: type.body,
      color: colors.text,
    },
    placeholderText: {
      fontSize: type.bodyLarge,
      color: colors.textSoft,
    },
    helperText: {
      fontSize: type.helper,
      color: colors.textMuted,
      marginBottom: 10,
    },
  },
  fields: {
    input: {
      backgroundColor: colors.surface,
      borderRadius: radius.field,
      borderWidth: 1.5,
      borderColor: colors.border,
      minHeight: sizes.controlHeight,
      paddingHorizontal: 18,
      justifyContent: "center",
      fontSize: type.bodyLarge,
      color: colors.text,
      marginBottom: spacing.field,
    },
    inputChanged: {
      borderColor: colors.primary,
      backgroundColor: "#fff8fa",
    },
    textarea: {
      minHeight: sizes.textAreaHeight,
      paddingTop: 18,
      textAlignVertical: "top",
    },
    helperBox: {
      marginTop: -4,
      marginBottom: spacing.field,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.chip,
    },
    softChip: {
      backgroundColor: colors.chipBg,
      borderRadius: radius.chip,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    softChipText: {
      fontSize: type.helper,
      fontWeight: "700",
      color: colors.chipText,
    },
    dropdown: {
      backgroundColor: colors.surface,
      borderRadius: radius.field,
      marginTop: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
      zIndex: 20,
      elevation: 20,
    },
    dropdownScroll: {
      maxHeight: 250,
    },
  },
  buttons: {
    secondary: {
      flex: 1,
      minHeight: sizes.controlHeight,
      borderRadius: radius.field,
      backgroundColor: colors.neutralButtonBg,
      borderWidth: 1,
      borderColor: colors.neutralButtonBorder,
      justifyContent: "center",
      alignItems: "center",
    },
    secondaryText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.neutralButtonText,
    },
    primary: {
      flex: 2,
      minHeight: sizes.controlHeight,
      borderRadius: radius.field,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    primaryText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "700",
    },
    danger: {
      minHeight: 52,
      borderRadius: radius.banner,
      backgroundColor: colors.dangerBg,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.dangerBorder,
    },
    dangerText: {
      color: colors.dangerText,
      fontSize: 15,
      fontWeight: "700",
    },
  },
} as const;
