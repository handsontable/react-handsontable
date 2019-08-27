import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Filter out and return elements of the provided `type` from the `HotColumn` component's children.
 *
 * @param {React.ReactNode} children HotTable children array.
 * @param {String} type Either `'hot-renderer'` or `'hot-editor'`.
 * @returns {Object|null} A child (React node) or `null`, if no child of that type was found.
 */
export function getChildElementByType(children: React.ReactNode, type: string): React.ReactElement | null {
  const childrenArray: React.ReactNode[] = React.Children.toArray(children);
  const childrenCount: number = React.Children.count(children);
  let wantedChild: React.ReactNode | null = null;

  if (childrenCount !== 0) {
    if (childrenCount === 1 && (children as React.ReactElement).props[type]) {
      wantedChild = children;

    } else {
      wantedChild = childrenArray.find((child) => {
        return (child as React.ReactElement).props[type] !== void 0;
      });
    }
  }

  return (wantedChild as React.ReactElement) || null;
}

/**
 * TODO: docs
 * @param componentNode
 */
export function getComponentNodeName(componentNode: React.ReactElement) {
  return (componentNode.type as Function).name || ((componentNode.type as any).WrappedComponent as Function).name;
}

/**
 * TODO: docs
 * @param childrenA
 * @param childrenB
 */
export function areChildrenEqual(childrenA, childrenB) {
  childrenA = React.Children.toArray(childrenA);
  childrenB = React.Children.toArray(childrenB);

  const isHotColumn = (childNode: any) => childNode.type.name === 'HotColumn'

  const editorA = getChildElementByType(childrenA, 'hot-editor');
  const editorB = getChildElementByType(childrenB, 'hot-editor');
  const rendererA = getChildElementByType(childrenA, 'hot-renderer');
  const rendererB = getChildElementByType(childrenB, 'hot-renderer');
  const hotColumnCountA = childrenA.filter(function (childNode: any) {
    return isHotColumn(childNode);
  }).length;
  const hotColumnCountB = childrenB.filter(function (childNode: any) {
    return isHotColumn(childNode);
  }).length;
  let areChildrenEqual = true;

  if (
    ((editorA && !editorB) || (!editorA && editorB) || getComponentNodeName(editorA) !== getComponentNodeName(editorB))
    || ((rendererA && !rendererB) || (!rendererA && rendererB) || getComponentNodeName(rendererA) !== getComponentNodeName(rendererB)
    || hotColumnCountA !== hotColumnCountB)
  ) {
    areChildrenEqual = false;
  }

  return areChildrenEqual;
}

/**
 * TODO: docs
 */
export function createEditorPortal(editorElement) {
  if (editorElement === null) {
    return;
  }

  const componentName: string = getComponentNodeName(editorElement);

  let editorContainer = document.querySelector('#hot-wrapper-editor-container-' + componentName);
  if (!document.querySelector('#hot-wrapper-editor-container-' + componentName)) {
    editorContainer = document.createElement('DIV');
    editorContainer.id = 'hot-wrapper-editor-container-' + componentName;
    document.body.appendChild(editorContainer);
  }

  return ReactDOM.createPortal(editorElement, editorContainer);
}

/**
 * TODO: docs, types
 *
 * @returns {React.ReactElement} React editor component element.
 */
export function getExtendedEditorElement(children, editorCache): React.ReactElement | null {
  const editorElement = getChildElementByType(children, 'hot-editor');

  if (!editorElement) {
    return null;
  }

  return React.cloneElement(editorElement, {
    emitEditorInstance: (editorName, editorInstance) => {
      if (!editorCache.has(editorName)) {
        editorCache.set(editorName, editorInstance);
      }
    }
  });
}
