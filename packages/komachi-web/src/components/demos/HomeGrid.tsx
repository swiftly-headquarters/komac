import { useEffect, useState } from "react";
import {
  Autocomplete,
  Badge,
  Banner,
  Button,
  ButtonGroup,
  Checkbox,
  ClipboardText,
  Collapsible,
  Combobox,
  DatePicker,
  Dialog,
  DropdownMenu,
  Field,
  Flow,
  Grid,
  GridItem,
  HoldButton,
  Input,
  InputArea,
  Label,
  LayerCard,
  LayerDialog,
  Link,
  Loader,
  Meter,
  Pagination,
  Popover,
  Radio,
  Select,
  SensitiveInput,
  SkeletonLine,
  Switch,
  Table,
  TableOfContents,
  TagInput,
  Tabs,
  Text,
  Toolbar,
  Toasty,
  Tooltip,
  TooltipProvider,
  useKomachiToastManager,
} from "komachi";
import { ShikiProvider, CodeHighlighted } from "komachi/code";
import { CommandPaletteBasicDemo } from "~/components/demos/CommandPaletteDemo";
import { InputGroupDemo } from "~/components/demos/InputGroupDemo";
import { InlineCopyTextBasicDemo } from "~/components/demos/InlineCopyTextDemo";
import { BubbleMapBasicDemo } from "~/components/demos/Chart/BubbleMapDemo";
import { PieChartPreviewDemo, TimeseriesChartPreviewDemo } from "~/components/demos/Chart/ChartDemo";
import { ChoroplethMapBasicDemo } from "~/components/demos/Chart/ChoroplethMapDemo";
import { GlobeMapProbesDemo } from "~/components/demos/Chart/GlobeMapDemo";
import { SankeyChartPreviewDemo } from "~/components/demos/Chart/SankeyChartDemo";
import {
  CaretDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TranslateIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
} from "@phosphor-icons/react";
import type { MapGeoJson } from "komachi";

/**
 * Bento tile sizes, set from each demo's measured natural size so nothing is
 * clipped. Unlisted ids are small (1x1). "wide" is 2x1 and "big" is 2x2; on
 * phones (2 columns) a wide tile is a full row.
 */
type TileSize = "wide" | "big";

const TILE_CLASSES: Record<TileSize, string> = {
  wide: "col-span-2",
  big: "col-span-2 row-span-2",
};

const TILE_SIZES: Record<string, TileSize> = {
  input: "wide",
  "tag-input": "wide",
  select: "wide",
  toolbar: "wide",
  autocomplete: "wide",
  combobox: "wide",
  "layer-card": "wide",
  "skeleton-line": "wide",
  "code-highlighted": "wide",
  banner: "wide",
  tabs: "wide",
  pagination: "wide",
  "input-area": "wide",
  "input-group": "wide",
  meter: "wide",
  "clipboard-text": "wide",
  "sensitive-input": "wide",
  "command-palette": "wide",
  label: "wide",
  // Flow's canvas fills its tile, so its measured size is the tile's; the real
  // content (two nodes) fits a wide tile.
  flow: "wide",
  // Wide keeps the 6-column total at 96 units (16 full rows).
  text: "wide",
  table: "big",
  "date-picker": "big",
  field: "wide",
  "inline-copy-text": "wide",
  chart: "wide",
  "timeseries-chart": "big",
  "sankey-chart": "big",
  "globe-map": "big",
  "bubble-map": "big",
  "choropleth-map": "big",
};

const componentRoutes: Record<string, string> = {
  badge: "/components/badge",
  banner: "/components/banner",
  breadcrumbs: "/components/breadcrumbs",
  button: "/components/button",
  "button-group": "/components/button-group",
  checkbox: "/components/checkbox",
  "clipboard-text": "/components/clipboard-text",
  "code-highlighted": "/components/code-highlighted",
  collapsible: "/components/collapsible",
  autocomplete: "/components/autocomplete",
  combobox: "/components/combobox",
  "command-palette": "/components/command-palette",
  "date-picker": "/components/date-picker",
  dialog: "/components/dialog",
  dropdown: "/components/dropdown",
  empty: "/components/empty",
  flow: "/components/flow",
  grid: "/components/grid",
  "hold-button": "/components/hold-button",
  input: "/components/input",
  "input-area": "/components/input-area",
  "input-group": "/components/input-group",
  "tag-input": "/components/tag-input",
  label: "/components/label",
  "layer-card": "/components/layer-card",
  "layer-dialog": "/components/layer-dialog",
  link: "/components/link",
  loader: "/components/loader",
  meter: "/components/meter",
  pagination: "/components/pagination",
  popover: "/components/popover",
  radio: "/components/radio",
  select: "/components/select",
  "sensitive-input": "/components/sensitive-input",
  "skeleton-line": "/components/skeleton-line",
  switch: "/components/switch",
  table: "/components/table",
  "table-of-contents": "/components/table-of-contents",
  field: "/components/input",
  "inline-copy-text": "/components/inline-copy-text",
  chart: "/charts/timeseries",
  "timeseries-chart": "/charts/timeseries",
  "sankey-chart": "/charts/sankey",
  "globe-map": "/charts/maps",
  "bubble-map": "/charts/maps",
  "choropleth-map": "/charts/maps",
  tabs: "/components/tabs",
  text: "/components/text",
  toolbar: "/components/toolbar",
  toast: "/components/toast",
  tooltip: "/components/tooltip",
};

function ToastTriggerButton() {
  const toastManager = useKomachiToastManager();
  return (
    <Button
      onClick={() =>
        toastManager.add({
          title: `Toast created`,
          description: "This is a toast notification.",
          variant: "warning",
        })
      }
    >
      Give me a toast
    </Button>
  );
}

const WORLD_GEO_JSON_URL =
  "https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries.geo.json";

export function HomeGrid() {
  // The map tiles render nothing until the GeoJSON arrives, or at all if it can't be fetched.
  const [geoJson, setGeoJson] = useState<MapGeoJson | null>(null);
  useEffect(() => {
    fetch(WORLD_GEO_JSON_URL)
      .then((response) => response.json())
      .then(setGeoJson)
      .catch(() => {});
  }, []);
  const [switchToggled, setSwitchToggled] = useState(true);
  const [checked, setChecked] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [value, setValue] = useState<{ id: string; value: string } | null>(
    null,
  );

  const components: Array<{
    name: string;
    id: string;
    Component: React.ReactNode;
  }> = [
    {
      name: "Button",
      id: "button",
      Component: (
        <div className="grid gap-3">
          <Button icon={PlusIcon}>Create Endpoint</Button>
          <Button variant="primary" icon={PlusIcon}>
            Create Endpoint
          </Button>
          <Button loading>Create Endpoint</Button>
        </div>
      ),
    },
    {
      name: "Hold Button",
      id: "hold-button",
      Component: (
        <div className="grid gap-3">
          <HoldButton effect="fill" onHoldComplete={() => undefined}>
            Hold fill
          </HoldButton>
          <HoldButton effect="ring" onHoldComplete={() => undefined}>
            Hold ring
          </HoldButton>
          <HoldButton effect="glow" onHoldComplete={() => undefined}>
            Hold glow
          </HoldButton>
        </div>
      ),
    },
    {
      name: "Button Group",
      id: "button-group",
      Component: (
        <ButtonGroup>
          <Button variant="primary">Deploy</Button>
          <Button variant="primary" shape="square" aria-label="More options">
            <CaretDownIcon />
          </Button>
        </ButtonGroup>
      ),
    },
    {
      name: "Input",
      id: "input",
      Component: (
        <div className="grid gap-3">
          <Input placeholder="Type something..." />
          <Input variant="error" value="Invalid!" />
        </div>
      ),
    },
    {
      name: "Tag Input",
      id: "tag-input",
      Component: (
        <TagInput
          className="w-[280px] max-w-full"
          defaultValue={["frontend", "priority"]}
          placeholder="Add a label"
        />
      ),
    },
    {
      name: "Select",
      id: "select",
      Component: (
        <Select
          aria-label="Select version"
          className="w-[200px]"
          placeholder="Select version"
          renderValue={(v) => {
            const labels: Record<string, string> = {
              all: "All deployed versions",
              active: "Active versions",
              specific: "Specific versions",
            };
            if (!v) return "Select a version...";
            return labels[v as string];
          }}
        >
          <Select.Option value="all">All deployed versions</Select.Option>
          <Select.Option value="active">Active versions</Select.Option>
          <Select.Option value="specific">Specific versions</Select.Option>
        </Select>
      ),
    },
    {
      name: "Table",
      id: "table",
      Component: (
        <LayerCard className="w-full max-w-[280px] p-0">
          <Table className="text-sm">
            <Table.Header variant="compact">
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head className="text-center">Status</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Endpoint 1</Table.Cell>
                <Table.Cell className="text-center">
                  <Badge appearance="dot" variant="success">
                    Active
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Endpoint 2</Table.Cell>
                <Table.Cell className="text-center">
                  <Badge appearance="dot" variant="neutral">
                    Paused
                  </Badge>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Endpoint 3</Table.Cell>
                <Table.Cell className="text-center">
                  <Badge appearance="dot" variant="success">
                    Active
                  </Badge>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </LayerCard>
      ),
    },
    {
      name: "Toolbar",
      id: "toolbar",
      Component: (
        <Toolbar className="max-w-full">
          <Toolbar.Input
            aria-label="Search DNS records"
            placeholder="Search..."
          />
          <Toolbar.Button icon={MagnifyingGlassIcon} aria-label="Search" />
          <Toolbar.Button icon={PlusIcon} aria-label="Add" />
        </Toolbar>
      ),
    },
    {
      name: "Autocomplete",
      id: "autocomplete",
      Component: (
        <Autocomplete
          items={["Apple", "Banana", "Cherry", "Grape", "Mango", "Orange"]}
        >
          <Autocomplete.InputGroup placeholder="Search fruits…" />
          <Autocomplete.Content>
            <Autocomplete.List>
              {(item: string) => (
                <Autocomplete.Item key={item} value={item}>
                  {item}
                </Autocomplete.Item>
              )}
            </Autocomplete.List>
          </Autocomplete.Content>
        </Autocomplete>
      ),
    },
    {
      name: "Combobox",
      id: "combobox",
      Component: (
        <Combobox
          items={[
            { id: "bug", value: "bug" },
            { id: "docs", value: "documentation" },
            { id: "enhancement", value: "enhancement" },
            { id: "help-wanted", value: "help wanted" },
            { id: "good-first-issue", value: "good first issue" },
          ]}
          onValueChange={setValue}
          value={value}
        >
          <Combobox.TriggerInput placeholder="Select an issue..." />
          <Combobox.Content>
            <Combobox.List>
              {(item: { id: string; value: string }) => (
                <Combobox.Item key={item.id} value={item.value}>
                  {item.value}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      ),
    },
    {
      name: "Switch",
      id: "switch",
      Component: (
        <Switch
          checked={switchToggled}
          onClick={() => {
            setSwitchToggled(!switchToggled);
          }}
        />
      ),
    },
    {
      name: "Dialog",
      id: "dialog",
      Component: (
        <Dialog.Root>
          <Dialog.Trigger render={(p) => <Button {...p}>Delete</Button>} />
          <Dialog className="p-8">
            <div className="mb-4 flex items-start justify-between gap-4">
              <Dialog.Title className="text-2xl font-semibold">
                Delete Resource?
              </Dialog.Title>
              <Dialog.Close
                aria-label="Close"
                render={(props) => (
                  <Button
                    {...props}
                    variant="secondary"
                    shape="square"
                    icon={<XIcon />}
                    aria-label="Close"
                  />
                )}
              />
            </div>
            <Dialog.Description className="text-komachi-subtle">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Dialog.Description>
            <div className="mt-8 flex justify-end gap-2">
              <Dialog.Close
                render={(props) => (
                  <Button variant="secondary" {...props}>
                    Cancel
                  </Button>
                )}
              />
              <Dialog.Close
                render={(props) => (
                  <Button variant="destructive" {...props}>
                    Delete
                  </Button>
                )}
              />
            </div>
          </Dialog>
        </Dialog.Root>
      ),
    },
    {
      name: "Tooltip",
      id: "tooltip",
      Component: (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip
              content="Add"
              open
              render={
                <Button shape="square" icon={PlusIcon} aria-label="Add" />
              }
            />
            <Tooltip
              content="Change language"
              render={
                <Button
                  shape="square"
                  icon={TranslateIcon}
                  aria-label="Change language"
                />
              }
            />
          </div>
        </TooltipProvider>
      ),
    },
    {
      name: "Dropdown",
      id: "dropdown",
      Component: (
        <DropdownMenu>
          <DropdownMenu.Trigger render={<Button icon={PlusIcon}>Add</Button>} />
          <DropdownMenu.Content>
            <DropdownMenu.Item>Endpoint</DropdownMenu.Item>
            <DropdownMenu.Item>Template</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      ),
    },
    {
      name: "Collapsible",
      id: "collapsible",
      Component: (
        <Collapsible.Root
          open={collapsibleOpen}
          onOpenChange={setCollapsibleOpen}
        >
          <Collapsible.DefaultTrigger>
            What is Komachi?
          </Collapsible.DefaultTrigger>
          <Collapsible.DefaultPanel>
            <Text>Komachi is SwiftlyLabs' component library.</Text>
          </Collapsible.DefaultPanel>
        </Collapsible.Root>
      ),
    },
    {
      name: "Checkbox",
      id: "checkbox",
      Component: (
        <Checkbox
          label="Max bandwidth"
          checked={checked}
          onCheckedChange={(checked) => {
            setChecked(checked);
          }}
        />
      ),
    },
    {
      name: "LayerCard",
      id: "layer-card",
      Component: (
        <LayerCard className="w-[200px]">
          <LayerCard.Secondary>Next Steps</LayerCard.Secondary>
          <LayerCard.Primary>Hello</LayerCard.Primary>
        </LayerCard>
      ),
    },
    {
      name: "LayerDialog",
      id: "layer-dialog",
      Component: (
        <LayerDialog.Root>
          <LayerDialog.Trigger
            render={(props) => <Button {...props}>Open dialog</Button>}
          />
          <LayerDialog.Content size="sm">
            <LayerDialog.Title>Keyboard shortcuts</LayerDialog.Title>
            <LayerDialog.Description>
              Search components and jump to a page.
            </LayerDialog.Description>
            <LayerDialog.Body>
              <div className="flex items-center justify-between gap-4 rounded-lg bg-komachi-elevated px-3 py-2.5">
                <Text size="sm" variant="secondary">
                  Open command palette
                </Text>
                <span
                  aria-label="Command K"
                  className="flex shrink-0 items-center gap-1"
                >
                  <kbd className="min-w-6 rounded-md bg-komachi-base px-1.5 py-1 text-center text-xs font-medium text-komachi-default ring ring-komachi-line">
                    ⌘
                  </kbd>
                  <kbd className="min-w-6 rounded-md bg-komachi-base px-1.5 py-1 text-center text-xs font-medium text-komachi-default ring ring-komachi-line">
                    K
                  </kbd>
                </span>
              </div>
            </LayerDialog.Body>
          </LayerDialog.Content>
        </LayerDialog.Root>
      ),
    },
    {
      name: "Loader",
      id: "loader",
      Component: <Loader />,
    },
    {
      name: "SkeletonLine",
      id: "skeleton-line",
      Component: (
        <div className="mr-auto flex w-full max-w-[200px] flex-col gap-2">
          <SkeletonLine minWidth={50} maxWidth={100} />
          <SkeletonLine minWidth={100} />
          <SkeletonLine minWidth={50} maxWidth={75} />
        </div>
      ),
    },
    {
      name: "CodeHighlighted",
      id: "code-highlighted",
      Component: (
        <ShikiProvider engine="javascript" languages={["typescript"]}>
          <CodeHighlighted
            lang="typescript"
            code={`const sum = (a: number, b: number) => {
  return a + b;
};`}
          />
        </ShikiProvider>
      ),
    },
    {
      name: "Banner",
      id: "banner",
      Component: (
        <div className="flex flex-col gap-2">
          <Banner description="This is a default banner." />
          <Banner
            icon={<WarningIcon weight="fill" />}
            title="This is an alert banner."
            variant="alert"
          />
          <Banner
            icon={<WarningOctagonIcon weight="fill" />}
            title="This is an error banner."
            variant="error"
          />
        </div>
      ),
    },
    {
      name: "Tabs",
      id: "tabs",
      Component: (
        <Tabs
          tabs={[
            { value: "home", label: "Home" },
            { value: "about", label: "About" },
            { value: "contact", label: "Contact" },
          ]}
        />
      ),
    },
    {
      name: "Badge",
      id: "badge",
      Component: (
        <div className="flex flex-col gap-2">
          <Badge variant="blue">Blue</Badge>
          <Badge variant="green">Green</Badge>
          <Badge variant="orange">Orange</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="red">Red</Badge>
        </div>
      ),
    },
    {
      name: "Toast",
      id: "toast",
      Component: (
        <Toasty>
          <ToastTriggerButton />
        </Toasty>
      ),
    },
    {
      name: "Pagination",
      id: "pagination",
      Component: (
        <Pagination
          page={paginationPage}
          perPage={10}
          totalCount={100}
          setPage={setPaginationPage}
          className="w-auto"
        >
          <Pagination.Controls />
        </Pagination>
      ),
    },
    {
      name: "InputArea",
      id: "input-area",
      Component: <InputArea placeholder="Enter your name" />,
    },
    {
      name: "InputGroup",
      id: "input-group",
      Component: <InputGroupDemo />,
    },
    {
      name: "Meter",
      id: "meter",
      Component: (
        <Meter value={75} label="My meter" customValue="100 / 5,000" />
      ),
    },
    {
      name: "DatePicker",
      id: "date-picker",
      Component: (
        <div className="scale-85 bg-komachi-base p-4">
          <DatePicker mode="single" />
        </div>
      ),
    },
    {
      name: "Breadcrumbs",
      id: "breadcrumbs",
      Component: (
        <div className="flex items-center gap-1 text-sm">
          <span className="text-komachi-subtle">Home</span>
          <span className="text-komachi-inactive">/</span>
          <span className="text-komachi-subtle">Docs</span>
          <span className="text-komachi-inactive">/</span>
          <span className="font-medium">Page</span>
        </div>
      ),
    },
    {
      name: "ClipboardText",
      id: "clipboard-text",
      Component: <ClipboardText text="npx @swiftlylabs/komachi add button" />,
    },
    {
      name: "CommandPalette",
      id: "command-palette",
      Component: <CommandPaletteBasicDemo />,
    },
    {
      name: "Flow",
      id: "flow",
      Component: (
        <Flow>
          <Flow.Node>Step 1</Flow.Node>
          <Flow.Node>Step 2</Flow.Node>
        </Flow>
      ),
    },
    {
      name: "Link",
      id: "link",
      Component: (
        <div className="flex flex-col gap-2 text-sm">
          <Link href="#">Default link</Link>
          <Link href="#" variant="current">
            Current color link
          </Link>
          <Link href="#" variant="plain">
            Plain link
          </Link>
        </div>
      ),
    },
    {
      name: "Empty",
      id: "empty",
      Component: (
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-sm font-medium">No results</span>
          <span className="text-xs text-komachi-subtle">
            Try a different search
          </span>
        </div>
      ),
    },
    {
      name: "Grid",
      id: "grid",
      Component: (
        <Grid variant="side-by-side" gap="sm" className="w-[140px]">
          <GridItem className="rounded bg-komachi-control p-3 text-center text-xs">
            1
          </GridItem>
          <GridItem className="rounded bg-komachi-control p-3 text-center text-xs">
            2
          </GridItem>
          <GridItem className="rounded bg-komachi-control p-3 text-center text-xs">
            3
          </GridItem>
          <GridItem className="rounded bg-komachi-control p-3 text-center text-xs">
            4
          </GridItem>
        </Grid>
      ),
    },
    {
      name: "Label",
      id: "label",
      Component: (
        <div className="flex flex-col gap-2">
          <Label>Default Label</Label>
          <Label showOptional>Optional Field</Label>
          <Label tooltip="More info">With Tooltip</Label>
        </div>
      ),
    },
    {
      name: "Popover",
      id: "popover",
      Component: (
        <Popover>
          <Popover.Trigger render={<Button />}>Open Popover</Popover.Trigger>
          <Popover.Content>
            <Popover.Title>Popover Title</Popover.Title>
            <Popover.Description>This is a popover.</Popover.Description>
          </Popover.Content>
        </Popover>
      ),
    },
    {
      name: "Radio",
      id: "radio",
      Component: (
        <Radio.Group legend="Select option" defaultValue="option1">
          <Radio.Item value="option1" label="Option 1" />
          <Radio.Item value="option2" label="Option 2" />
        </Radio.Group>
      ),
    },
    {
      name: "SensitiveInput",
      id: "sensitive-input",
      Component: <SensitiveInput value="super-secret-api-key" readOnly />,
    },
    {
      name: "TableOfContents",
      id: "table-of-contents",
      Component: (
        <TableOfContents>
          <TableOfContents.Title>On this page</TableOfContents.Title>
          <TableOfContents.List>
            <TableOfContents.Item active>Introduction</TableOfContents.Item>
            <TableOfContents.Item>Installation</TableOfContents.Item>
            <TableOfContents.Item>Usage</TableOfContents.Item>
          </TableOfContents.List>
        </TableOfContents>
      ),
    },
    {
      name: "Text",
      id: "text",
      Component: (
        <div className="flex flex-col gap-1">
          <Text size="lg" bold>
            Large Bold Text
          </Text>
          <Text size="base">Regular text content</Text>
          <Text size="sm" color="subtle">
            Small subtle text
          </Text>
        </div>
      ),
    },
    {
      name: "Field",
      id: "field",
      Component: (
        <Field
          label="Email"
          description="We'll only use this for account recovery."
          className="w-full max-w-xs"
        >
          <Input placeholder="you@example.com" />
        </Field>
      ),
    },
    {
      name: "InlineCopyText",
      id: "inline-copy-text",
      Component: <InlineCopyTextBasicDemo />,
    },
    {
      name: "TimeseriesChart",
      id: "timeseries-chart",
      Component: <TimeseriesChartPreviewDemo />,
    },
    {
      name: "SankeyChart",
      id: "sankey-chart",
      Component: <SankeyChartPreviewDemo />,
    },
    { name: "GlobeMap", id: "globe-map", Component: <GlobeMapProbesDemo /> },
    {
      name: "BubbleMap",
      id: "bubble-map",
      Component: <BubbleMapBasicDemo geoJson={geoJson} />,
    },
    {
      name: "ChoroplethMap",
      id: "choropleth-map",
      Component: <ChoroplethMapBasicDemo geoJson={geoJson} />,
    },
    { name: "Chart", id: "chart", Component: <PieChartPreviewDemo /> },
  ];

  return (
    <ul
      data-vr-home-grid
      className="grid auto-rows-[13rem] grid-flow-dense grid-cols-2 gap-3 p-3 md:grid-cols-4 md:p-6 xl:grid-cols-6"
    >
      {components.map((c) => {
        const route = componentRoutes[c.id] || null;
        return (
          <li
            className={`relative flex w-full min-w-0 items-center justify-center rounded-xl bg-komachi-base ring ring-komachi-line ${TILE_CLASSES[TILE_SIZES[c.id]] ?? ""}`}
            key={c.name}
          >
            {route ? (
              <a
                href={route}
                className="absolute top-3 left-4 text-sm font-medium text-komachi-subtle hover:text-komachi-default"
              >
                {c.name}
              </a>
            ) : (
              <span className="absolute top-3 left-4 text-sm font-medium text-komachi-subtle italic">
                {c.name}
              </span>
            )}
            <div className="flex w-full min-w-0 items-center justify-center px-4 pt-11 pb-4 leading-normal tracking-normal">
              {c.Component ?? (
                <p className="text-base font-medium text-komachi-subtle">TBD</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
