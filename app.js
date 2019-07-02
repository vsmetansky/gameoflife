import Field from './modules/field.js';

const FIELD_DIM = 50;
const ALIVE_NUM = 1000;
const SPACE_KEY_CODE = 'Space';

const app = document.getElementById('app');

const field = new Field(FIELD_DIM, ALIVE_NUM);

window.addEventListener('load', () => {
    field.render(app);
});

window.addEventListener('keypress', (event) => {
    if (event.code === SPACE_KEY_CODE) {
        field.evolve();
        field.render(app);
    }
});
