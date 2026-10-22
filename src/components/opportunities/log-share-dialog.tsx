"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoStore } from "@/lib/store";
import { getDocumentsForOpportunity } from "@/lib/selectors";
import type { ShareChannel } from "@/lib/types";

const CHANNELS: ShareChannel[] = [
  "WhatsApp",
  "Email",
  "In Person",
  "Manually logged",
  "Other",
];

interface LogShareDialogProps {
  opportunityId: string;
  triggerClassName?: string;
}

export function LogShareDialog({
  opportunityId,
  triggerClassName,
}: LogShareDialogProps) {
  const { state, logShare } = useDemoStore();
  const documents = useMemo(
    () => getDocumentsForOpportunity(state, opportunityId),
    [state, opportunityId],
  );

  const [open, setOpen] = useState(false);
  const [documentId, setDocumentId] = useState(documents?.[0]?.id ?? "");
  const [version, setVersion] = useState(documents?.[0]?.version ?? "v1");
  const [channel, setChannel] = useState<ShareChannel>("WhatsApp");
  const [loggedBy, setLoggedBy] = useState("Adviser");

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      const first = documents?.[0];
      setDocumentId(first?.id ?? "");
      setVersion(first?.version ?? "v1");
      setChannel("WhatsApp");
      setLoggedBy("Adviser");
    }
  };

  const handleDocumentChange = (id: string) => {
    setDocumentId(id);
    const doc = documents?.find((d) => d?.id === id);
    if (doc?.version) setVersion(doc.version);
  };

  const handleConfirm = () => {
    if (!documentId) {
      toast.error("Select a document");
      return;
    }
    logShare({
      opportunityId,
      documentId,
      version: version || "v1",
      channel,
      loggedBy: loggedBy || "Adviser",
    });
    toast.success("Sharing recorded in demo");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName} variant="outline">
          Log as Shared
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manually log sharing event</DialogTitle>
          <DialogDescription>
            Records that a document was shared with the investor for this
            opportunity only. This is a staff log — it does not send WhatsApp,
            email, or any real message.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Document</Label>
            <Select value={documentId} onValueChange={handleDocumentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select document" />
              </SelectTrigger>
              <SelectContent>
                {documents?.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="share-version">Document version</Label>
            <Input
              id="share-version"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v1"
            />
          </div>

          <div className="grid gap-2">
            <Label>Channel</Label>
            <Select
              value={channel}
              onValueChange={(v) => setChannel(v as ShareChannel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="logged-by">Logged by</Label>
            <Input
              id="logged-by"
              value={loggedBy}
              onChange={(e) => setLoggedBy(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
