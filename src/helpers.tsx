import React from 'react';
import ReactDOM from 'react-dom';

let bulkComponentContainer = null;

/**
 * Warning message for the `autoRowSize`/`autoColumnSize` compatibility check.
 */
export const AUTOSIZE_WARNING = 'Your `HotTable` configuration includes `autoRowSize`/`autoColumnSize` options, which are not compatible with ' +
  ' the component-based renderers`. Disable `autoRowSize` and `autoColumnSize` to prevent row and column misalignment.';

/**
 * Logs warn to the console if the `console` object is exposed.
 *
 * @param {...*} args Values which will be logged.
 */
export function warn(...args) {
  if (typeof console !== 'undefined') {
    console.warn(...args);
  }
}

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
 * Get the reference to the original editor class.
 *
 * @param {React.ReactElement} editorElement React element of the editor class.
 * @returns {Function} Original class of the editor component.
 */
export function getOriginalEditorClass(editorElement: React.ReactElement): Function {
  if (!editorElement) {
    return null;
  }

  return (editorElement.type as any).WrappedComponent ? (editorElement.type as any).WrappedComponent : editorElement.type;
}

/**
 * Remove editor containers from DOM.
 *
 * @param {Document} [doc] Document to be used.
 * @param {Map} editorCache The editor cache reference.
 */
export function removeEditorContainers(doc = document, editorCache: Map<Function, React.Component>): void {
  editorCache.forEach((editorComponent, key) => {
    const mainElementRef = (editorComponent as any).mainElementRef ? (editorComponent as any).mainElementRef.current : null;
    const mainElementContainer = mainElementRef ? mainElementRef.parentNode : null;

    if (!mainElementRef || !mainElementContainer) {
      return;
    }

    if (mainElementContainer.parentNode) {
      mainElementContainer.parentNode.removeChild(mainElementContainer);
    }
  });
}

/**
 * Create an editor portal.
 *
 * @param {Document} [doc] Document to be used.
 * @param {React.ReactElement} editorElement Editor's element.
 * @param {Map} editorCache The editor cache reference.
 * @returns {React.ReactPortal} The portal for the editor.
 */
export function createEditorPortal(doc = document, editorElement: React.ReactElement, editorCache: Map<Function, React.Component>): React.ReactPortal {
  let cachedEditor = editorCache.get(getOriginalEditorClass(editorElement));
  let editorContainer = (cachedEditor && (cachedEditor as any).mainElementRef.current) ? (cachedEditor as any).mainElementRef.current.parentNode : null;

  if (editorElement === null) {
    return;
  }

  if (!editorContainer) {
    editorContainer = doc.createElement('DIV');
  }

  const {id, className, style} = getContainerAttributesProps(editorElement.props, false);

  if (id) {
    editorContainer.id = id;
  }

  if (className) {
    editorContainer.className = 'hot-wrapper-editor-container ' + className;
  }

  if (style) {
    Object.assign(editorContainer.style, style);
  }

  doc.body.appendChild(editorContainer);

  return ReactDOM.createPortal(editorElement, editorContainer);
}

/**
 * Get an editor element extended with a instance-emitting method.
 *
 * @param {React.ReactNode} children Component children.
 * @param {Map} editorCache Component's editor cache.
 * @returns {React.ReactElement} An editor element containing the additional methods.
 */
export function getExtendedEditorElement(children: React.ReactNode, editorCache: Map<Function, object>): React.ReactElement | null {
  const editorElement = getChildElementByType(children, 'hot-editor');
  const editorClass = getOriginalEditorClass(editorElement);

  if (!editorElement) {
    return null;
  }

  return React.cloneElement(editorElement, {
    emitEditorInstance: (editorInstance) => {
      if (!editorCache.has(editorClass)) {
        editorCache.set(editorClass, editorInstance);
      }
    },
    isEditor: true
  } as object);
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
 * Get an object containing the `id`, `className` and `style` keys, representing the corresponding props passed to the
 * component.
 *
 * @param {Object} props Object containing the react element props.
 * @param {Boolean} randomizeId If set to `true`, the function will randomize the `id` property when no `id` was present in the `prop` object.
 * @returns An object containing the `id`, `className` and `style` keys, representing the corresponding props passed to the
 * component.
 */
export function getContainerAttributesProps(props, randomizeId: boolean = true): {id: string, className: string, style: object} {
  return {
    id: props.id || (randomizeId ? 'hot-' + Math.random().toString(36).substring(5) : void 0),
    className: props.className || '',
    style: props.style || {},
  }
}

/**
 * Add the `UNSAFE_` prefixes to the deprecated lifecycle methods for React >= 16.3.
 *
 * @param {Function} Klass Class to have the methods renamed.
 * @returns {Function} Class with the renamed methods.
 */
export function addUnsafePrefixes<T extends any>(Klass: T): T {
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
