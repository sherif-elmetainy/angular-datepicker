import { IPopupEvents } from '../interfaces';
import { applyMixins } from '../util';
import { PopupImplentation } from './popup-implementation';

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

// tslint:disable-next-line: ban-types
function isComponentType(type: Function): type is ComponentType {
  return type && !!(type as ComponentType).ɵcmp;
}

// tslint:disable-next-line: ban-types
function isDirectiveType(type: Function): type is DirectiveType {
  return type && !!(type as DirectiveType).ɵdir;
}

function applyHooks(def: FunctionWithDecorator): void {
  const oldOnDestroy = def.prototype.ngOnDestroy as () => void;
  const oldOnInit = def.prototype.ngOnInit as () => void;
  def.prototype.ngOnDestroy = function(this: IPopupEvents): void {
    if (oldOnDestroy) {
      oldOnDestroy.apply(this);
    }
    this.popupOnDestroy();
  };
  def.prototype.ngOnInit = function(this: IPopupEvents): void {
    if (oldOnInit) {
      oldOnInit.apply(this);
    }
    this.popupOnInit();
  };
}

export function Popup(): ClassDecorator {
  return (target: FunctionWithDecorator) => {
    applyMixins(target, PopupImplentation);
    if (isComponentType(target) || isDirectiveType(target)) {
      applyHooks(target);
    }
  };
}
