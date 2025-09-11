

export default {
	namespace: 'toolLink',

	state: {
        treeDatas: [],
        selectTreeNode: [],
        selectKeys: [],
    },

  	subscriptions: {
        setup ({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/toolLink' || location.pathname.includes('/toolLink/')) {
                dispatch({
                    type: 'query',
                    payload: location.query,
                })
                }
            })
        },
  	},

  	effects: {
        * query ({ payload }, { call, put }) {

        },
    },

  	reducers: {
        querySuccess (state, action) {
			const { treeDatas } = action.payload
			return { //修改
				...state,
				treeDatas,
			}
	    },
    },

}
