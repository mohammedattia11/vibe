"use client" ;

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable" ;
import { MessagesContainer } from "./components/messages-container" ;
import { Suspense, useState } from "react" ;
import { Fragment } from "@/app/generated/prisma" ;
import { ProjectHeader } from "./components/project-header" ;

interface Props {
    projectId : string ;
};

export const ProjectView = ({ projectId }: Props) => {

    const [activeFragment , setActiveFragment] = useState<Fragment | null>(null) ;

    return (
        <div className="h-screen">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel 
                defaultSize={45}
                minSize={20}
                className="flex flex-col min-h-0"
                >   <Suspense fallback={<p>Loading project...</p>}>
                        <ProjectHeader projectId={projectId} />
                    </Suspense>
                    <Suspense fallback={<p>Loading Project...</p>}>
                    <MessagesContainer projectId={projectId} 
                    activeFragment={activeFragment}
                    setActiveFragment={setActiveFragment}
                    />
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