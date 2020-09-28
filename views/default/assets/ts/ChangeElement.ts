module mhd {

    export interface IChangedData {
        model: mhd.IModel;
        dirty: Object;
    }

    export class ChangeElement extends HTMLDivElement {
        protected _interval: number = 3200;
        private _timer;

        private _btnWrap: HTMLDivElement;
        private _btnRun: HTMLButtonElement;
        private _btnOneStep: HTMLButtonElement;

        constructor() {
            super();
        }

        connectedCallback() {
            let _that = this;
            this._btnWrap = document.createElement('div');
            this._btnWrap.classList.add('col-md-12');

            this._btnRun = document.createElement('button');
            this._btnRun.addEventListener('click', () => {
                if (_that._timer) {
                    _that.stop();
                } else {
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
                .then((res: Response) => {
                    return res.json();
                })
                .then((data: mhd.IModel) => {
                    _that.add('Пытаюсь изменить запись');
                    _that.requestQueue(data);
                })
                .catch((err) => {
                    _that.add('Произошла ошибка получения данных', true);
                });
        }

        requestQueue(data: mhd.IModel) {
            let _that = this;
            fetch('model-history/default/change-queue', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            })
                .then((res: Response) => {
                    return res.json();
                })
                .then((data: mhd.IChangedData) => {
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

        add(text: string, error?: boolean) {
            let time = document.createElement('span');
            time.innerHTML = new Date().toLocaleString();
            let txt = document.createElement('span');
            txt.innerHTML = text;
            let div = document.createElement('div');
            div.appendChild(time);
            div.appendChild(txt);
            this.appendChild(div);
            div.scrollIntoView({behavior: 'smooth', block: 'end'});
            if (error) {
                div.classList.add('danger');
            }
        }
    }
}

window.customElements.define('change-data', mhd.ChangeElement, {extends: 'div'});