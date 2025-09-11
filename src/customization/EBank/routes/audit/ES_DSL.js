export const query_es = {
    track_total_hits: true,
    query: {
        bool: {
            must: []
        }
    },
    sort:[
        {
            oprationTime:{
                order:'desc'
            }
        }
    ],
    size:20,
    from:0
}

export const queryTree_es = {
    track_total_hits: true,
    aggs: {
        user_g: {
            terms: {
                field: "user"
            }
        },
        typ_g: {
            terms: {
                field: "typ"
            }
        },
        action_g: {
            terms: {
                field: "action"
            }
        },
        uuid_g: {
            terms: {
                field: "uuid"
            }
        },
        responseCode_g: {
            terms: {
                field: "responseCode"
            }
        }
    },
    size: 1
}

export const queryUUID_es = {
    query: {
        bool: {
            must: []
        }
    },
    sort: {
        oprationTime: {
            order: "desc"
        }
    }
}