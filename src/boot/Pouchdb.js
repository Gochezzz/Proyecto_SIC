import PouchDB from 'pouchdb';
const cuentasER = new PouchDB('cuentasER');
const cuentasBG = new PouchDB('cuentasBG');
const catalogoER = new PouchDB('catalogoER');
const catalogoBG = new PouchDB('catalogoBG');
const dupontDB = new PouchDB('dupontDB');
export { cuentasER, catalogoER, cuentasBG, catalogoBG, dupontDB };//Exportamos las bases
