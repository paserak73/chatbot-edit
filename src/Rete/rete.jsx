import React from "react";
import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "./MyNode";

var numSocket = new Rete.Socket("Number value");

class InputControl extends Rete.Control {
  static component = ({ value, onChange }) => (
    <textarea
      style={{ width: 250, height: 50 }}
      value={value}
      ref={(ref) => {
        ref && ref.addEventListener("pointerdown", (e) => e.stopPropagation());
      }}
      onChange={(e) => onChange(+e.target.value)}
    />
  );

  constructor(emitter, key, node, readonly = false) {
    super(key);
    this.emitter = emitter;
    this.key = key;
    this.component = InputControl.component;

    const initial = node.data[key] || 0;

    node.data[key] = initial;
    this.props = {
      readonly,
      value: initial,
      onChange: (v) => {
        this.setValue(v);
        this.emitter.trigger("process");
      },
    };
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
    this.update();
  }
}

class InputComponent extends Rete.Component {
  constructor(props) {
    super("Option");
  }

  builder(node) {
    var out1 = new Rete.Output("num", "", numSocket);
    var ctrl = new InputControl(this.editor, "num", node);

    return node.addControl(ctrl).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super("Question");
    this.data.component = MyNode; // optional
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "", numSocket);
    var inp2 = new Rete.Input("num2", "", numSocket);
    var out = new Rete.Output("num", "", numSocket);

    inp1.addControl(new InputControl(this.editor, "num1", node));
    inp2.addControl(new InputControl(this.editor, "num2", node));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new InputControl(this.editor, "preview", node, true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor.nodes
      .find((n) => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}

export async function createEditor(container, data) {
  var components = [new InputComponent("TITLE"), new AddComponent()];

  // var components = data.map((row) => {
  //   if (row[4] === "TELL") {
  //     return new InputComponent(row);
  //   } else {
  //     new AddComponent(row);
  //   }
  //   return false;
  // });

  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin);

  var engine = new Rete.Engine("demo@0.1.0");

  components.map((c) => {
    editor.register(c);
    engine.register(c);
  });

  var n1 = await components[0].createNode({
    num: "Pracuješ v současné době z domova?",
    text: "Lol",
  });
  var n2 = await components[0].createNode({ num: "" });
  var add = await components[1].createNode();

  n1.position = [80, 200];
  n2.position = [80, 400];
  add.position = [500, 240];

  editor.addNode(n1);
  editor.addNode(n2);
  editor.addNode(add);

  editor.connect(n1.outputs.get("num"), add.inputs.get("num1"));
  editor.connect(n2.outputs.get("num"), add.inputs.get("num2"));

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.view.resize();
  editor.trigger("process");
  AreaPlugin.zoomAt(editor, editor.nodes);
}
