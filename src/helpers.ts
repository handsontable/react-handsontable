import React from 'react';
import ReactDOM from 'react-dom';

let bulkComponentContainer = null;

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
 * Get the component node name.
 *
 * @param {React.ReactElement} componentNode
 * @returns {String} Provided component's name.
 */
export function getComponentNodeName(componentNode: React.ReactElement): string {
  return (componentNode.type as Function).name || ((componentNode.type as any).WrappedComponent as Function).name;
}

/**
 * Check if the provided children arrays are equal considering their declared renderers and editors.
 *
 * @param {React.ReactNode[]} childrenA Array of children.
 * @param {React.ReactNode} childrenB Array of children to be compared with `childrenA`.
 * @returns {Boolean} `true` if the children arrays contain the same editor and renderer setup, `false` otherwise.
 */
export function areChildrenEqual(childrenA: React.ReactNode, childrenB: React.ReactNode): boolean {
  const childrenAArray: React.ReactNode[] = React.Children.toArray(childrenA);
  const childrenBArray: React.ReactNode[] = React.Children.toArray(childrenB);

  const isHotColumn = (childNode: any) => childNode.type.name === 'HotColumn'

  const editorA = getChildElementByType(childrenAArray, 'hot-editor');
  const editorB = getChildElementByType(childrenBArray, 'hot-editor');
  const rendererA = getChildElementByType(childrenAArray, 'hot-renderer');
  const rendererB = getChildElementByType(childrenBArray, 'hot-renderer');
  const hotColumnCountA = childrenAArray.filter(function (childNode: any) {
    return isHotColumn(childNode);
  }).length;
  const hotColumnCountB = childrenBArray.filter(function (childNode: any) {
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
 * Create an editor portal.
 *
 * @param {React.ReactElement} editorElement Editor's element.
 * @returns {React.ReactPortal} The portal for the editor.
 */
export function createEditorPortal(editorElement: React.ReactElement): React.ReactPortal {
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
 * Get an editor element extended with a instance-emitting method.
 *
 * @param {React.ReactNode} children Component children.
 * @param {Map} editorCache Component's editor cache.
 * @returns {React.ReactElement} An editor element containing the additional methods.
 */
export function getExtendedEditorElement(children: React.ReactNode, editorCache: Map<string, object>): React.ReactElement | null {
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

/**
 * Create a react component and render it to an external DOM done.
 *
 * @param {React.ReactElement} rElement React element to be used as a base for the component.
 * @param {Function} callback Callback to be called after the component has been mounted.
 */
export function createReactComponent(rElement: React.ReactElement, callback: Function, ownerDocument?: Document): void {
  if (!ownerDocument) {
    ownerDocument = document;
  }

  if (!bulkComponentContainer) {
    bulkComponentContainer = ownerDocument.createElement('DIV');
    bulkComponentContainer.id = 'reactHotComponents';

    ownerDocument.body.appendChild(bulkComponentContainer);
  }

  const componentContainer = ownerDocument.createElement('DIV');
  bulkComponentContainer.appendChild(componentContainer);

  ReactDOM.render(rElement, componentContainer, function() {
    this.setState({
      domElement: componentContainer
    }, function() {
      callback.call(this);
    });
  });
}
