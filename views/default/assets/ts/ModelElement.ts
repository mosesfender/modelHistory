module mhd {

    export interface IModel {
        a_type: string;
        activation: string;
        c_id: string;
        c_name: string;
        c_state: string;
        control: string;
        direction: string;
    }

    export interface IChangedModel {
        changed_id: number;
        class: string;
        field: string;
        id: number;
        log_time: number;
        user_id: number;
        value_after: string;
        value_before: string;
    }

    export interface IChangedResult {
        model: mhd.IModel;
        changed: Array<mhd.IChangedModel>;
    }

    export interface IModelInput {
        log: mhd.LogElement,
    }

    export class ModelElement extends HTMLDivElement {
        protected _log: mhd.LogElement;
        protected _interval: number = 2000;
        private _timer;

        private _lastUpdate: number;

        constructor(options: mhd.IModelInput) {
            super();
            Object.assign(this, options);
            this.getData();
            this.start();
        }

        start() {
            let _that = this;
            this._timer = window.setInterval(() => {
                _that.getData();
            }, this._interval);
        }

        stop() {
            window.clearInterval(this._timer);
        }

        prepare(data: mhd.IChangedResult) {
            if (!data.changed.length) {
                return;
            }
            if (data.changed[0].log_time == this._lastUpdate) {
                return;
            }
            this._lastUpdate = data.changed[0].log_time;
            this.log.log(data.changed);
            this.renderModel(data);
        }

        renderModel(data: mhd.IChangedResult) {
            let findChanged = (name: string) => {
                for (let i = 0; i < data.changed.length; i++) {
                    if (name == data.changed[i].field) {
                        return data.changed[i];
                    }
                }
                return null;
            };

            let _that = this;
            for (let prop in data.model) {
                if (prop == 'id') {
                    continue;
                }
                let row = this.findRow(prop);
                if (row == null) {
                    let wrap = document.createElement('div');
                    wrap['_fld'] = prop;
                    let fldName = document.createElement('span');
                    fldName.innerHTML = prop;
                    let fldValue = document.createElement('span');
                    fldValue.innerHTML = data.model[prop];
                    wrap.appendChild(fldName);
                    wrap.appendChild(fldValue);
                    this.appendChild(wrap);
                } else {
                    let changed = findChanged(prop);
                    if (changed) {
                        row.children[1].innerHTML = data.model[prop];
                    }
                }
            }
        }

        private findRow(name: string) {
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i]['_fld'] == name) {
                    return this.children[i];
                }
            }
            return null;
        }

        getData() {
            let _that = this;
            fetch('model-history/default/do-queue')
                .then((res: Response) => {
                    return res.json();
                })
                .then((data: mhd.IChangedResult) => {
                    _that.prepare(data);
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        set log(el: mhd.LogElement) {
            this._log = el;
        }

        get log() {
            return this._log;
        }
    }
}

window.customElements.define('model-data', mhd.ModelElement, {extends: 'div'});