const defState = {
    text: '',
    open: false,
    openTime: 3000 //in miliseconds
}

const notificationReducer = (state = defState, {type, payload} = {}) => {
    switch(type) {
        case 'OPEN' :
            return  {...state, open: true, text: payload};
        case 'CLOSE' :
            return {...state, open: false, text: ''};
        default:
            return state;
    }
}

export default notificationReducer;
