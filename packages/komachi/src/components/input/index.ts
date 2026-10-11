export { Input, inputVariants, type InputProps } from "./input";
export { InputArea, Textarea, type InputAreaProps } from "./input-area";

// Re-export InputGroup from its new dedicated directory so that the subpath
// `komachi/components/input` continues to resolve InputGroup.
export {
  InputGroup,
  KOMACHI_INPUT_GROUP_VARIANTS,
  KOMACHI_INPUT_GROUP_DEFAULT_VARIANTS,
} from "../input-group";

// Backward-compatible type aliases - the old `input-group.tsx` exported these
// names. External consumers importing from `komachi/components/input`
// may reference them, so we keep the aliases to avoid breaking type imports.

/**
 * @deprecated `focusMode` is no longer a public prop - it is auto-detected by
 * `InputGroup` based on its children. This type will be removed in a future
 * major version.
 */
export type KomachiInputGroupFocusMode = "container" | "individual";

/**
 * @deprecated `focusMode` is no longer a public prop - it is auto-detected by
 * `InputGroup` based on its children. Use `InputGroupRootProps` from
 * `komachi` instead. This type will be removed in a future major
 * version.
 */
export interface KomachiInputGroupVariantsProps {
  focusMode?: KomachiInputGroupFocusMode;
}
