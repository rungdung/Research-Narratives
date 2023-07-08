import { narrativeNodes, annotationNodes, markupNodes } from "../stores.js";

export async function addNewNarrativeNode() {
  await narrativeNodes.update((nodes) => {
    let previousNode = nodes[nodes.length - 1];
    let previousId, tempid;
    if (previousNode) {
      previousId = previousNode.id;
      tempid = previousNode.id.split("-")[0] + "-" + (nodes.length + 1);
    }
    nodes.push({
      id: "narrativeNode-" + nodes.length,
      label:
        nodes.length > 0
          ? "Section heading"
          : "Provide a title for the data story",
      notes: "Enter body text",
      position:
        nodes.length > 0
          ? {
              x: previousNode.position.x,
              y: previousNode.position.y + 400,
            }
          : { x: 1000, y: -100 },
      files: {
        accepted: [],
        rejected: [],
      },
      connections:
        nodes.length > 0
          ? [
              [tempid, tempid.concat("1")],
              [previousId, previousId.concat("2")],
            ]
          : [],
      mapFeature: null,
      images: [],
      charts: [],
    });
    return nodes;
  });
}

export function addNewAnnotationNode() {
  annotationNodes.update((nodes) => {
    nodes.push({
      id:
        nodes.length > 0
          ? "annotationNode-" + (nodes.length + 1)
          : "annotationNode-" + 1,
      label: "Caption for the image",
      notes: "Annotation text",
      position: { x: 600, y: -100 },
      files: {
        accepted: [],
        rejected: [],
      },
      images: [],
      charts: [],
    });
    return nodes;
  });
}

export function addNewMarkupNode(feature) {
  markupNodes.update((nodes) => {
    let props = Object.fromEntries(
      Object.entries(feature.properties).map(([key, val]) => [
        key.toLowerCase(),
        val,
      ])
    );

    nodes.push({
      id: "markupNode-" + nodes.length,
      label: props.name || props.title || props.label || "Untitled",
      feature: feature,
      notes: "",
      source: feature.layer.source,
      properties: props,
    });

    return nodes;
  });
}
