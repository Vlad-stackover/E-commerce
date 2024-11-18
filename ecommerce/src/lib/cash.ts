import { unstable_cache as nextCash } from "next/cache"
import {cache as reactCache} from "react"

type Callback = (...args: any[]) => Promise<any>

export function cache<T extends Callback>(
    cb: T,
    keyParts: string[],
    options: { revalidate?: number | false; tags?: string[] } ={}
){
    return nextCash(reactCache(cb), keyParts, options)
}