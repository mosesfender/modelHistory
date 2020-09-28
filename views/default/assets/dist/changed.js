var mhd;
(function (mhd) {
    class ModelElement extends HTMLDivElement {
        constructor(options) {
            super();
            this._interval = 2000;
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
        prepare(data) {
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
        renderModel(data) {
            let findChanged = (name) => {
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
                }
                else {
                    let changed = findChanged(prop);
                    if (changed) {
                        row.children[1].innerHTML = data.model[prop];
                    }
                }
            }
        }
        findRow(name) {
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
                .then((res) => {
                return res.json();
            })
                .then((data) => {
                _that.prepare(data);
            })
                .catch((err) => {
                console.error(err);
            });
        }
        set log(el) {
            this._log = el;
        }
        get log() {
            return this._log;
        }
    }
    mhd.ModelElement = ModelElement;
})(mhd || (mhd = {}));
window.customElements.define('model-data', mhd.ModelElement, { extends: 'div' });
var mhd;
(function (mhd) {
    class LogElement extends HTMLDivElement {
        log(data) {
            let time = data[0].log_time * 1000;
            let wrap = document.createElement('div');
            let title = document.createElement('div');
            title.innerHTML = 'Изменились поля:';
            wrap.appendChild(title);
            for (let i = 0; i < data.length; i++) {
                let selfWrap = document.createElement('dd');
                let fld = document.createElement('span');
                fld.innerHTML = data[i].field;
                selfWrap.appendChild(fld);
                let beginValue = document.createElement('span');
                beginValue.innerHTML = data[i].value_before;
                beginValue.setAttribute('title', data[i].value_before);
                selfWrap.appendChild(beginValue);
                let endValue = document.createElement('span');
                endValue.innerHTML = data[i].value_after;
                endValue.setAttribute('title', data[i].value_after);
                selfWrap.appendChild(endValue);
                wrap.appendChild(selfWrap);
            }
            this.add(time, wrap);
        }
        add(date, text, error) {
            let time = document.createElement('span');
            time.innerHTML = new Date(date).toLocaleString();
            let txt = document.createElement('span');
            if (text instanceof HTMLElement) {
                txt.appendChild(text);
            }
            else {
                txt.innerHTML = text;
            }
            let div = document.createElement('div');
            div.appendChild(time);
            div.appendChild(txt);
            this.appendChild(div);
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
            if (error) {
                div.classList.add('danger');
            }
        }
    }
    mhd.LogElement = LogElement;
})(mhd || (mhd = {}));
window.customElements.define('log-data', mhd.LogElement, { extends: 'div' });
var mhd;
(function (mhd) {
    class ChangeElement extends HTMLDivElement {
        constructor() {
            super();
            this._interval = 3200;
        }
        connectedCallback() {
            let _that = this;
            this._btnWrap = document.createElement('div');
            this._btnWrap.classList.add('col-md-12');
            this._btnRun = document.createElement('button');
            this._btnRun.addEventListener('click', () => {
                if (_that._timer) {
                    _that.stop();
                }
                else {
                    _that.start();
                }
            });
            this._btnOneStep = document.createElement('button');
            this._btnOneStep.innerHTML = 'Один шаг';
            this._btnOneStep.addEventListener('click', () => {
                _that.stop();
                _that.getQueue();
            });
            this._btnWrap.appendChild(this._btnRun);
            this._btnWrap.appendChild(this._btnOneStep);
            this.parentElement.insertBefore(this._btnWrap, this);
            this.getQueue();
            this.start();
        }
        start() {
            let _that = this;
            this._timer = window.setInterval(() => {
                _that.getQueue();
            }, this._interval);
            this._btnRun.innerHTML = 'Стоп';
        }
        stop() {
            window.clearInterval(this._timer);
            this._timer = null;
            this._btnRun.innerHTML = 'Пуск';
        }
        getQueue() {
            let _that = this;
            fetch('model-history/default/get-queue')
                .then((res) => {
                return res.json();
            })
                .then((data) => {
                _that.add('Пытаюсь изменить запись');
                _that.requestQueue(data);
            })
                .catch((err) => {
                _that.add('Произошла ошибка получения данных', true);
            });
        }
        requestQueue(data) {
            let _that = this;
            fetch('model-history/default/change-queue', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            })
                .then((res) => {
                return res.json();
            })
                .then((data) => {
                let dirty = [];
                for (let p in data.dirty) {
                    dirty.push(p);
                }
                if (dirty.length) {
                    _that.add('Изменились поля ' + dirty.join(', '));
                }
            })
                .catch((err) => {
                _that.add('Произошла ошибка получения данных', true);
            });
        }
        add(text, error) {
            let time = document.createElement('span');
            time.innerHTML = new Date().toLocaleString();
            let txt = document.createElement('span');
            txt.innerHTML = text;
            let div = document.createElement('div');
            div.appendChild(time);
            div.appendChild(txt);
            this.appendChild(div);
            div.scrollIntoView({ behavior: 'smooth', block: 'end' });
            if (error) {
                div.classList.add('danger');
            }
        }
    }
    mhd.ChangeElement = ChangeElement;
})(mhd || (mhd = {}));
window.customElements.define('change-data', mhd.ChangeElement, { extends: 'div' });
let model;
let log;
let change;
document.addEventListener('DOMContentLoaded', () => {
    let container = document.querySelector('.change-log');
    log = new mhd.LogElement();
    log.classList.add('col-md-6');
    model = new mhd.ModelElement({
        log: log,
    });
    model.classList.add('col-md-6');
    change = new mhd.ChangeElement();
    change.classList.add('col-md-12');
    container.replaceChild(log, document.querySelector('#log'));
    container.replaceChild(model, document.querySelector('#model'));
    container.replaceChild(change, document.querySelector('#change'));
});
