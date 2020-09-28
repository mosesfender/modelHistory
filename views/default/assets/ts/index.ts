let model: HTMLDivElement;
let log: HTMLDivElement;
let change: HTMLDivElement;

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