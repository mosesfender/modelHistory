declare module mhd {
    interface IModel {
        a_type: string;
        activation: string;
        c_id: string;
        c_name: string;
        c_state: string;
        control: string;
        direction: string;
    }
    interface IChangedModel {
        changed_id: number;
        class: string;
        field: string;
        id: number;
        log_time: number;
        user_id: number;
        value_after: string;
        value_before: string;
    }
    interface IChangedResult {
        model: mhd.IModel;
        changed: Array<mhd.IChangedModel>;
    }
    interface IModelInput {
        log: mhd.LogElement;
    }
    class ModelElement extends HTMLDivElement {
        protected _log: mhd.LogElement;
        protected _interval: number;
        private _timer;
        private _lastUpdate;
        constructor(options: mhd.IModelInput);
        start(): void;
        stop(): void;
        prepare(data: mhd.IChangedResult): void;
        renderModel(data: mhd.IChangedResult): void;
        private findRow;
        getData(): void;
        set log(el: mhd.LogElement);
        get log(): mhd.LogElement;
    }
}
declare module mhd {
    class LogElement extends HTMLDivElement {
        log(data: Array<mhd.IChangedModel>): void;
        add(date: number, text: string | HTMLElement, error?: boolean): void;
    }
}
declare module mhd {
    interface IChangedData {
        model: mhd.IModel;
        dirty: Object;
    }
    class ChangeElement extends HTMLDivElement {
        protected _interval: number;
        private _timer;
        private _btnWrap;
        private _btnRun;
        private _btnOneStep;
        constructor();
        connectedCallback(): void;
        start(): void;
        stop(): void;
        getQueue(): void;
        requestQueue(data: mhd.IModel): void;
        add(text: string, error?: boolean): void;
    }
}
declare let model: HTMLDivElement;
declare let log: HTMLDivElement;
declare let change: HTMLDivElement;
