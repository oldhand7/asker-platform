import { Droppable } from 'react-drag-and-drop'

const NewStageDroppable = ({ children, onStage }) => {
    return <Droppable types={['feature']} onDrop={({feature}) => onStage(JSON.parse(feature))}>
    {children}
    </Droppable>
}

export default NewStageDroppable;
