import { cn } from "cn";

export function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, "");
}

function renderInline(text: string, keyPrefix: string) {
  const parts = stripHtml(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${index}`}>{part}</span>;
  });
}

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = content.trim().split(/\n{2,}/);

  return (
    <div className={cn("space-y-4 text-muted-foreground", className)}>
      {blocks.map((block, index) => {
        const line = block.trim();
        if (line.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="text-lg font-semibold text-foreground"
            >
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="text-xl font-semibold text-foreground"
            >
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="text-3xl font-semibold tracking-tight text-foreground"
            >
              {line.slice(2)}
            </h1>
          );
        }
        if (line.startsWith("- ")) {
          const items = line.split("\n").filter((item) => item.startsWith("- "));
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item.slice(2), `${index}-${itemIndex}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{renderInline(line.replace(/\n/g, " "), `${index}`)}</p>;
      })}
    </div>
  );
}
