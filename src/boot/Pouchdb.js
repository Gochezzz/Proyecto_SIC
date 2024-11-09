import PouchDB from 'pouchdb';
const cuentasER = new PouchDB('cuentasER');
const cuentasBG = new PouchDB('cuentasBG');
const catalogoER = new PouchDB('catalogoER');
const catalogoBG = new PouchDB('catalogoBG');
export { cuentasER, catalogoER, cuentasBG, catalogoBG };//Exportamos las bases