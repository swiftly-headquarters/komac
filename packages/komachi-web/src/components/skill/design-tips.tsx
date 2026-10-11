import { Button, LayerCard, Text } from "komachi";
import { CodeHighlighted } from "komachi/code";
import { WarningIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { CollapseSizeExample } from "./CollapseSizeExample";

export interface DesignTipExample {
  variant: "good" | "bad";
  exampleCode?: string;
  jsx: ReactNode;
}

export interface DesignTip {
  id: string;
  category: string;
  title: string;
  description?: string;
  examples: DesignTipExample[];
}

interface CodeExampleProps {
  code: string;
}

export function CodeExample({ code }: CodeExampleProps) {
  return (
    <CodeHighlighted
      className="code-block p-2 p-6 [&_pre]:text-base!"
      code={code}
      lang="tsx"
      variant="plain"
    />
  );
}

export const designTips = [
  {
    id: "content-text-size",
    category: "Typography",
    title: "Set content text at 14px",
    description:
      "Body copy, buttons, data, and every other interactive element must use 14px text. Reserve 16px and larger for headings and subheadings.",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text>Content text</Text>`,
        jsx: (
          <LayerCard className="grid w-full gap-1 p-5">
            <Text as="h3" variant="heading">
              API tokens
            </Text>
            <Text>Production token expires in 30 days.</Text>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text size="lg">Content text</Text>`,
        jsx: (
          <LayerCard className="grid w-full gap-1 p-5">
            <Text as="h3" variant="heading">
              API tokens
            </Text>
            <Text size="lg">Production token expires in 30 days.</Text>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "heading-case",
    category: "Typography",
    title: "Write headings in sentence case",
    description:
      "Do not capitalize every word or use uppercase in headings. Product names stay title-cased.",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text as="h2">Recent requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>Recent requests</LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h2">Recent Requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>
              <span className="capitalize">Recent Requests</span>
            </LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h2" DANGEROUS_className="uppercase">Recent requests</Text>`,
        jsx: (
          <LayerCard>
            <LayerCard.Secondary>
              <span className="uppercase">Recent Requests</span>
            </LayerCard.Secondary>
            <LayerCard.Primary />
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "font-tracking",
    category: "Typography",
    title: "Leave font tracking alone",
    description:
      "Avoid the `tracking-*` classes; they alter the spacing between characters.",
    examples: [
      {
        variant: "good",
        jsx: <span className="text-lg">Delivery Metrics</span>,
      },
      {
        variant: "bad",
        jsx: <span className="text-lg tracking-tight">Delivery Metrics</span>,
      },
    ],
  },
  {
    id: "font-weight",
    category: "Typography",
    title: "Avoid `font-bold`",
    description:
      "Apply `font-semibold` to headings and `font-medium` to emphasized inline text.",
    examples: [
      {
        variant: "good",
        exampleCode: `<Text as="h3" variant="heading">Account settings</Text>
<Text as="strong" bold>required</Text>`,
        jsx: (
          <div className="grid gap-1">
            <Text as="h3" variant="heading">
              Account settings
            </Text>
            <Text>
              This action is{" "}
              <Text as="strong" bold>
                required
              </Text>
              .
            </Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<Text as="h3" DANGEROUS_className="font-bold">Account settings</Text>
<Text as="strong" DANGEROUS_className="font-bold">required</Text>`,
        jsx: (
          <div className="grid gap-1">
            <Text as="h3" DANGEROUS_className="text-lg font-bold">
              Account settings
            </Text>
            <Text>
              This action is{" "}
              <Text as="strong" DANGEROUS_className="font-bold">
                required
              </Text>
              .
            </Text>
          </div>
        ),
      },
    ],
  },
  {
    id: "related-text-spacing",
    category: "Spacing & structure",
    title: "Keep related text close",
    description:
      "Text that belongs together should sit closer than the spacing between it and neighboring content.",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="grid gap-6">
  <div className="grid gap-1.5">
    <Text as="h3" variant="heading">Web Analytics</Text>
    <Text>Measure site traffic without changing your code.</Text>
  </div>
  <Button>Configure</Button>
</div>`,
        jsx: (
          <LayerCard className="w-full p-5">
            <div className="grid gap-6">
              <div className="grid gap-1.5">
                <Text as="h3" variant="heading">
                  Web Analytics
                </Text>
                <Text variant="secondary" DANGEROUS_className="text-pretty">
                  Measure site traffic without changing your code.
                </Text>
              </div>
              <Button className="justify-self-start">Configure</Button>
            </div>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="grid gap-4">
  <Text as="h3" variant="heading">Web Analytics</Text>
  <Text>Measure site traffic without changing your code.</Text>
  <Button>Configure</Button>
</div>`,
        jsx: (
          <LayerCard className="w-full p-5">
            <div className="grid gap-4">
              <Text as="h3" variant="heading">
                Web Analytics
              </Text>
              <Text variant="secondary" DANGEROUS_className="text-pretty">
                Measure site traffic without changing your code.
              </Text>
              <Button className="justify-self-start">Configure</Button>
            </div>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "text-spacing",
    category: "Spacing & structure",
    title: "Balance spacing around text optically",
    description:
      "Account for line height when spacing text. In practice, vertical padding is usually a little smaller than horizontal padding.",
    examples: [
      {
        variant: "good",
        exampleCode: `<LayerCard className="px-5 py-4">...</LayerCard>`,
        jsx: (
          <LayerCard className="px-5 py-4">
            <Text bold>Production</Text>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard className="p-5">...</LayerCard>`,
        jsx: (
          <LayerCard className="p-5">
            <Text bold>Production</Text>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "hover-color-transitions",
    category: "Motion & interaction",
    title: "Skip color transitions on hover",
    description:
      "Hover color changes should happen instantly. Transitions on quick interactions make the UI feel slow.",
    examples: [
      {
        variant: "good",
        exampleCode: `<button className="hover:bg-komachi-tint">...</button>`,
        jsx: (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-komachi-base px-4 py-2 font-medium ring ring-komachi-line hover:bg-komachi-tint"
          >
            Hover me
          </button>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<button className="transition-colors duration-300 hover:bg-komachi-tint">...</button>`,
        jsx: (
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-komachi-base px-4 py-2 font-medium ring ring-komachi-line transition-colors duration-300 hover:bg-komachi-tint"
          >
            Hover me
          </button>
        ),
      },
    ],
  },
  {
    id: "shadow-borders",
    category: "Depth & surfaces",
    title: "Do not combine borders with drop shadows",
    description:
      "Add `ring ring-komachi-line` instead, which draws a transparent border and keeps edges crisp.",
    examples: [
      {
        variant: "good",
        exampleCode: `<LayerCard className="shadow-md ring ring-komachi-line">...</LayerCard>`,
        jsx: (
          <LayerCard className="w-full shadow-md ring ring-komachi-line">
            <LayerCard.Primary className="grid gap-1 p-5">
              <Text as="h3" variant="heading">
                Notify API
              </Text>
              <Text variant="secondary">Last deployed 4 minutes ago</Text>
            </LayerCard.Primary>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard className="border border-komachi-line shadow-md">...</LayerCard>`,
        jsx: (
          <LayerCard className="w-full border border-komachi-line shadow-md ring-0">
            <LayerCard.Primary className="grid gap-1 p-5 ring-0">
              <Text as="h3" variant="heading">
                Notify API
              </Text>
              <Text variant="secondary">Last deployed 4 minutes ago</Text>
            </LayerCard.Primary>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "concentric-border-radius",
    category: "Depth & surfaces",
    title: "Nest border radii concentrically",
    description:
      "If two borders or rings are 8px or closer, their corner radii must be concentric: outer radius equals inner radius plus padding.",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="rounded-xl p-1">
  <div className="rounded-lg">...</div>
</div>`,
        jsx: (
          <div className="size-40 overflow-hidden">
            <div className="size-80 rounded-[48px] bg-komachi-elevated p-4 ring-2 ring-komachi-line ring-inset">
              <div className="size-full rounded-4xl bg-komachi-base ring-2 ring-komachi-line ring-inset" />
            </div>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="rounded-xl p-1">
  <div className="rounded-xl">...</div>
</div>`,
        jsx: (
          <div className="size-40 overflow-hidden">
            <div className="size-80 rounded-[48px] bg-komachi-elevated p-4 ring-2 ring-komachi-line ring-inset">
              <div className="size-full rounded-[48px] bg-komachi-base ring-2 ring-komachi-line ring-inset" />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: "icon-alignment",
    category: "Spacing & structure",
    title: "Line up icons with the first line of text",
    description:
      "Inline icons should look the same size as the text and be vertically centered on it. For text that wraps, use `h-lh flex items-center`.",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="flex items-start gap-2">
  <span className="h-lh flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-start gap-2">
            <span className="flex h-lh shrink-0 items-center">
              <WarningIcon aria-hidden="true" size={14} />
            </span>
            <Text>API token permissions cannot be changed after creation.</Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="flex items-start gap-2">
  <span className="flex items-center"><Icon /></span>
  <Text>Text that may wrap onto multiple lines</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-start gap-2">
            <span className="flex shrink-0 items-center">
              <WarningIcon aria-hidden="true" size={14} />
            </span>
            <Text>API token permissions cannot be changed after creation.</Text>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="flex items-center gap-2">
  <Icon />
  <Text>Text that may wrap onto multiple lines</Text>
</div>`,
        jsx: (
          <div className="flex max-w-64 items-center gap-2">
            <WarningIcon aria-hidden="true" className="shrink-0" size={14} />
            <Text>API token permissions cannot be changed after creation.</Text>
          </div>
        ),
      },
    ],
  },
  {
    id: "inline-monospace-size",
    category: "Typography",
    title: "Shrink inline monospaced text",
    description:
      "When monospaced text sits among regular text, set it slightly smaller (about 0.9em).",
    examples: [
      {
        variant: "good",
        jsx: (
          <Text size="lg">
            Edit <span className="font-mono text-[0.9em]">notify.config.json</span>{" "}
            to continue.
          </Text>
        ),
      },
      {
        variant: "bad",
        jsx: (
          <Text size="lg">
            Edit <span className="font-mono">notify.config.json</span> to continue.
          </Text>
        ),
      },
    ],
  },
  {
    id: "sticky-borders",
    category: "Spacing & structure",
    title: "Separate sticky elements from content with `border`",
    examples: [
      {
        variant: "good",
        exampleCode: `<div className="sticky top-0 border-b border-komachi-line">...</div>`,
        jsx: (
          <LayerCard className="h-56 w-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-komachi-line bg-komachi-base px-3 py-2">
              <Text bold>API tokens</Text>
              <Button size="sm">Create</Button>
            </div>
            <div className="grid gap-4 p-3">
              <Text>Production token</Text>
              <Text>Preview token</Text>
              <Text>Staging token</Text>
              <Text>Development token</Text>
              <Text>Testing token</Text>
              <Text>Production token</Text>
              <Text>Preview token</Text>
              <Text>Staging token</Text>
              <Text>Development token</Text>
              <Text>Testing token</Text>
            </div>
          </LayerCard>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<div className="sticky top-0">...</div>`,
        jsx: (
          <LayerCard className="h-56 w-full overflow-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-komachi-base px-3 py-2">
              <Text bold>API tokens</Text>
              <Button size="sm">Create</Button>
            </div>
            <div className="grid gap-4 p-3">
              <Text>Production token</Text>
              <Text>Preview token</Text>
              <Text>Staging token</Text>
              <Text>Development token</Text>
              <Text>Testing token</Text>
              <Text>Production token</Text>
              <Text>Preview token</Text>
              <Text>Staging token</Text>
              <Text>Development token</Text>
              <Text>Testing token</Text>
            </div>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "collapse-content-size",
    category: "Motion & interaction",
    title: "Keep content size fixed while collapsing",
    description:
      "Collapsible content should hold its size as it closes, so nothing shifts around during the animation.",
    examples: [
      {
        variant: "good",
        exampleCode: `<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-64">...</div>
</motion.div>`,
        jsx: <CollapseSizeExample preserveContentSize />,
      },
      {
        variant: "bad",
        exampleCode: `<motion.div animate={{ width: open ? 256 : 0 }}>
  <div className="w-full min-w-0">...</div>
</motion.div>`,
        jsx: <CollapseSizeExample />,
      },
    ],
  },
  {
    id: "layer-card-nesting",
    category: "Depth & surfaces",
    title: "Do not nest one `LayerCard` inside another",
    examples: [
      {
        variant: "good",
        exampleCode: `<div>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</div>`,
        jsx: (
          <div className="grid w-full">
            <div className="flex h-10 items-center">
              <Text as="h3" bold>
                Recent Requests
              </Text>
            </div>
            <LayerCard>
              <LayerCard.Secondary className="grid h-12 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text bold size="sm">
                  Time
                </Text>
                <Text bold size="sm">
                  Status
                </Text>
                <Text bold size="sm">
                  Query
                </Text>
              </LayerCard.Secondary>
              <LayerCard.Primary className="grid h-10 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text size="sm">00:50 UTC</Text>
                <Text size="sm" variant="error">
                  Error
                </Text>
                <Text size="sm">komachi</Text>
              </LayerCard.Primary>
            </LayerCard>
          </div>
        ),
      },
      {
        variant: "bad",
        exampleCode: `<LayerCard>
  <Text as="h3">Recent requests</Text>
  <LayerCard>...</LayerCard>
</LayerCard>`,
        jsx: (
          <LayerCard className="w-full">
            <div className="flex h-10 items-center px-3">
              <Text as="h3" bold>
                Recent Requests
              </Text>
            </div>
            <LayerCard>
              <LayerCard.Secondary className="grid h-12 grid-cols-3 gap-4 px-3 py-0">
                <Text bold>Time</Text>
                <Text bold>Status</Text>
                <Text bold>Query</Text>
              </LayerCard.Secondary>
              <LayerCard.Primary className="grid h-10 grid-cols-3 items-center gap-4 px-3 py-0">
                <Text>00:50 UTC</Text>
                <Text variant="error">Error</Text>
                <Text>komachi</Text>
              </LayerCard.Primary>
            </LayerCard>
          </LayerCard>
        ),
      },
    ],
  },
  {
    id: "dialog-rendering",
    category: "Motion & interaction",
    title: "Do not conditionally render dialogs",
    description:
      "Mounting a dialog conditionally removes its open and close animation. Control visibility with the `open` prop instead.",
    examples: [
      {
        variant: "good",
        jsx: (
          <CodeExample
            code={`<Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog>
    <Dialog.Title>Edit Endpoint</Dialog.Title>
    <Dialog.Description>Update this endpoint's settings.</Dialog.Description>
  </Dialog>
</Dialog.Root>`}
          />
        ),
      },
      {
        variant: "bad",
        jsx: (
          <CodeExample
            code={`{open && (
  <Dialog.Root open>
    <Dialog>
      <Dialog.Title>Edit Endpoint</Dialog.Title>
    </Dialog>
  </Dialog.Root>
)}`}
          />
        ),
      },
    ],
  },
] satisfies DesignTip[];
