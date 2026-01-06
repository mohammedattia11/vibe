"use client" ;

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable" ;
import { MessagesContainer } from "./components/messages-container" ;
import { Suspense } from "react" ;

interface Props {
    projectId : string ;
};

export const ProjectView = ({ projectId }: Props) => {

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel 
                defaultSize={45}
                minSize={20}
                className="flex flex-col min-h-0"
                >   
                    <Suspense fallback={<p>Loading messages...</p>}>
                    <MessagesContainer projectId={projectId} />
                    </Suspense>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel 
                defaultSize={55}
                minSize={50}
                >
                    Preview Panel
                </ResizablePanel>
            </ResizablePanelGroup>  
        </div>
    );
}    