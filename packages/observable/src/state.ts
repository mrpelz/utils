/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnyObservable,
  AnyObservableOrNullState,
  MetaObserverCallback,
  Observable,
  ObservableGroup,
  Observer,
  ObserverCallback,
  ProxyObservable,
} from './main.js';

export class BooleanState extends Observable<boolean> {
  flip(origin?: AnyObservableOrNullState): boolean {
    this.set(!this.value, origin ?? this);

    return this.value;
  }
}

export class BooleanProxyState<T> extends ProxyObservable<T, boolean> {
  flip(origin?: AnyObservableOrNullState): boolean {
    this.set(!this.value, origin ?? this);

    return this.value;
  }
}

export enum BooleanGroupStrategy {
  IS_TRUE_IF_ALL_TRUE,
  IS_TRUE_IF_SOME_TRUE,
}

export class BooleanStateGroup extends ObservableGroup<boolean> {
  private static _getValue(
    strategy: BooleanGroupStrategy,
    observables: AnyObservable<boolean>[],
  ) {
    const values = observables.map(({ value }) => value);

    return strategy === BooleanGroupStrategy.IS_TRUE_IF_ALL_TRUE
      ? !values.includes(false)
      : values.includes(true);
  }

  private readonly _strategy: BooleanGroupStrategy;

  constructor(
    strategy: BooleanGroupStrategy,
    states: AnyObservable<boolean>[] = [],
  ) {
    super(BooleanStateGroup._getValue(strategy, states), states);

    this._strategy = strategy;
  }

  protected _merge(): boolean {
    return BooleanStateGroup._getValue(this._strategy, this.observables);
  }

  get allOn(): boolean {
    return BooleanStateGroup._getValue(
      BooleanGroupStrategy.IS_TRUE_IF_ALL_TRUE,
      this.observables,
    );
  }

  get someOn(): boolean {
    return BooleanStateGroup._getValue(
      BooleanGroupStrategy.IS_TRUE_IF_SOME_TRUE,
      this.observables,
    );
  }

  flip(origin?: AnyObservableOrNullState): boolean {
    this.set(!this.value, origin ?? this);

    return this.value;
  }
}

export class BooleanNullableStateGroup extends BooleanStateGroup {
  constructor(
    strategy: BooleanGroupStrategy,
    observables: AnyObservable<boolean | null>[] = [],
  ) {
    super(
      strategy,
      observables.map(
        (observable) =>
          new ProxyObservable(
            observable,
            (value) => Boolean(value),
            (value) => value,
          ),
      ),
    );
  }
}

export class EnumState<T = any> extends Observable<T> {
  private readonly _enum: readonly T[];

  constructor(anEnum: readonly T[], initialValue: T) {
    if (!anEnum.includes(initialValue)) {
      throw new RangeError(`"${initialValue}" is not an allowed value`);
    }

    super(initialValue);
    this._enum = anEnum;
  }

  private get _maxIndex() {
    return this._enum.length - 1;
  }

  private _indexOf(value: T) {
    const index = this._enum.indexOf(value);

    return index === -1 ? null : index;
  }

  get value(): T {
    return super.value;
  }

  getIndex(): number | null {
    return this._indexOf(this.value);
  }

  next(origin?: AnyObservableOrNullState): this {
    const currentIndex = this._indexOf(this.value);
    if (currentIndex === null) return this;

    const index = currentIndex === this._maxIndex ? 0 : currentIndex + 1;

    return this.setIndex(index, origin ?? this);
  }

  previous(origin?: AnyObservableOrNullState): this {
    const currentIndex = this._indexOf(this.value);
    if (currentIndex === null) return this;

    const index = currentIndex === 0 ? this._maxIndex : currentIndex - 1;

    return this.setIndex(index, origin ?? this);
  }

  set(value: T, origin?: AnyObservableOrNullState): void {
    if (value === super.value) return;

    if (!this._enum.includes(value)) {
      throw new RangeError(`"${value}" is not an allowed value`);
    }

    super.set(value, origin ?? this);
  }

  setIndex(index: number, origin?: AnyObservableOrNullState): this {
    if (index < 0 || index > this._maxIndex) {
      throw new RangeError(`"${index}" is a not existing index`);
    }

    const nextValue = this._enum[index];
    if (nextValue) this.set(nextValue, origin ?? this);

    return this;
  }
}

export class NullState<T = null> {
  protected readonly _observers: Set<MetaObserverCallback<T>>;

  constructor(observerCallback?: MetaObserverCallback<T>) {
    this._observers = observerCallback
      ? new Set([observerCallback])
      : new Set();
  }

  get listeners(): number {
    return this._observers.size;
  }

  get value(): T {
    return undefined as unknown as T;
  }

  observe(observerCallback: ObserverCallback<T>): Observer {
    let observer: Observer;

    const metaObserverCallback = (
      value: T,
      changed: boolean,
      origin: AnyObservableOrNullState,
    ) => {
      observerCallback(value, observer, changed, origin);
    };

    this._observers.add(metaObserverCallback);

    observer = {
      remove: () => this._observers.delete(metaObserverCallback),
    };

    return observer;
  }

  set(value: T, origin?: AnyObservableOrNullState): void {
    this.trigger(value, origin ?? this);
  }

  trigger(data: T = null as T, origin?: AnyObservableOrNullState): void {
    if (origin === this) return;

    for (const observer of this._observers) {
      observer(data, false, origin ?? this);
    }
  }
}

export class ReadOnlyNullState<T = null> {
  private readonly _nullState: NullState<T>;

  constructor(nullState: NullState<T>) {
    this._nullState = nullState;
  }

  get listeners(): number {
    return this._nullState.listeners;
  }

  observe(observerCallback: ObserverCallback<T>): Observer {
    return this._nullState.observe(observerCallback);
  }
}

export type AnyNullState<T> = NullState<T> | ReadOnlyNullState<T>;

export const isNullState = (input: any): input is AnyNullState<any> => {
  if (input instanceof NullState) return true;

  if (input instanceof ReadOnlyNullState) return true;

  return false;
};
