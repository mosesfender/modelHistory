module mhd {

    export class LogElement extends HTMLDivElement {

        log(data: Array<mhd.IChangedModel>) {
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

        add(date: number, text: string | HTMLElement, error?: boolean) {
            let time = document.createElement('span');
            time.innerHTML = new Date(date).toLocaleString();
            let txt = document.createElement('span');
            if (text instanceof HTMLElement) {
                txt.appendChild(text);
            } else {
                txt.innerHTML = text;
            }
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

window.customElements.define('log-data', mhd.LogElement, {extends: 'div'});