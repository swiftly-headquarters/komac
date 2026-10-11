---
name: komachi-design
description: SwiftlyLabs product design guidelines for Komachi. Use when designing, implementing, or reviewing Komachi interfaces, responsive styling, dialogs, or frontend tests.
---

# Komachi Design

Apply these rules when designing, implementing, or reviewing Komachi interfaces. Follow recommended examples and avoid patterns marked as examples to avoid.

## Rules

### `content-text-size` Set content text at 14px

Body copy, buttons, data, and every other interactive element must use 14px text. Reserve 16px and larger for headings and subheadings.

**Good**

```tsx
<Text>Content text</Text>
```

**Avoid**

```tsx
<Text size="lg">Content text</Text>
```

### `heading-case` Write headings in sentence case

Do not capitalize every word or use uppercase in headings. Product names stay title-cased.

**Good**

```tsx
<Text as="h2">Recent requests</Text>
```

**Avoid**

```tsx
<Text as="h2">Recent Requests</Text>
```

```tsx
<Text as="h2" DANGEROUS_className="uppercase">Recent requests</Text>
```

### `font-tracking` Leave font tracking alone

Avoid the `tracking-*` classes; they alter the spacing between characters.

**Good**

```tsx
<span className="text-lg">Delivery Metrics</span>
```

**Avoid**

```tsx
<span className="text-lg tracking-tight">Delivery Metrics</span>
```

### `font-weight` Avoid `font-bold`

Apply `font-semibold` to headings and `font-medium` to emphasized inline text.

**Good**

```tsx
<Text as="h3" variant="heading">Account settings</Text>
<Text as="strong" bold>required</Text>
```

**Avoid**

```tsx
<Text as="h3" DANGEROUS_className="font-bold">Account settings</Text>
<Text as="strong" DANGEROUS_className="font-bold">required</Text>
```

### `related-text-spacing` Keep related text close

Text that belongs together should sit closer than the spacing between it and neighboring content.

**Good**

```tsx
<div className="grid gap-6">
  <div className="grid gap-1.5">
    <Text as="h3" variant="heading">Web Analytics</Text>
    <Text>Measure site traffic without changing your code.</Text>
  </div>
  <Button>Configure</Button>
</div>
```

**Avoid**

```tsx
<div className="grid gap-4">
  <Text as="h3" variant="heading">Web Analytics</Text>
  <Text>Measure site traffic without changing your code.</Text>
  <Button>Configure</Button>
</div>
```

### `text-spacing` Balance spacing around text optically

Account for line height when spacing text. In practice, vertical padding is usually a little smaller than horizontal padding.

**Good**

```tsx
<LayerCard className="px-5 py-4">...</LayerCard>
```

**Avoid**

```tsx
<LayerCard className="p-5">...</LayerCard>
```

### `hover-color-transitions` Skip color transitions on hover

Hover color changes should happen instantly. Transitions on quick interactions make the UI feel slow.

**Good**

```tsx
<button className="hover:bg-komachi-tint">...</button>
```

**Avoid**

```tsx
<button className="transition-colors duration-300 hover:bg-komachi-tint">...</button>
```

### `shadow-borders` Do not combine borders with drop shadows

Add `ring ring-komachi-line` instead, which draws a transparent border and keeps edges crisp.

**Good**

```tsx
<LayerCard className="shadow-md ring ring-komachi-line">...</LayerCard>
```

**Avoid**

```tsx
<LayerCard className="border border-komachi-line shadow-md">...</LayerCard>
```

### `concentric-border-radius` Nest border radii concentrically

If two borders or rings are 8px or closer, their corner radii must be concentric: outer radius equals inner radius plus padding.

**Good**

```tsx
<div className="rounded-xl p-1">
  <div className="rounded-lg">...</div>
</div>
```

**Avoid**

```tsx
<div className="rounded-xl p-1">
  <div className="rounded-xl">...</div>
</div>
```

### `icon-alignment` Line up icons with the first line of text

Inline icons should look the same size as the text and be vertically centered on it. For text that wraps, use `h-lh flex items-center`.

**Good**

```tsx
<div className="flex items-start gap-2">
  <span className="h-lh flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>
```

**Avoid**

```tsx
<div className="flex items-start gap-2">
  <span className="flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>
```

```tsx
<div className="flex items-center gap-2">
  <Icon />
  <Text>Text that may wrap onto multiple lines</Text>
</div>
```

### `inline-monospace-size` Shrink inline monospaced text

When monospaced text sits among regular text, set it slightly smaller (about 0.9em).

**Good**

```tsx
<Text size="lg">
  Edit <span className="font-mono text-[0.9em]">notify.config.json</span>{" "}
  to continue.
</Text>
```

**Avoid**

```tsx
<Text size="lg">
  Edit <span className="font-mono">notify.config.json</span> to continue.
</Text>
```

### `sticky-borders` Separate sticky elements from content with `border`

**Good**

```tsx
<div className="sticky top-0 border-b border-komachi-line">...</div>
```

**Avoid**

```tsx
<div className="sticky top-0">...</div>
```

### `collapse-content-size` Keep content size fixed while collapsing

Collapsible content should hold its size as it closes, so nothing shifts around during the animation.

**Good**

```tsx
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">...</div>
</motion.div>
```

**Avoid**

```tsx
<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">...</div>
</motion.div>
```

### `layer-card-nesting` Do not nest one `LayerCard` inside another

**Good**

```tsx
<div>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</div>
```

**Avoid**

```tsx
<LayerCard>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</LayerCard>
```

### `dialog-rendering` Do not conditionally render dialogs

Mounting a dialog conditionally removes its open and close animation. Control visibility with the `open` prop instead.

**Good**

```tsx
<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog>
    <Dialog.Title>Edit Endpoint</Dialog.Title>
    <Dialog.Description>Update this endpoint's settings.</Dialog.Description>
  </Dialog>
</Dialog.Root>
```

**Avoid**

```tsx
{open && (
  <Dialog.Root open>
    <Dialog>
      <Dialog.Title>Edit Endpoint</Dialog.Title>
    </Dialog>
  </Dialog.Root>
)}
```
