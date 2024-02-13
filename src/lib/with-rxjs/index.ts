import { Observable } from "rxjs"
import type { Writable } from "svelte/store"

export function toObservable<T>(store: Writable<T>) {
  return new Observable<T>((observer) => {
    return store.subscribe((value) => observer.next(value))
  })
}
