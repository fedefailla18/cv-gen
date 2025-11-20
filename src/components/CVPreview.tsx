import React from 'react';
import { Droppable, Draggable, DragDropContext, DropResult } from "@hello-pangea/dnd";
import ModernTheme from "../themes/ModernTheme";
import MinimalTheme from "../themes/MinimalTheme";
import CompactTheme from "../themes/CompactTheme";
import TwoColumnTheme from "../themes/TwoColumnTheme";
import { Resume } from '../types';
import { reorderSections } from '../utils/reorder';

const THEMES = {
  modern: ModernTheme,
  minimal: MinimalTheme,
  compact: CompactTheme,
  twocolumn: TwoColumnTheme
};

interface CVPreviewProps {
  resume: Resume;
  sections: string[];
  theme: keyof typeof THEMES;
  setSections: (sections: string[]) => void;
}

export default function CVPreview({ resume, sections, theme, setSections }: CVPreviewProps) {
  const ThemeComponent = THEMES[theme];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newSections = reorderSections(
      sections,
      result.source.index,
      result.destination.index
    );

    setSections(newSections);
  };

  // Special handling for two-column theme
  if (theme === 'twocolumn') {
    const leftColumnSections = ['skills', 'languages'];
    const rightColumnSections = ['work', 'education'];
    
    const getSectionColumn = (sec: string) => {
      if (sec === 'basics') return 'full';
      if (leftColumnSections.includes(sec)) return 'left';
      if (rightColumnSections.includes(sec)) return 'right';
      return 'right'; // default to right
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sections">
          {(provided: any) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
              {/* Basics at top - full width */}
              {sections.filter(sec => getSectionColumn(sec) === 'full').map((sec, i) => {
                const originalIndex = sections.indexOf(sec);
                return (
                  <Draggable key={sec} draggableId={sec} index={originalIndex}>
                    {(draggable: any, snapshot: any) => (
                      <div
                        ref={draggable.innerRef}
                        {...draggable.draggableProps}
                        {...draggable.dragHandleProps}
                        className={`${
                          snapshot.isDragging 
                            ? 'opacity-50 shadow-lg' 
                            : 'hover:bg-gray-50 transition-colors'
                        } rounded-lg p-2 cursor-move`}
                      >
                        <ThemeComponent resume={resume} section={sec} />
                      </div>
                    )}
                  </Draggable>
                );
              })}

              {/* Two-column layout */}
              <div className="grid grid-cols-4 gap-6">
                {/* Left column - Skills and Languages (25%) */}
                <div className="col-span-1 space-y-4">
                  {sections.filter(sec => getSectionColumn(sec) === 'left').map((sec, i) => {
                    const originalIndex = sections.indexOf(sec);
                    return (
                      <Draggable key={sec} draggableId={sec} index={originalIndex}>
                        {(draggable: any, snapshot: any) => (
                          <div
                            ref={draggable.innerRef}
                            {...draggable.draggableProps}
                            {...draggable.dragHandleProps}
                            className={`${
                              snapshot.isDragging 
                                ? 'opacity-50 shadow-lg' 
                                : 'hover:bg-gray-50 transition-colors'
                            } rounded-lg p-2 cursor-move`}
                          >
                            <ThemeComponent resume={resume} section={sec} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>

                {/* Right column - Work and Education (75%) */}
                <div className="col-span-3 space-y-4">
                  {sections.filter(sec => getSectionColumn(sec) === 'right').map((sec, i) => {
                    const originalIndex = sections.indexOf(sec);
                    return (
                      <Draggable key={sec} draggableId={sec} index={originalIndex}>
                        {(draggable: any, snapshot: any) => (
                          <div
                            ref={draggable.innerRef}
                            {...draggable.draggableProps}
                            {...draggable.dragHandleProps}
                            className={`${
                              snapshot.isDragging 
                                ? 'opacity-50 shadow-lg' 
                                : 'hover:bg-gray-50 transition-colors'
                            } rounded-lg p-2 cursor-move`}
                          >
                            <ThemeComponent resume={resume} section={sec} />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  // Default layout for other themes
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="sections">
        {(provided: any) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sections.map((sec, i) => (
              <Draggable key={sec} draggableId={sec} index={i}>
                {(draggable: any, snapshot: any) => (
                  <div
                    ref={draggable.innerRef}
                    {...draggable.draggableProps}
                    {...draggable.dragHandleProps}
                    className={`${
                      snapshot.isDragging 
                        ? 'opacity-50 shadow-lg' 
                        : 'hover:bg-gray-50 transition-colors'
                    } rounded-lg p-2 cursor-move`}
                  >
                    <ThemeComponent resume={resume} section={sec} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}