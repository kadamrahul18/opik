import React from "react";
import ReactMarkdown from "react-markdown";

import { getAlphabetLetter } from "@/lib/utils";
import PlaygroundOutputLoader from "@/components/pages/PlaygroundPage/PlaygroundOutputs/PlaygroundOutputLoader/PlaygroundOutputLoader";
import {
  useOutputLoadingByPromptDatasetItemId,
  useOutputValueByPromptDatasetItemId,
} from "@/store/PlaygroundStore";

interface PlaygroundOutputProps {
  promptId: string;
  index: number;
}

const PlaygroundOutput = ({ promptId, index }: PlaygroundOutputProps) => {
  const value = useOutputValueByPromptDatasetItemId(promptId);
  const isLoading = useOutputLoadingByPromptDatasetItemId(promptId);

  const renderContent = () => {
    if (isLoading && !value) {
      return <PlaygroundOutputLoader />;
    }

    return <ReactMarkdown>{value}</ReactMarkdown>;
  };

  return (
    <div className="size-full min-w-[var(--min-prompt-width)]">
      <p className="comet-body-s-accented my-3">
        Output {getAlphabetLetter(index)}
      </p>
      <div className="comet-body-s min-h-28 rounded-lg border bg-white p-3">
        {renderContent()}
      </div>
    </div>
  );
};

export default PlaygroundOutput;
