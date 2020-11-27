import { ZBWorkerOptions } from "zeebe-node";

/**
 *
 *
 * @export
 * @interface ZeebeWorkerProperties
 */
export interface ZeebeWorkerProperties {
    type: string;
    options?: ZBWorkerOptions;
}

/**
 *
 *
 * @export
 * @interface ZeebeClientOptions
 */
export interface ZeebeClientOptions {
    gatewayAddress?: string;
    options?: ZBWorkerOptions;
}

/**
 *
 *
 * @export
 * @interface ZeebeAsyncOptions
 */
export interface ZeebeAsyncOptions {
    imports?: any[];
    inject?: any[];
    useFactory?: (
        ...args: any[]
    ) => Promise<ZeebeClientOptions> | ZeebeClientOptions;
}