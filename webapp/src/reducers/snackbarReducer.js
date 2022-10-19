const initialState = {
  open: false,
  message: "",
};

export function actions(dispatch) {
  return {
    openSnackbar: (message) => {
      dispatch({
        type: "snackbar/openSnackbar",
        payload: { open: true, message },
      });
    },
    closeSnackbar: () => {
      dispatch({
        type: "snackbar/closeSnackbar",
        payload: { open: false, message: "" },
      });
    },
  };
}

export default function snackbarReducer(state = initialState, action) {
  switch (action.type) {
    case "snackbar/openSnackbar": {
      return {
        ...state,
        ...action.payload,
      };
    }
    case "snackbar/closeSnackbar": {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
