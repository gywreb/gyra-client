import {
  CREATE_COLUMN_ERROR,
  CREATE_COLUMN_REQUEST,
  CREATE_COLUMN_SUCCESS,
  EDIT_COLUMN_ERROR,
  EDIT_COLUMN_REQUEST,
  EDIT_COLUMN_SUCCESS,
  GET_COLUMN_ERROR,
  GET_COLUMN_REQUEST,
  GET_COLUMN_SUCCESS,
  RESTART_COLUMN_MOVE_TASK_ERROR,
  SET_COLUMN_AFTER_CREATE_TASK,
  SET_COLUMN_AFTER_DONE_TASK,
  SET_COLUMN_AFTER_MOVE_TASK,
} from './action';

const initialState = {
  columnList: [],
  oldColumnList: [],
  postLoading: false,
  getLoading: false,
  editLoading: false,
  error: null,
};

export default function columnReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_COLUMN_REQUEST: {
      return { ...state, postLoading: true, error: null };
    }
    case CREATE_COLUMN_SUCCESS: {
      return {
        ...state,
        postLoading: false,
        columnList: [...state.columnList, action.payload.newColumn],
        error: null,
      };
    }
    case CREATE_COLUMN_ERROR: {
      return { ...state, postLoading: false, error: action.payload.error };
    }
    case GET_COLUMN_REQUEST: {
      return { ...state, getLoading: true, error: null };
    }
    case GET_COLUMN_SUCCESS: {
      return {
        ...state,
        getLoading: false,
        columnList: [...action.payload.columnList],
        error: null,
      };
    }
    case GET_COLUMN_ERROR: {
      return {
        ...state,
        getLoading: false,
        columnList: [],
        error: action.payload.error,
      };
    }
    case SET_COLUMN_AFTER_CREATE_TASK: {
      const currentColumn = state.columnList.find(
        column => column._id === action.payload.newColumn._id
      );
      const currentColumnIndex = state.columnList.findIndex(
        column => column._id === action.payload.newColumn._id
      );
      if (currentColumn && currentColumnIndex !== -1) {
        return {
          ...state,
          columnList: [
            ...state.columnList.slice(0, currentColumnIndex),
            action.payload.newColumn,
            ...state.columnList.slice(currentColumnIndex + 1),
          ],
        };
      } else return state;
    }
    case SET_COLUMN_AFTER_DONE_TASK: {
      const currentColumn = state.columnList.find(
        column => column._id === action.payload.updatedColumn._id
      );
      const currentColumnIndex = state.columnList.findIndex(
        column => column._id === action.payload.updatedColumn._id
      );
      if (currentColumn && currentColumnIndex !== -1) {
        return {
          ...state,
          columnList: [
            ...state.columnList.slice(0, currentColumnIndex),
            action.payload.updatedColumn,
            ...state.columnList.slice(currentColumnIndex + 1),
          ],
        };
      } else return state;
    }
    case SET_COLUMN_AFTER_MOVE_TASK: {
      const { fromColumnId, toColumnId, toIndex } =
        action.payload.moveTaskParams;
      const fromColumn = state.columnList.find(
        column => column._id === fromColumnId
      );
      let toColumn = state.columnList.find(column => column._id === toColumnId);
      if (fromColumn && toColumn) {
        let prevColumnList = [...state.oldColumnList];
        if (fromColumnId === toColumnId) {
          toColumn = { ...fromColumn };
        }
        const fromIndex = fromColumn.tasks.indexOf(action.payload.taskId);
        if (fromIndex === -1) return state;

        fromColumn.tasks.splice(fromIndex, 1);
        if (!toColumn.tasks.includes(action.payload.taskId)) {
          if (toIndex === 0 || toIndex) {
            toColumn.tasks.splice(toIndex, 0, action.payload.taskId);
          } else {
            toColumn.tasks.push(action.payload.taskId);
          }
        }

        const newColumnList = state.columnList.map(column => {
          if (column._id === fromColumnId) {
            return { ...fromColumn };
          } else if (column._id === toColumnId) {
            return { ...toColumn };
          } else return column;
        });
        return {
          ...state,
          columnList: newColumnList,
          oldColumnList: [...prevColumnList],
        };
      } else return state;
    }
    case RESTART_COLUMN_MOVE_TASK_ERROR: {
      return {
        ...state,
        columnList: [...state.oldColumnList],
        oldColumnList: [],
      };
    }
    case EDIT_COLUMN_REQUEST: {
      return { ...state, editLoading: true };
    }
    case EDIT_COLUMN_SUCCESS: {
      const { updatedColumn, columnId } = action.payload;
      const oldColumnIndex = state.columnList.findIndex(
        column => column._id === columnId
      );
      return {
        ...state,
        editLoading: false,
        columnList: [
          ...state.columnList.slice(0, oldColumnIndex),
          { ...updatedColumn },
          ...state.columnList.slice(oldColumnIndex + 1),
        ],
      };
    }
    case EDIT_COLUMN_ERROR: {
      return { ...state, error: action.payload.error, editLoading: false };
    }
    default:
      return state;
  }
}
