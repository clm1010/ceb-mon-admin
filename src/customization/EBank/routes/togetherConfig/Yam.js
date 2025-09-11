import React, { useEffect } from 'react';
// import { yaml } from '@codemirror/lang-yaml';
import { StreamLanguage, syntaxTree } from "@codemirror/language"
// import { yaml } from "@codemirror/legacy-modes/mode/yaml"
import * as yamlMode from "@codemirror/legacy-modes/mode/yaml"
import { linter, lintGutter } from "@codemirror/lint"
import CodeMirror from '@uiw/react-codemirror';
// import { eclipse } from '@uiw/codemirror-theme-eclipse';
// import { sublime } from '@uiw/codemirror-theme-sublime';
import { xcodeLight } from '@uiw/codemirror-theme-xcode';

import jsyaml from "js-yaml";
const yaml = StreamLanguage.define(yamlMode.yaml);

const Yaml = ({dispatch,currentItem}) => {

  const [value, setValue] = React.useState("");

  useEffect(()=>{
    if(currentItem.data){
      setValue(jsyaml.dump(JSON.parse(currentItem.data)));
    }else{
      setValue("");
    }
  },[currentItem])

  const onChange = React.useCallback((val, viewUpdate) => {
    const yaml_json = jsyaml.load(val)
    // console.dir("yaml_json", yaml_json)

    // const json = {
    //   name: 'John Doe',
    //   age: 30,
    //   address: {
    //     street: '123 Main St',
    //     city: 'Anytown'
    //   },
    //   arr: [10, 20, 30]
    // }
    // const yaml = jsyaml.dump(json);
    setValue(val);
    dispatch({
      type: "togetherConfig/updateState",
      payload: {
        yamlData: yaml_json
      }
    })

  }, []);

  const yamlLinter = linter(view => {
    let diagnostics = [];
    try {
      jsyaml.load(view.state.doc)
    } catch (e) {
      var loc = e.mark;
      var from = loc ? loc.position : 0;
      var to = from;
      var severity = "error";
      diagnostics.push({ from: from, to: to, message: e.message, severity: severity });
    }
    return diagnostics
  });

  const regexpLinter = linter(view => {
    let diagnostics = []
    syntaxTree(view.state).cursor().iterate(node => {
      console.log("node_name:", node.name)
      if (node.name == "Document") {
        diagnostics.push({
          from: node.from,
          to: node.to,
          severity: "warning",
          message: "Regular expressions are FORBIDDEN"
        })
      }
    })
    return diagnostics
  })

  return <CodeMirror
    value={value}
    height="450px"
    width="1300px"
    theme={xcodeLight}
    // extensions={[StreamLanguage.define(yaml), lintGutter(), yamlLinter]}
    extensions={[yaml, lintGutter(), yamlLinter]}
    onChange={onChange}
  />;

}

export default Yaml