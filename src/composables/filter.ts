// import { isRef, ref } from "vue";
// import type { MaybeRef, Ref } from "vue";

// export const noop = () => {};

// /**
//  * Create an EventFilter that throttle the events
//  *
//  * @param ms
//  * @param [trailing=true]
//  * @param [leading=true]
//  * @param [rejectOnCancel=false]
//  */
// export function throttleFilter(
//     ms: MaybeRef<number>,
//     trailing = true,
//     leading = true,
//     rejectOnCancel = false
// ) {
//     let lastExec = 0;
//     let timer: ReturnType<typeof setTimeout> | undefined;
//     let isLeading = true;
//     let lastRejector: Function = noop;
//     let lastValue: any;

//     const clear = () => {
//         if (timer) {
//             clearTimeout(timer);
//             timer = undefined;
//             lastRejector();
//             lastRejector = noop;
//         }
//     };

//     const filter: any = (_invoke) => {
//         const duration = isRef(ms) ? ms.value : ms;
//         const elapsed = Date.now() - lastExec;
//         const invoke = () => {
//             return (lastValue = _invoke());
//         };

//         clear();

//         if (duration <= 0) {
//             lastExec = Date.now();
//             return invoke();
//         }

//         if (elapsed > duration && (leading || !isLeading)) {
//             lastExec = Date.now();
//             invoke();
//         } else if (trailing) {
//             lastValue = new Promise((resolve, reject) => {
//                 lastRejector = rejectOnCancel ? reject : resolve;
//                 timer = setTimeout(() => {
//                     lastExec = Date.now();
//                     isLeading = true;
//                     resolve(invoke());
//                     clear();
//                 }, Math.max(0, duration - elapsed));
//             });
//         }

//         if (!leading && !timer) timer = setTimeout(() => (isLeading = true), duration);

//         isLeading = false;
//         return lastValue;
//     };

//     return filter;
// }

// /**
//  * @internal
//  */
// export function createFilterWrapper<T extends Function>(filter: any, fn: T) {
//     function wrapper(this: any, ...args: any) {
//         return new Promise<ReturnType<any>>((resolve, reject) => {
//             // make sure it's a promise
//             Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args }))
//                 .then(resolve)
//                 .catch(reject);
//         });
//     }

//     return wrapper;
// }

// export function refThrottled<T>(value: Ref<T>, delay = 200, trailing = true, leading = true) {
//     if (delay <= 0) return value;

//     const throttled: Ref<T> = ref(value.value as T) as Ref<T>;

//     const updater = useThrottleFn(
//         () => {
//             throttled.value = value.value;
//         },
//         delay,
//         trailing,
//         leading
//     );

//     watch(value, () => updater());

//     return throttled;
// }

// export function useThrottleFn<T extends FunctionArgs>(
//     fn: T,
//     ms: MaybeRefOrGetter<number> = 200,
//     trailing = false,
//     leading = true,
//     rejectOnCancel = false
// ): PromisifyFn<T> {
//     return createFilterWrapper(throttleFilter(ms, trailing, leading, rejectOnCancel), fn);
// }
