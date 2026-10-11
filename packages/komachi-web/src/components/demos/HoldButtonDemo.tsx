import { useState } from "react";
import { HoldButton } from "komachi";
import { RocketLaunchIcon, TrashIcon } from "@phosphor-icons/react";

/** Demonstrates all progress effects with completion feedback. */
export function HoldButtonEffectsDemo() {
  const [completedEffect, setCompletedEffect] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <HoldButton
          effect="fill"
          onHoldComplete={() => setCompletedEffect("Fill completed")}
        >
          Hold fill
        </HoldButton>
        <HoldButton
          effect="ring"
          onHoldComplete={() => setCompletedEffect("Ring completed")}
        >
          Hold ring
        </HoldButton>
        <HoldButton
          effect="glow"
          onHoldComplete={() => setCompletedEffect("Glow completed")}
        >
          Hold glow
        </HoldButton>
      </div>
      <p aria-live="polite" className="text-sm text-komachi-subtle">
        {completedEffect ?? "Press and hold any button to complete its action."}
      </p>
    </div>
  );
}

/** Demonstrates custom hold durations. */
export function HoldButtonDurationsDemo() {
  const [message, setMessage] = useState("Choose a hold duration.");

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <HoldButton
          effect="fill"
          holdDuration={600}
          onHoldComplete={() => setMessage("Quick hold completed")}
        >
          600 ms
        </HoldButton>
        <HoldButton
          effect="ring"
          holdDuration={1200}
          onHoldComplete={() => setMessage("Standard hold completed")}
        >
          1,200 ms
        </HoldButton>
        <HoldButton
          effect="glow"
          holdDuration={2000}
          onHoldComplete={() => setMessage("Careful hold completed")}
        >
          2,000 ms
        </HoldButton>
      </div>
      <p aria-live="polite" className="text-sm text-komachi-subtle">
        {message}
      </p>
    </div>
  );
}

/** Demonstrates primary and destructive hold actions with icons. */
export function HoldButtonVariantsDemo() {
  const [message, setMessage] = useState("No action completed.");

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <HoldButton
          effect="ring"
          icon={RocketLaunchIcon}
          variant="primary"
          onHoldComplete={() => setMessage("Deployment started")}
        >
          Hold to deploy
        </HoldButton>
        <HoldButton
          effect="glow"
          icon={TrashIcon}
          variant="destructive"
          onHoldComplete={() => setMessage("Resource deleted")}
        >
          Hold to delete
        </HoldButton>
      </div>
      <p aria-live="polite" className="text-sm text-komachi-subtle">
        {message}
      </p>
    </div>
  );
}

/** Demonstrates cancellation feedback when a hold ends early. */
export function HoldButtonCancelDemo() {
  const [message, setMessage] = useState("Start holding, then release early.");

  return (
    <div className="flex flex-col items-start gap-4">
      <HoldButton
        effect="fill"
        onHoldCancel={() => setMessage("Hold cancelled")}
        onHoldComplete={() => setMessage("Hold completed")}
      >
        Hold to confirm
      </HoldButton>
      <p aria-live="polite" className="text-sm text-komachi-subtle">
        {message}
      </p>
    </div>
  );
}
