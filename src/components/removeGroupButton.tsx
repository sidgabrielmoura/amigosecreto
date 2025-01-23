"use client";

import { RemoveGroup } from "@/app/app/grupos/[id]/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function RemoveGroupButton({ groupId }: { groupId: any }) {
    const handleRemoveGroup = async () => {
        const confirmed = confirm("Tem certeza que deseja remover este grupo?");
        if (!confirmed) return;

        const response = await RemoveGroup(groupId);

        if (response.success) {
            alert(response.message);
            window.location.href = response.redirectTo || "/";
        } else {
            alert(response.message);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRemoveGroup}
        >
            <Trash2 className="size-4" />
        </Button>
    );
}
