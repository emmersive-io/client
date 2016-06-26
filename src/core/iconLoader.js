import onReady from './onReady';

export default function (fileName) {
    fetch(fileName, {method: 'GET'})
        .then(response => response.text())
        .then(text => onReady(() => document.body.insertAdjacentHTML('afterbegin', text)));
}