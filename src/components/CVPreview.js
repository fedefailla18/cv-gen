import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { THEMES } from '../themes';
import { reorderSections } from '../utils/reorder';
import { useResumeContext } from '../context/ResumeContext';
export const CVPreview = () => {
    const { resume, sections, theme, setSections } = useResumeContext();
    const ThemeComponent = THEMES[theme];
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const newSections = reorderSections(sections, result.source.index, result.destination.index);
        setSections(newSections);
    };
    // Special handling for two-column theme
    if (theme === 'twocolumn') {
        const leftColumnSections = ['skills', 'languages'];
        const rightColumnSections = ['work', 'education'];
        const getSectionColumn = (sec) => {
            if (sec === 'basics')
                return 'full';
            if (leftColumnSections.includes(sec))
                return 'left';
            if (rightColumnSections.includes(sec))
                return 'right';
            return 'right'; // default to right
        };
        return (_jsx(DragDropContext, { onDragEnd: onDragEnd, children: _jsx(Droppable, { droppableId: "sections", children: (provided) => (_jsxs("div", { ref: provided.innerRef, ...provided.droppableProps, className: "space-y-6", children: [sections
                            .filter((sec) => getSectionColumn(sec) === 'full')
                            .map((sec, i) => {
                            const originalIndex = sections.indexOf(sec);
                            return (_jsx(Draggable, { draggableId: sec, index: originalIndex, children: (draggable, snapshot) => (_jsx("div", { ref: draggable.innerRef, ...draggable.draggableProps, ...draggable.dragHandleProps, className: `${snapshot.isDragging
                                        ? 'opacity-50 shadow-lg'
                                        : 'hover:bg-gray-50 transition-colors'} rounded-lg p-2 cursor-move`, children: _jsx(ThemeComponent, { resume: resume, section: sec }) })) }, sec));
                        }), _jsxs("div", { className: "grid grid-cols-4 gap-6", children: [_jsx("div", { className: "col-span-1 space-y-4", children: sections
                                        .filter((sec) => getSectionColumn(sec) === 'left')
                                        .map((sec, i) => {
                                        const originalIndex = sections.indexOf(sec);
                                        return (_jsx(Draggable, { draggableId: sec, index: originalIndex, children: (draggable, snapshot) => (_jsx("div", { ref: draggable.innerRef, ...draggable.draggableProps, ...draggable.dragHandleProps, className: `${snapshot.isDragging
                                                    ? 'opacity-50 shadow-lg'
                                                    : 'hover:bg-gray-50 transition-colors'} rounded-lg p-2 cursor-move`, children: _jsx(ThemeComponent, { resume: resume, section: sec }) })) }, sec));
                                    }) }), _jsx("div", { className: "col-span-3 space-y-4", children: sections
                                        .filter((sec) => getSectionColumn(sec) === 'right')
                                        .map((sec, i) => {
                                        const originalIndex = sections.indexOf(sec);
                                        return (_jsx(Draggable, { draggableId: sec, index: originalIndex, children: (draggable, snapshot) => (_jsx("div", { ref: draggable.innerRef, ...draggable.draggableProps, ...draggable.dragHandleProps, className: `${snapshot.isDragging
                                                    ? 'opacity-50 shadow-lg'
                                                    : 'hover:bg-gray-50 transition-colors'} rounded-lg p-2 cursor-move`, children: _jsx(ThemeComponent, { resume: resume, section: sec }) })) }, sec));
                                    }) })] }), provided.placeholder] })) }) }));
    }
    return (_jsx(DragDropContext, { onDragEnd: onDragEnd, children: _jsx(Droppable, { droppableId: "sections", children: (provided) => (_jsxs("div", { ref: provided.innerRef, ...provided.droppableProps, children: [sections.map((sec, i) => (_jsx(Draggable, { draggableId: sec, index: i, children: (draggable, snapshot) => (_jsx("div", { ref: draggable.innerRef, ...draggable.draggableProps, ...draggable.dragHandleProps, className: `${snapshot.isDragging
                                ? 'opacity-50 shadow-lg'
                                : 'hover:bg-gray-50 transition-colors'} rounded-lg p-2 cursor-move print:cursor-default print:p-0`, children: _jsx(ThemeComponent, { resume: resume, section: sec }) })) }, sec))), provided.placeholder] })) }) }));
};
export default { CVPreview, THEMES };
