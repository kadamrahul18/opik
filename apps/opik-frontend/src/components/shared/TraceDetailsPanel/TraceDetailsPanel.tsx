import React, { useCallback, useMemo, useRef, useState } from "react";
import { keepPreviousData } from "@tanstack/react-query";
import find from "lodash/find";
import { BooleanParam, useQueryParam } from "use-query-params";

import { Database, Trash } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import useTraceById from "@/api/traces/useTraceById";
import Loader from "@/components/shared/Loader/Loader";
import TraceDataViewer from "./TraceDataViewer/TraceDataViewer";
import TraceTreeViewer from "./TraceTreeViewer/TraceTreeViewer";
import TraceAnnotateViewer from "./TraceAnnotateViewer/TraceAnnotateViewer";
import NoData from "@/components/shared/NoData/NoData";
import { Span } from "@/types/traces";
import useSpansList from "@/api/traces/useSpansList";
import ResizableSidePanel from "@/components/shared/ResizableSidePanel/ResizableSidePanel";
import useTraceDeleteMutation from "@/api/traces/useTraceDeleteMutation";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/ConfirmDialog/ConfirmDialog";
import AddToDatasetDialog from "@/components/pages/TracesPage/AddToDataset/AddToDatasetDialog";
import ShareURLButton from "@/components/shared/ShareURLButton/ShareURLButton";

type OpenPopupType = "delete" | "addDataset";

type TraceDetailsPanelProps = {
  projectId?: string;
  traceId: string;
  spanId: string;
  setSpanId: (id: string) => void;
  hasPreviousRow?: boolean;
  hasNextRow?: boolean;
  onClose: () => void;
  onRowChange?: (shift: number) => void;
};

const TraceDetailsPanel: React.FunctionComponent<TraceDetailsPanelProps> = ({
  projectId,
  traceId,
  spanId,
  setSpanId,
  hasPreviousRow,
  hasNextRow,
  onClose,
  onRowChange,
}) => {
  const resetKeyRef = useRef(0);
  const [open, setOpen] = useState<boolean | OpenPopupType>(false);
  const [annotateOpen = false, setAnnotateOpen] = useQueryParam(
    "annotation",
    BooleanParam,
    {
      updateType: "replaceIn",
    },
  );

  const { data: trace, isPending: isTracePending } = useTraceById(
    {
      traceId,
    },
    {
      placeholderData: keepPreviousData,
      enabled: Boolean(traceId),
    },
  );

  const calculatedProjectId = projectId || trace?.project_id;

  const { data: spansData, isPending: isSpansPending } = useSpansList(
    {
      traceId,
      projectId: calculatedProjectId as string,
      page: 1,
      size: 1000,
    },
    {
      placeholderData: keepPreviousData,
      enabled: Boolean(traceId) && Boolean(calculatedProjectId),
    },
  );

  const traceDeleteMutation = useTraceDeleteMutation();

  const rows = useMemo(() => (trace ? [trace] : []), [trace]);

  const handleTraceDelete = useCallback(() => {
    onClose();
    traceDeleteMutation.mutate({
      traceId,
      projectId: calculatedProjectId as string,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceId, projectId, onClose]);

  const handleRowSelect = useCallback(
    (id: string) => setSpanId(id === traceId ? "" : id),
    [setSpanId, traceId],
  );

  const dataToView = useMemo(() => {
    return spanId
      ? find(spansData?.content || [], (span: Span) => span.id === spanId)
      : trace;
  }, [spanId, spansData?.content, trace]);

  const renderContent = () => {
    if (isTracePending || isSpansPending) {
      return <Loader />;
    }

    if (!dataToView || !trace) {
      return <NoData />;
    }

    return (
      <div className="relative size-full">
        <ResizablePanelGroup direction="horizontal" autoSaveId="trace-sidebar">
          <ResizablePanel id="tree-viewer" defaultSize={40} minSize={20}>
            <TraceTreeViewer
              trace={trace}
              spans={spansData?.content}
              rowId={spanId || traceId}
              onSelectRow={handleRowSelect}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="data-viever" defaultSize={60} minSize={30}>
            <TraceDataViewer
              data={dataToView}
              projectId={projectId as string}
              spanId={spanId}
              traceId={traceId}
              annotateOpen={annotateOpen as boolean}
              setAnnotateOpen={setAnnotateOpen}
            />
          </ResizablePanel>
          {annotateOpen && (
            <>
              <ResizableHandle />
              <ResizablePanel
                id="annotate-viewer"
                defaultSize={40}
                minSize={30}
              >
                <TraceAnnotateViewer
                  data={dataToView}
                  spanId={spanId}
                  traceId={traceId}
                  annotateOpen={annotateOpen as boolean}
                  setAnnotateOpen={setAnnotateOpen}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    );
  };

  const renderHeaderContent = () => {
    return (
      <div className="flex gap-2">
        <ConfirmDialog
          open={open === "delete"}
          setOpen={setOpen}
          onConfirm={handleTraceDelete}
          title="Delete trace"
          description="Are you sure you want to delete this trace?"
          confirmText="Delete trace"
        />
        <AddToDatasetDialog
          key={resetKeyRef.current}
          rows={rows}
          open={open === "addDataset"}
          setOpen={setOpen}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setOpen("addDataset");
            resetKeyRef.current = resetKeyRef.current + 1;
          }}
        >
          <Database className="mr-2 size-4" />
          Add to dataset
        </Button>
        <ShareURLButton />
        <Button variant="outline" size="sm" onClick={() => setOpen("delete")}>
          <Trash className="mr-2 size-4" />
          Delete
        </Button>
      </div>
    );
  };

  return (
    <ResizableSidePanel
      panelId="traces"
      entity="trace"
      open={Boolean(traceId)}
      headerContent={renderHeaderContent()}
      hasPreviousRow={hasPreviousRow}
      hasNextRow={hasNextRow}
      onClose={onClose}
      onRowChange={onRowChange}
    >
      {renderContent()}
    </ResizableSidePanel>
  );
};

export default TraceDetailsPanel;
