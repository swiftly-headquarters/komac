import { type FC, useState, useMemo } from "react";
import { komachiRegistryJson } from "virtual:komachi-registry";

// Types for the registry
interface PropInfo {
  type: string;
  optional?: boolean;
  required?: boolean;
  values?: string[];
  descriptions?: Record<string, string>;
  default?: string;
  description?: string;
}

interface SubComponent {
  description?: string;
  props?: Record<string, PropInfo>;
  renderElement?: string;
}

interface ComponentInfo {
  name: string;
  description: string;
  importPath: string;
  category: string;
  props: Record<string, PropInfo>;
  examples: string[];
  colors: string[];
  subComponents?: Record<string, SubComponent>;
}

interface ComponentRegistry {
  version: string;
  components: Record<string, ComponentInfo>;
  search: {
    byName: string[];
    byCategory: Record<string, string[]>;
  };
}

const registry = komachiRegistryJson as unknown as ComponentRegistry;

/** Descriptions come from JSDoc, so render the inline markdown they use: `code` and [links](url). */
const Description: FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/).map((part, i) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return (
          <a
            key={i}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-komachi-default"
          >
            {link[1]}
          </a>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return <code key={i}>{part.slice(1, -1)}</code>;
      }
      return part;
    })}
  </>
);

const ComponentCard: FC<{
  component: ComponentInfo;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ component, isExpanded, onToggle }) => {
  // Get variant props (props with values array)
  const variantProps = Object.entries(component.props).filter(
    ([, prop]) => prop.values && prop.values.length > 0,
  );

  return (
    <div className="rounded-lg border border-komachi-hairline bg-komachi-base">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-komachi-overlay"
      >
        <div>
          <h3 className="font-semibold text-komachi-default">{component.name}</h3>
          <p className="mt-1 text-sm text-komachi-subtle">
            <Description text={component.description} />
          </p>
        </div>
        <span className="ml-4 text-komachi-subtle">{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <div className="border-t border-komachi-hairline p-4">
          {/* Import */}
          <div className="mb-4">
            <h4 className="mb-2 text-xs font-medium text-komachi-subtle uppercase">
              Import
            </h4>
            <code className="block rounded bg-komachi-overlay p-2 text-xs">
              import {"{"} {component.name} {"}"} from "{component.importPath}";
            </code>
          </div>

          {/* Variants */}
          {variantProps.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-xs font-medium text-komachi-subtle uppercase">
                Variants
              </h4>
              <div className="space-y-2">
                {variantProps.map(([propName, prop]) => (
                  <div key={propName}>
                    <span className="font-mono text-sm text-komachi-default">
                      {propName}
                    </span>
                    {prop.default && (
                      <span className="ml-2 text-xs text-komachi-subtle">
                        (default: {prop.default})
                      </span>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {prop.values?.map((value) => (
                        <span
                          key={value}
                          className="rounded bg-komachi-overlay px-2 py-0.5 text-xs text-komachi-default"
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-components */}
          {component.subComponents &&
            Object.keys(component.subComponents).length > 0 && (
              <div className="mb-4">
                <h4 className="mb-2 text-xs font-medium text-komachi-subtle uppercase">
                  Sub-components
                </h4>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(component.subComponents).map((subName) => (
                    <span
                      key={subName}
                      className="rounded bg-komachi-overlay px-2 py-0.5 text-xs text-komachi-default"
                    >
                      {component.name}.{subName}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Colors */}
          {component.colors && component.colors.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-medium text-komachi-subtle uppercase">
                Semantic Tokens
              </h4>
              <div className="flex flex-wrap gap-1">
                {component.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded bg-komachi-overlay px-2 py-0.5 text-xs text-komachi-default"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const ComponentRegistryView: FC = () => {
  const [expandedComponent, setExpandedComponent] = useState<string | null>(
    null,
  );

  // Alphabetical, with the catch-all "Other" category last.
  const groups = useMemo(
    () =>
      Object.entries(registry.search.byCategory)
        .sort(([a], [b]) =>
          a === "Other" ? 1 : b === "Other" ? -1 : a.localeCompare(b),
        )
        .map(([category, names]) => ({
          category,
          components: names
            .map((name) => registry.components[name])
            .filter(Boolean)
            .sort((a, b) => a.name.localeCompare(b.name)),
        })),
    [],
  );

  const toggleComponent = (name: string) => {
    setExpandedComponent((current) => (current === name ? null : name));
  };

  return (
    <div className="not-prose flex flex-col gap-10">
      <p className="text-sm text-komachi-subtle">
        {groups.reduce((sum, g) => sum + g.components.length, 0)} components in {groups.length}{" "}
        categories, registry v{registry.version}.
      </p>

      {groups.map(({ category, components }) => (
        <section key={category} className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-komachi-strong">
            {category}{" "}
            <span className="font-normal text-komachi-subtle">
              {components.length}
            </span>
          </h3>
          <div className="space-y-2">
            {components.map((component) => (
              <ComponentCard
                key={component.name}
                component={component}
                isExpanded={expandedComponent === component.name}
                onToggle={() => toggleComponent(component.name)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
