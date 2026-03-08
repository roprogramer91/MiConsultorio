import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { PATTERNS } from "../../styles/patterns";

export const styles = StyleSheet.create({
  keyboardContainer: PATTERNS.screen.keyboardContainer,
  container: PATTERNS.screen.container,
  content: PATTERNS.screen.content,
  header: PATTERNS.screen.header,
  form: PATTERNS.form.form,
  input: PATTERNS.fields.input,
  inputText: {
    fontSize: 17,
    color: "#222",
  },
  placeholderText: PATTERNS.text.placeholderText,
  textarea: PATTERNS.fields.textarea,
  emailHelperBox: PATTERNS.fields.helperBox,
  emailHelperText: PATTERNS.text.helperText,
  domainChipsRow: PATTERNS.fields.chipRow,
  domainChip: PATTERNS.fields.softChip,
  domainChipText: PATTERNS.fields.softChipText,
  footerButtons: PATTERNS.form.footerButtons,
  cancelButton: PATTERNS.buttons.secondary,
  cancelButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
  },
  saveButton: PATTERNS.buttons.primary,
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
