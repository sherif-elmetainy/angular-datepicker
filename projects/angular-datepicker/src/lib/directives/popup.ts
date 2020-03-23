import { applyMixins } from '../util';
import { PopupImplentation } from './popup-implementation';
import { IPopupEvents } from '../interfaces';

const DECORATOR_APPLIED_SYMBOL = Symbol();

interface FunctionWithDecorator extends Function {
  [DECORATOR_APPLIED_SYMBOL]?: boolean;
}

interface ComponentDefinition {
  onDestroy: (() => void) | null;
  onInit: (() => void) | null;
}
type DirectiveDefinition = ComponentDefinition;

interface ComponentType extends FunctionWithDecorator {
  ɵcmp: ComponentDefinition;
}

interface DirectiveType extends FunctionWithDecorator {
  ɵdir: DirectiveDefinition;
}

function isComponentType(type: Function): type is ComponentType {
  return type && !!(type as ComponentType).ɵcmp;
}

function isDirectiveType(type: Function): type is DirectiveType {
  return type && !!(type as DirectiveType).ɵdir;
}

function applyHooks(def: ComponentDefinition): void {
  const oldOnDestroy = def.onDestroy;
  const oldOnInit = def.onInit;
  def.onDestroy = function (this: IPopupEvents): void {
    if (oldOnDestroy) {
      oldOnDestroy.apply(this);
    }
    this.popupOnDestroy();
  };
  def.onInit = function (this: IPopupEvents): void {
    if (oldOnInit) {
      oldOnInit.apply(this);
    }
    this.popupOnInit();
  };
}

export function Popup(): ClassDecorator {
  return (target: FunctionWithDecorator) => {
    applyMixins(target, PopupImplentation);
    if (isComponentType(target)) {
      applyHooks(target.ɵcmp);
    } else if (isDirectiveType(target)) {
      applyHooks(target.ɵdir);
    }
  };
}
