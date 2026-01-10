import {
  AnyReadOnlyObservable,
  Observable,
  ReadOnlyObservable,
  ReadOnlyProxyObservable,
} from './main.js';
import { BooleanState, NullState } from './state.js';

export class Timer extends NullState {
  private _timeout: NodeJS.Timeout | null;
  private readonly _triggerTime = new Observable<number | null>(null);

  readonly isEnabled: BooleanState;
  readonly runoutTime: ReadOnlyProxyObservable<number | null>;
  readonly time: Observable<number>;

  constructor(time = 0, enableFromStart = true) {
    super();

    this.isEnabled = new BooleanState(enableFromStart, (enabled) => {
      if (enabled) return;

      this.stop();
    });

    this.time = new Observable(time, (_, changed) => {
      if (!changed) return;
      if (!this.isActive.value) return;

      this.start();
    });

    this.runoutTime = new ReadOnlyProxyObservable(
      this._triggerTime,
      (value) => {
        if (value === null) return null;
        return value + this.time.value;
      },
    );
  }

  get isActive(): AnyReadOnlyObservable<boolean> {
    return new ReadOnlyProxyObservable(this._triggerTime, Boolean);
  }

  get triggerTime(): AnyReadOnlyObservable<number | null> {
    return new ReadOnlyObservable(this._triggerTime);
  }

  private _handleFire() {
    this.stop();
    this.trigger(null);
  }

  disable(): void {
    this.isEnabled.value = false;
  }

  enable(): void {
    this.isEnabled.value = true;
  }

  start(restart = true): void {
    if (!this.time.value) return;
    if (!this.isEnabled.value) return;
    if (this._timeout && !restart) return;

    this.stop();

    this._timeout = setTimeout(() => this._handleFire(), this.time.value);
    this._triggerTime.value = Date.now();
  }

  stop(): void {
    if (!this._timeout) return;

    clearTimeout(this._timeout);
    this._timeout = null;
    this._triggerTime.value = null;
  }
}
