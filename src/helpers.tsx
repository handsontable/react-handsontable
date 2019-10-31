import React from 'react';
import ReactDOM from 'react-dom';

let bulkComponentContainer = null;

/**
 * Warning message for the `autoRowSize`/`autoColumnSize` compatibility check.
 */
export const AUTOSIZE_WARNING = 'Your `HotTable` configuration includes `autoRowSize`/`autoColumnSize` options, which are not compatible with ' +
  ' the component-based renderers`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.';

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
    if (childrenCount === 1 && (childrenArray[0] as React.ReactElement).props[type]) {
      wantedChild = childrenArray[0];

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
  if (!componentNode) {
    return null;
  }

  return (componentNode.type as Function).name || ((componentNode.type as any).WrappedComponent as Function).name;
}

/**
 * Remove editor containers from DOM.
 *
 * @param [doc] Document to be used.
 */
export function removeEditorContainers(doc = document): void {
  doc.querySelectorAll('[id^="hot-wrapper-editor-container-"]').forEach((domNode) => {
    if (domNode.parentNode) {
      domNode.parentNode.removeChild(domNode);
    }
  });
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
    },
    isEditor: true
  });
}

/**
 * Create a react component and render it to an external DOM done.
 *
 * @param {React.ReactElement} rElement React element to be used as a base for the component.
 * @param {Object} props Props to be passed to the cloned element.
 * @param {Function} callback Callback to be called after the component has been mounted.
 * @param {Document} [ownerDocument] The owner document to set the portal up into.
 * @returns {{portal: React.ReactPortal, portalContainer: HTMLElement}} An object containing the portal and its container.
 */
export function createPortal(rElement: React.ReactElement, props, callback: Function, ownerDocument: Document = document): {
  portal: React.ReactPortal,
  portalContainer: HTMLElement
} {
  if (!ownerDocument) {
    ownerDocument = document;
  }

  if (!bulkComponentContainer) {
    bulkComponentContainer = ownerDocument.createDocumentFragment();
  }

  const portalContainer = ownerDocument.createElement('DIV');
  bulkComponentContainer.appendChild(portalContainer);

  const extendedRendererElement = React.cloneElement(rElement, {
    key: `${props.row}-${props.col}`,
    ...props
  });

  return {
    portal: ReactDOM.createPortal(extendedRendererElement, portalContainer, `${props.row}-${props.col}-${Math.random()}`),
    portalContainer
  };
}

/**
 * Add the `UNSAFE_` prefixes to the deprecated lifecycle methods for React >= 16.3.
 *
 * @param {Function} Klass Class to have the methods renamed.
 * @returns {Function} Class with the renamed methods.
 */
export function addUnsafePrefixes(Klass) {
  const reactSemverArray = React.version.split('.').map((v) => parseInt(v));
  const shouldPrefix = reactSemverArray[0] >= 16 && reactSemverArray[1] >= 3;

  if (shouldPrefix) {
    Klass.prototype.UNSAFE_componentWillUpdate = Klass.prototype.componentWillUpdate;
    delete Klass.prototype.componentWillUpdate;

    Klass.prototype.UNSAFE_componentWillMount = Klass.prototype.componentWillMount;
    delete Klass.prototype.componentWillMount;
  }

  return Klass;
}
