const es = {
    traceBackTotal: {
        "query": {
            "bool": {
                "must": []
            }
        },
        "track_total_hits": true,
        "aggs": {
            "n_appname_g": {
                "terms": {
                    "field": "n_appname",
                    "size": 10,
                    "order": {
                        "_count": "desc"
                    }
                }
            },
            "n_customerseverity_g": {
                "terms": {
                    "field": "n_customerseverity",
                    "order": {
                        "_term": "asc"
                    }
                }
            },
            "n_ComponentType_g": {
                "terms": {
                    "field": "n_componenttype"
                }
            }
        },
        "size": 1
    },
    traceBackGrain: {
        "query": {
            "bool": {
                "must": []
            }
        },
        "track_total_hits": true,
        "aggs": {
            "data_group":{
                "date_histogram":{
                    "field":"firstoccurrence",
                    "format": "yyyy-MM-dd hh:mm:ss",
                    "min_doc_count" : 1,
                    "interval":"minute"
                }
            }
        },
        "size": 1
    }
}

export { es }