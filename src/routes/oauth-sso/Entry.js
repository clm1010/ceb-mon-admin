
import React from "react";
import { connect } from "dva";


class Entry extends React.Component {
    constructor(props) {
        super();
    }
    componentWillMount(props) {
    }
    render() {
        const { entryUrl } = this.props.entry;
        if (entryUrl != '') window.location = entryUrl
        return (
            <div style={{ "margin": "10px 20px" }}>
                <h2>{this.props.entry.innerText}</h2>
            </div>
        )
    }
}

export default connect(
    ({ entry }) => ({ entry })
)(Entry)